"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { notFound } from "next/navigation";

// Sanitizacja
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

                console.log(JSON.stringify(payload));
            const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
            const url = `${base}/item`;

            const res = await fetch(url, {
                method: "OPTIONS",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => ({} as any));
            console.log("USER ID:", userId);
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
        <div className="container">
            <div className="official-form form">
                <h1 className="section-title">Dodaj przedmiot</h1>

                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {({ isSubmitting, isValid, touched, errors }) => (
                        <Form noValidate>
                            {serverError && <div className="error-text">{serverError}</div>}
                            {serverSuccess && <div style={{ color: "#2e7d32" }}>{serverSuccess}</div>}

                            {/* POLA FORMULARZA */}
                            {Object.keys(initialValues).map((key) => (
                                <div className="form-row" key={key}>
                                    <label htmlFor={key}>{key}</label>
                                    <Field
                                        id={key}
                                        name={key}
                                        type={
                                            key.includes("Date")
                                                ? "date"
                                                : "text"
                                        }
                                        as={key === "description" ? "textarea" : "input"}
                                        aria-invalid={touched[key as keyof typeof touched] && !!errors[key as keyof typeof errors]}
                                        aria-describedby={`${key}-error`}
                                    />
                                    <ErrorMessage
                                        name={key}
                                        render={(msg) => <div id={`${key}-error`} className="error-text">{msg}</div>}
                                    />
                                </div>
                            ))}

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
