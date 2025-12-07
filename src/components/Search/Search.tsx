import { Formik, Form, Field } from "formik";
import SearchIcon from '@mui/icons-material/Search';

export default function Search({ onQueryChange }: { onQueryChange: (q: string) => void }) {
  return (
    <Formik
      initialValues={{ query: "" }}
      onSubmit={({ query }, { setSubmitting }) => {
        onQueryChange((query || "").trim());
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className="form form--search" onChange={(e) => {
          const target = e.target as HTMLInputElement;
          if (target && target.name === 'query') {
            const v = target.value;
            setFieldValue('query', v);
            onQueryChange(v);
          }
        }}>
          <label htmlFor="query">Szukaj</label>
          <div className="form-row form-row--row">
            <Field id="query" name="query" placeholder="Słowa kluczowe (nazwa, opis, typ)" />
            <div className="form-actions">
              <button type="submit" className="btn btn-search" disabled={isSubmitting} aria-label="Szukaj">
                <SearchIcon fontSize="small" />
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
