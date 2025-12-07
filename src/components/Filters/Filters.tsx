import { Formik, Form, Field } from "formik";

type FiltersPayload = { name?: string; location?: string; date?: string };

export default function Filters({
  onFiltersChange,
}: {
  onFiltersChange: (filters: FiltersPayload) => void;
}) {
  return (
    <div className="filters">
      <Formik
        initialValues={{ name: "", location: "", date: "" }}
        onSubmit={(values, { setSubmitting }) => {
          onFiltersChange(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form
            className="form"
            onChange={(e) => {
              const t = e.target as HTMLInputElement;
              if (!t?.name) return;
              setFieldValue(t.name, t.value);
              onFiltersChange({ ...values, [t.name]: t.value });
            }}
          >
            <div className="form-row form-row--row">
              <div className="form-row">
                <label htmlFor="name">Nazwa</label>
                <Field id="name" name="name" type="text" placeholder="Nazwa przedmiotu" as="input" />
              </div>

              <div className="form-row">
                <label htmlFor="location">Lokalizacja</label>
                <Field
                  id="location"
                  name="location"
                  type="text"
                  placeholder="np. Warszawa"
                  as="input"
                />
              </div>

              <div className="form-row">
                <label htmlFor="date">Data znalezienia</label>
                <Field id="date" name="date" type="date" as="input" />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-secondary-reverse btn-lg" disabled={isSubmitting}>
                  Filtruj
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
