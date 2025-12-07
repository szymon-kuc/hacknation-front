"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { notFound } from "next/navigation";

// Sanitizacja

// Limity pól
const MAX = {
  category: 100,
  location: 50,
  description: 400,
};

// Prosta funkcja sanityzująca dane (kontrolne znaki, < >, trim)

const sanitize = (v: string) =>
    (v || "")
        .replace(/[\u0000-\u001F\u007F]/g, "")
        .replace(/[<>]/g, "")
        .trim();

// Walidacja
const validationSchema = Yup.object({
    itemName: Yup.string().required("Nazwa przedmiotu jest wymagana").max(100),
    description: Yup.string().required("Opis jest wymagany").max(400),
    documentTransferDate: Yup.string().required("Data przekazania dokumentu jest wymagana"),
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
    whereStorred: Yup.string().required("Miejsce przechowania jest wymagane"),
    whereFound: Yup.string().nullable(),
    type: Yup.string().required("Typ jest wymagany"),
    status: Yup.string().required("Status jest wymagany"),
    voivodeship: Yup.string().required("Województwo jest wymagane"),
});

const Page = () => {
    const { isAuthenticated, userId } = useAuth();
    if (!isAuthenticated) return notFound();

    const [serverError, setServerError] = useState<string | null>(null);
    const [serverSuccess, setServerSuccess] = useState<string | null>(null);

    const initialValues = {
        itemName: "",
        description: "",
        documentTransferDate: "",
        entryDate: "",
        foundDate: "",
        issueNumber: "",
        whereStorred: "",
        whereFound: "",
        type: "",
        status: "",
        voivodeship: "",
    };

    const onSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
        setServerError(null);
        setServerSuccess(null);

        try {
            const payload = {
                itemName: sanitize(values.itemName),
                description: sanitize(values.description),
                documentTransferDate: sanitize(values.documentTransferDate),
                entryDate: sanitize(values.entryDate),
                foundDate: sanitize(values.foundDate),
                issueNumber: sanitize(values.issueNumber),
                whereStorred: sanitize(values.whereStorred),
                whereFound: sanitize(values.whereFound),
                type: sanitize(values.type),
                status: sanitize(values.status),
                voivodeship: sanitize(values.voivodeship),
                issuer_id: userId,
            };

            const token =
                (typeof window !== "undefined" && (localStorage.getItem("token") || localStorage.getItem("authToken"))) ||
                process.env.NEXT_PUBLIC_TOKEN ||
                "";

            if (!token) {
                throw new Error("Brak tokenu autoryzacyjnego. Zaloguj się ponownie.");
            }

            const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
            const url = `${base}/api/lost-items`;

            const res = await fetch(url, {
                method: "OPTIONS",
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
                <label htmlFor="category">Kategoria / rodzaj</label>
                <Field
                  id="category"
                  name="category"
                  type="text"
                  placeholder="np. Elektronika, Dokumenty, Klucze"
                  maxLength={MAX.category}
                  aria-invalid={touched.type && !!errors.type}
                  aria-describedby="category-error"
                  as="input"
                />
                <ErrorMessage
                  name="category"
                  render={(msg) => (
                    <div id="category-error" className="error-text">
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
                <label htmlFor="location">Miejsce znalezienia</label>
                <Field
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Gdzie znaleziono rzecz"
                  maxLength={MAX.location}
                  aria-invalid={touched.whereFound && !!errors.whereFound}
                  aria-describedby="location-error"
                  as="input"
                />
                <ErrorMessage
                  name="location"
                  render={(msg) => (
                    <div id="location-error" className="error-text">
                      {msg}
                    </div>
                  )}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-lg btn-primary"
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
