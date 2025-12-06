"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import '@/components/Login/style/login.css'

const Login = () => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const initialValues = {
    email: "",
    password: "",
    remember: true,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Podaj poprawny adres e-mail")
      .required("E-mail jest wymagany"),
    password: Yup.string()
      .min(6, "Hasło musi mieć co najmniej 6 znaków")
      .required("Hasło jest wymagane"),
    remember: Yup.boolean(),
  });

  const sanitize = (v: string) =>
    v
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/[<>]/g, "")
      .trim();

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: { setSubmitting: (s: boolean) => void; resetForm: () => void }
  ) => {
    setServerError(null);
    setServerSuccess(null);
    try {
      const email = sanitize(values.email);
      const password = sanitize(values.password);

      const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
      const url = `${base}/api/auth/login`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));


      //todo jak będzie api

        if(email !== process.env.NEXT_PUBLIC_USERNAME || password !== process.env.NEXT_PUBLIC_PASSWORD) {
            const msg = data?.message || data?.error || "Błąd logowania. Sprawdź dane i spróbuj ponownie.";
              throw new Error(msg);
        }

      // if (!res.ok) {
      //   const msg = data?.message || data?.error || "Błąd logowania. Sprawdź dane i spróbuj ponownie.";
      //   throw new Error(msg);
      // }
      //
      // const token: string | undefined = data?.token || data?.accessToken || data?.jwt;
      // if (token) {
      //   try {
      //     localStorage.setItem("token", token);
      //     localStorage.setItem("authToken", token);
      //   } catch {}
      // }

      login();
      setServerSuccess("Zalogowano pomyślnie.");
      resetForm();
    } catch (e: any) {
      setServerError(e?.message || "Wystąpił nieznany błąd.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="official-form login-form form">
      <h2 className="section-title">Logowanie urzędnika</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting, isValid, touched, errors }) => (
          <Form noValidate>
            {serverError && <div className="error-text" role="alert">{serverError}</div>}
            {serverSuccess && <div style={{ color: "#2e7d32", fontSize: 14 }}>{serverSuccess}</div>}

            <div className="form-row">
              <label htmlFor="email">E-mail</label>
              <Field
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                aria-invalid={touched.email && !!errors.email}
                aria-describedby="email-error"
                as="input"
              />
              <ErrorMessage name="email" render={(msg) => (
                <div id="email-error" className="error-text">{msg}</div>
              )} />
            </div>

            <div className="form-row">
              <label htmlFor="password">Hasło</label>
              <Field
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={touched.password && !!errors.password}
                aria-describedby="password-error"
                as="input"
              />
              <ErrorMessage name="password" render={(msg) => (
                <div id="password-error" className="error-text">{msg}</div>
              )} />
            </div>

            {/*<div className="form-row" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>*/}
            {/*  <Field id="remember" name="remember" type="checkbox" as="input" />*/}
            {/*  <label htmlFor="remember" style={{ margin: 0 }}>Zapamiętaj mnie</label>*/}
            {/*</div>*/}

            <div className="form-actions">
              <button type="submit" disabled={isSubmitting || !isValid}>
                {isSubmitting ? "Logowanie..." : "Zaloguj się"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
