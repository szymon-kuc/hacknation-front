"use client";

import React, { useMemo, useState } from "react";

type Errors = Partial<{
  foundDate: string;
  category: string;
  description: string;
  location: string;
}>;

// Prosta funkcja sanityzująca: usuwa znaczniki HTML, kontrolne znaki i zwija białe znaki.
const sanitizeText = (input: string): string => {
  if (!input) return "";
  // strip HTML tags using the browser parser
  const div = typeof window !== "undefined" ? document.createElement("div") : null;
  const text = (() => {
    if (div) {
      div.innerHTML = input;
      return div.textContent || div.innerText || "";
    }
    return input;
  })();
  // remove control characters except newline and tab, collapse whitespace, trim
  return text
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Walidatory pól
const MAX = {
  category: 100,
  location: 50,
  description: 400,
};

const validateFoundDate = (value: string): string => {
  if (!value) return "Data jest wymagana";
  const selected = new Date(value);
  const today = new Date();
  // porównuj tylko część daty (bez czasu)
  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  if (selected > today) return "Data nie może być w przyszłości";
  return "";
};

const validateRequiredLen = (label: string, value: string, max: number): string => {
  if (!value || !value.trim()) return `${label} jest wymagane`;
  if (value.length > max) return `${label} nie może przekraczać ${max} znaków`;
  return "";
};

const Page = () => {
  const [foundDate, setFoundDate] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const isInvalid = useMemo(() => Object.values(errors).some(Boolean), [errors]);

  const validateAll = (): Errors => {
    const e: Errors = {};
    e.foundDate = validateFoundDate(foundDate);
    e.category = validateRequiredLen("Kategoria", category, MAX.category);
    e.description = validateRequiredLen("Opis", description, MAX.description);
    e.location = validateRequiredLen("Miejsce", location, MAX.location);
    Object.keys(e).forEach((k) => {
      // @ts-ignore
      if (!e[k]) delete e[k];
    });
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Walidacja
    const currentErrors = validateAll();
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setLoading(true);
    try {
      // Sanityzacja pól przed wysyłką
      const payload = {
        foundDate: sanitizeText(foundDate),
        category: sanitizeText(category),
        description: sanitizeText(description),
        location: sanitizeText(location),
      };

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("authToken") || process.env.NEXT_PUBLIC_TOKEN || ""
          : process.env.NEXT_PUBLIC_TOKEN || "";

      if (!token) {
        alert("Brak tokenu autoryzacyjnego. Zaloguj się ponownie.");
        setLoading(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""; // np. https://api.twojadomena.pl
        console.log(payload)
      // const url = `${baseUrl}/api/lost-items`;
      //
      // const res = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(payload),
      // });
      //
      // if (!res.ok) {
      //   const msg = await res.text();
      //   throw new Error(msg || `Błąd zapisu (${res.status})`);
      // }

      setFoundDate("");
      setCategory("");
      setDescription("");
      setLocation("");
      setErrors({});

      alert("Pomyślnie zapisano rzecz znalezioną.");
    } catch (err: any) {
      console.error(err);
      alert(`Nie udało się zapisać: ${err?.message || "nieznany błąd"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="section-title">Wprowadź dane rzeczy znalezionej:</h1>
      <div className="official-form">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="foundDate">Data znalezienia</label>
            <input
              id="foundDate"
              type="date"
              value={foundDate}
              onChange={(e) => {
                setFoundDate(e.target.value);
                setErrors((prev) => ({ ...prev, foundDate: undefined }));
              }}
              onBlur={() =>
                setErrors((prev) => ({ ...prev, foundDate: validateFoundDate(foundDate) || undefined }))
              }
              required
              aria-invalid={Boolean(errors.foundDate)}
              aria-describedby={errors.foundDate ? "foundDate-error" : undefined}
            />
            {errors.foundDate && (
              <span id="foundDate-error" className="error-text" role="alert">
                {errors.foundDate}
              </span>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="category">Kategoria / rodzaj</label>
            <input
              id="category"
              type="text"
              placeholder="np. Elektronika, Dokumenty, Klucze"
              value={category}
              onChange={(e) => {
                // proste ograniczenie znaków i usunięcie <>
                const raw = e.target.value.replace(/[<>]/g, "");
                if (raw.length <= MAX.category) setCategory(raw);
                setErrors((prev) => ({ ...prev, category: undefined }));
              }}
              onBlur={() =>
                setErrors((prev) => ({ ...prev, category: validateRequiredLen("Kategoria", category, MAX.category) || undefined }))
              }
              required
              autoComplete="off"
              inputMode="text"
              maxLength={MAX.category}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? "category-error" : undefined}
            />
            {errors.category && (
              <span id="category-error" className="error-text" role="alert">
                {errors.category}
              </span>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="description">Opis</label>
            <textarea
              id="description"
              placeholder="Krótki opis rzeczy"
              value={description}
              onChange={(e) => {
                const raw = e.target.value.replace(/[<>]/g, "");
                if (raw.length <= MAX.description) setDescription(raw);
                setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              onBlur={() =>
                setErrors((prev) => ({ ...prev, description: validateRequiredLen("Opis", description, MAX.description) || undefined }))
              }
              required
              rows={4}
              maxLength={MAX.description}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "description-error" : undefined}
            />
            {errors.description && (
              <span id="description-error" className="error-text" role="alert">
                {errors.description}
              </span>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="location">Miejsce znalezienia</label>
            <input
              id="location"
              type="text"
              placeholder="Gdzie znaleziono rzecz"
              value={location}
              onChange={(e) => {
                const raw = e.target.value.replace(/[<>]/g, "");
                if (raw.length <= MAX.location) setLocation(raw);
                setErrors((prev) => ({ ...prev, location: undefined }));
              }}
              onBlur={() =>
                setErrors((prev) => ({ ...prev, location: validateRequiredLen("Miejsce", location, MAX.location) || undefined }))
              }
              required
              autoComplete="off"
              inputMode="text"
              maxLength={MAX.location}
              aria-invalid={Boolean(errors.location)}
              aria-describedby={errors.location ? "location-error" : undefined}
            />
            {errors.location && (
              <span id="location-error" className="error-text" role="alert">
                {errors.location}
              </span>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading || isInvalid}>
              {loading ? "Wysyłanie..." : "Zapisz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page
