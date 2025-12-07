"use client";

import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { notFound } from "next/navigation";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  "application/pdf",
  "text/csv",
  "application/vnd.ms-excel", // xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
];

const validationSchema = Yup.object({
  file: Yup.mixed()
    .required("Plik jest wymagany")
    .test("fileSize", "Plik jest zbyt duży (max 10 MB)", (value) => {
      if (!value) return false;
      return (value as File).size <= MAX_FILE_SIZE;
    })
    .test("fileType", "Niedozwolony typ pliku (pdf, csv, xls, xlsx)", (value) => {
      if (!value) return false;
      const type = (value as File).type;
      return ALLOWED_TYPES.includes(type);
    }),
});

const Page = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return notFound();

  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const initialValues = { file: null as File | null };

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: { setSubmitting: (s: boolean) => void; resetForm: () => void }
  ) => {
    setServerError(null);
    setServerSuccess(null);
    try {
      const token =
        (typeof window !== "undefined" && (localStorage.getItem("token") || localStorage.getItem("authToken"))) ||
        process.env.NEXT_PUBLIC_TOKEN ||
        "";

      if (!token) {
        throw new Error("Brak tokenu autoryzacyjnego. Zaloguj się ponownie.");
      }

      if (!values.file) {
        throw new Error("Nie wybrano pliku.");
      }

      const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
      const url = `${base}/api/lost-items/import`;

      const formData = new FormData();
      formData.append("file", values.file);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // Spróbuj odczytać JSON, ale nie wymagaj
      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || `Błąd importu (${res.status})`;
        throw new Error(msg);
      }

      setServerSuccess(data?.message || "Plik został pomyślnie przesłany i przetworzony.");
      resetForm();
    } catch (e: any) {
      setServerError(e?.message || "Nie udało się przesłać pliku.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="official-form form">
        <h1 className="section-title">Import plików (PDF, CSV, XLS/XLSX)</h1>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting, isValid, setFieldValue, values, touched, errors }) => (
            <Form noValidate>
              {serverError && (
                <div className="error-text" role="alert">{serverError}</div>
              )}
              {serverSuccess && (
                <div style={{ color: "#2e7d32", fontSize: 14 }}>{serverSuccess}</div>
              )}

              <div className="form-row">
                <label htmlFor="file">Wybierz plik</label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf,.csv,.xls,.xlsx,application/pdf,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={(e) => {
                    const f = e.currentTarget.files && e.currentTarget.files[0];
                    setFieldValue("file", f || null);
                  }}
                  aria-invalid={touched.file && !!errors.file}
                  aria-describedby="file-error"
                />
                <ErrorMessage name="file" render={(msg) => (
                  <div id="file-error" className="error-text">{msg}</div>
                )} />
                {values.file && (
                  <div style={{ fontSize: 13, color: "#444" }}>
                    Wybrano: {values.file.name} ({(values.file.size / 1024).toFixed(0)} KB)
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" disabled={isSubmitting || !isValid}>
                  {isSubmitting ? "Wysyłanie..." : "Wyślij"}
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
