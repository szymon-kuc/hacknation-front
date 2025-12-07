"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import {notFound, unauthorized} from "next/navigation";

// Sanitizacja

// Limity pól
const MAX = {
  category: 100,
  location: 50,
  description: 400,
  issueNumber: 40,
};

// Prosta funkcja sanityzująca dane (kontrolne znaki, < >, trim)

const sanitize = (v: string) =>
    (v || "")
        .replace(/[\u0000-\u001F\u007F]/g, "")
        .replace(/[<>]/g, "")
        .trim();

// Walidacja — tylko dla pól obecnych w initialValues
const validationSchema = Yup.object({
    itemName: Yup.string().required("Nazwa przedmiotu jest wymagana").max(100),
    description: Yup.string().required("Opis jest wymagany").max(400),
    entryDate: Yup.string().required("Data wprowadzenia jest wymagana"),
    foundDate: Yup.string()
        .required("Data znalezienia jest wymagana")
        .test("not-in-future", "Data nie może być w przyszłości", (value) => {
            if (!value) return false;
            const selected = new Date(value);
            const today = new Date();
            selected.setHours(0,0,0,0);
            today.setHours(0,0,0,0);
            return selected.getTime() <= today.getTime();
        }),
    issueNumber: Yup.string().required("Numer sprawy jest wymagany"),
    whereFound: Yup.string().nullable(),
    type: Yup.string().required("Typ jest wymagany"),
});

