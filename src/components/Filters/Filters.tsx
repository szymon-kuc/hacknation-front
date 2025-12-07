import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Filters() {
    const validationSchema = Yup.object({
        date: Yup.string().trim(),
        location: Yup.string().trim(),
    }).test(
        "at-least-one",
        "Wpisz lokalizację lub wybierz datę",
        (values) => !!values && (!!values.date || !!values.location?.trim())
    );

    return (
        <div className="filters">
            <Formik
                initialValues={{ date: "", location: "" }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    console.log("Applied filters", values);
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="form">
                        <div className="form-row form-row--row">
                            <div className="form-row">
                                <label htmlFor="date">Data znalezienia</label>
                                <Field id="date" name="date" type="date" as="input" />
                                <ErrorMessage
                                    name="date"
                                    component="div"
                                    className="error-text"
                                />
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
                                <ErrorMessage
                                    name="location"
                                    component="div"
                                    className="error-text"
                                />
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
