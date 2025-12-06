"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {useAuth} from "@/context/AuthContext";
import {notFound} from "next/navigation";

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

// Walidacja Yup, w tym data nie późniejsza niż dziś
const validationSchema = Yup.object({
    foundDate: Yup.string()
        .required("Data jest wymagana")
        .test("not-in-future", "Data nie może być w przyszłości", (value) => {
            if (!value) return false;
            const selected = new Date(value);
            const today = new Date();
            selected.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            return selected.getTime() <= today.getTime();
        }),
    category: Yup.string()
        .required("Kategoria jest wymagana")
        .max(MAX.category, `Kategoria nie może przekraczać ${MAX.category} znaków`),
    description: Yup.string()
        .required("Opis jest wymagany")
        .max(MAX.description, `Opis nie może przekraczać ${MAX.description} znaków`),
    location: Yup.string()
        .required("Miejsce jest wymagane")
        .max(MAX.location, `Miejsce nie może przekraczać ${MAX.location} znaków`),
});

const Page = () => {

    const {isAuthenticated} = useAuth();

    if(!isAuthenticated) return notFound();

    const [serverError, setServerError] = useState<string | null>(null);
    const [serverSuccess, setServerSuccess] = useState<string | null>(null);

    const initialValues = {
        foundDate: "",
        category: "",
        description: "",
        location: "",
    };

    const onSubmit = async (
        values: typeof initialValues,
        { setSubmitting, resetForm }: { setSubmitting: (s: boolean) => void; resetForm: () => void }
    ) => {
        setServerError(null);
        setServerSuccess(null);
        try {
            const payload = {
                foundDate: sanitize(values.foundDate),
                category: sanitize(values.category),
                description: sanitize(values.description),
                location: sanitize(values.location),
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
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => ({} as any));

            if (!res.ok) {
                const msg = (data && (data.message || data.error)) || `Błąd zapisu (${res.status})`;
                throw new Error(msg);
            }

            setServerSuccess("Pomyślnie zapisano rzecz znalezioną.");
            resetForm();
        } catch (e: any) {
            setServerError(e?.message || "Nie udało się zapisać.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container">

            <div className="official-form form">
                <h1 className="section-title">Wprowadź dane:</h1>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {({ isSubmitting, isValid, touched, errors }) => (
                        <Form noValidate>
                            {serverError && (
                                <div className="error-text" role="alert">{serverError}</div>
                            )}
                            {serverSuccess && (
                                <div style={{ color: "#2e7d32", fontSize: 14 }}>{serverSuccess}</div>
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
                                <ErrorMessage name="foundDate" render={(msg) => (
                                    <div id="foundDate-error" className="error-text">{msg}</div>
                                )} />
                            </div>

                            <div className="form-row">
                                <label htmlFor="category">Kategoria / rodzaj</label>
                                <Field
                                    id="category"
                                    name="category"
                                    type="text"
                                    placeholder="np. Elektronika, Dokumenty, Klucze"
                                    maxLength={MAX.category}
                                    aria-invalid={touched.category && !!errors.category}
                                    aria-describedby="category-error"
                                    as="input"
                                />
                                <ErrorMessage name="category" render={(msg) => (
                                    <div id="category-error" className="error-text">{msg}</div>
                                )} />
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
                                <ErrorMessage name="description" render={(msg) => (
                                    <div id="description-error" className="error-text">{msg}</div>
                                )} />
                            </div>

                            <div className="form-row">
                                <label htmlFor="location">Miejsce znalezienia</label>
                                <Field
                                    id="location"
                                    name="location"
                                    type="text"
                                    placeholder="Gdzie znaleziono rzecz"
                                    maxLength={MAX.location}
                                    aria-invalid={touched.location && !!errors.location}
                                    aria-describedby="location-error"
                                    as="input"
                                />
                                <ErrorMessage name="location" render={(msg) => (
                                    <div id="location-error" className="error-text">{msg}</div>
                                )} />
                            </div>

                            <div className="form-actions">
                                <button type="submit" disabled={isSubmitting || !isValid}>
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