const Page = () => {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated) return unauthorized();

    const [serverError, setServerError] = useState<string | null>(null);
    const [serverSuccess, setServerSuccess] = useState<string | null>(null);

    // Ustawiamy entryDate na aktualną datę systemową (YYYY-MM-DD)
    const today = new Date();
    const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);

    const initialValues = {
        itemName: "",
        description: "",
        foundDate: "",
        type: "",
        issueNumber: "",
        whereFound: "",
        entryDate: todayStr,
    };

    const onSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
        setServerError(null);
        setServerSuccess(null);
        console.log("USER", user);
        try {
            const payload = {
                itemName: sanitize(values.itemName),
                description: sanitize(values.description),
                documentTransferDate: new Date(today.getTime() - today.getTimezoneOffset() * 60000)
                    .toISOString(), //todo
                entryDate: new Date(today.getTime() - today.getTimezoneOffset() * 60000)
                    .toISOString(),
                foundDate: new Date(sanitize(values.foundDate)).toISOString(),
                issueNumber: sanitize(values.issueNumber),
                whereStorred: user.city ?? '', //todo
                whereFound: sanitize(values.whereFound),
                type: sanitize(values.type),
                status: "nowy",
                voivodeship: user.voivodeship, //todo
                issuerId: user.id,
            };
            console.log(JSON.stringify(payload))


            const token =
                (typeof window !== "undefined" && (localStorage.getItem("token") || localStorage.getItem("authToken"))) ||
                process.env.NEXT_PUBLIC_TOKEN ||
                "";

            if (!token) {
                throw new Error("Brak tokenu autoryzacyjnego. Zaloguj się ponownie.");
            }

            const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
            const url = `${base}/item`;

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => ({} as any));

            if (!res.ok) {
                const msg = data?.message || data?.error || `Błąd zapisu (${res.status})`;
                throw new Error(msg);
            }

            setServerSuccess("Pomyślnie zapisano przedmiot.");
            resetForm();
        } catch (e: any) {
            setServerError(e.message || "Nie udało się zapisać.");
        } finally {
            setSubmitting(false);
        }
    };

  return (
    <div className="container mb-50">
      <div className="official-form form">
        <h1 className="section-title">Wprowadź dane:</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, isValid, touched, errors }) => (
            <Form noValidate>
              {serverError && (
                <div className="error-text" role="alert">
                  {serverError}
                </div>
              )}
              {serverSuccess && (
                <div style={{ color: "#2e7d32", fontSize: 14 }}>
                  {serverSuccess}
                </div>
              )}

              <div className="form-row">
                <label htmlFor="itemName">Nazwa przedmiotu</label>
                <Field
                  id="itemName"
                  name="itemName"
                  type="text"
                  placeholder="Wpisz nazwę przedmiotu"
                  maxLength={100}
                  aria-invalid={touched.itemName && !!errors.itemName}
                  aria-describedby="itemName-error"
                  as="input"
                />
                <ErrorMessage
                  name="itemName"
                  render={(msg) => (
                    <div id="itemName-error" className="error-text">
                      {msg}
                    </div>
                  )}
                />
              </div>

              <div className="form-row">
                <label htmlFor="entryDate">Data wprowadzenia</label>
                <Field
                  id="entryDate"
                  name="entryDate"
                  type="date"
                  readOnly
                  aria-invalid={touched.entryDate && !!errors.entryDate}
                  aria-describedby="entryDate-error"
                  as="input"
                />
                <ErrorMessage
                  name="entryDate"
                  render={(msg) => (
                    <div id="entryDate-error" className="error-text">
                      {msg}
                    </div>
                  )}
                />
              </div>

              <div className="form-row">
                <label htmlFor="foundDate">Data znalezienia</label>
                <Field
                  id="foundDate"
                  name="foundDate"
                  type="date"
                  aria-invalid={touched.foundDate && !!errors.foundDate}
                  aria-describedby="foundDate-error"
                  as="input"
                />
                <ErrorMessage
                  name="foundDate"
                  render={(msg) => (
                    <div id="foundDate-error" className="error-text">
                      {msg}
                    </div>
                  )}
                />
              </div>

              <div className="form-row">
                <label htmlFor="type">Kategoria / rodzaj</label>
                <Field
                  id="type"
                  name="type"
                  type="text"
                  placeholder="np. Elektronika, Dokumenty, Klucze"
                  maxLength={MAX.category}
                  aria-invalid={touched.type && !!errors.type}
                  aria-describedby="type-error"
                  as="input"
                />
                <ErrorMessage
                  name="type"
                  render={(msg) => (
                    <div id="type-error" className="error-text">
                      {msg}
                    </div>
                  )}
                />
              </div>

              <div className="form-row">
                <label htmlFor="description">Opis</label>
                <Field
                  id="description"
                  name="description"
                  as="textarea"
                  rows={4}
                  placeholder="Krótki opis rzeczy"
                  maxLength={MAX.description}
                  aria-invalid={touched.description && !!errors.description}
                  aria-describedby="description-error"
                />
                <ErrorMessage
                  name="description"
                  render={(msg) => (
                    <div id="description-error" className="error-text">
                      {msg}
                    </div>
                  )}
                />
              </div>

              <div className="form-row">
                <label htmlFor="whereFound">Miejsce znalezienia</label>
                <Field
                  id="whereFound"
                  name="whereFound"
                  type="text"
                  placeholder="Gdzie znaleziono rzecz"
                  maxLength={MAX.location}
                  aria-invalid={touched.whereFound && !!errors.whereFound}
                  aria-describedby="whereFound-error"
                  as="input"
                />
                <ErrorMessage
                  name="whereFound"
                  render={(msg) => (
                    <div id="whereFound-error" className="error-text">
                      {msg}
                    </div>
                  )}
                />
              </div>


                <div className="form-row">
                    <label htmlFor="issueNumber">Numer sprawy</label>
                    <Field
                        id="issueNumber"
                        name="issueNumber"
                        type="text"
                        placeholder="Numer sprawy"
                        maxLength={MAX.issueNumber}
                        aria-invalid={touched.issueNumber && !!errors.issueNumber}
                        aria-describedby="issueNumber-error"
                        as="input"
                    />
                    <ErrorMessage
                        name="issueNumber"
                        render={(msg) => (
                            <div id="issueNumber-error" className="error-text">
                                {msg}
                            </div>
                        )}
                    />
                </div>
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-md btn-secondary"
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? "Wysyłanie..." : "Zapisz"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Page;
