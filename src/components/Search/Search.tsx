import { Dispatch, SetStateAction } from "react";
import { IEventItem } from "@/types/types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Search({setFoundItems}: {setFoundItems: Dispatch<SetStateAction<IEventItem[]>>}) {
    async function search(query: string) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const url = `${baseUrl}/api/found-items?query=${encodeURIComponent(query)}`;

        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Request failed with status ${res.status}`);
            }

            const data = await res.json();
            const items: IEventItem[] = Array.isArray(data) ? data : data?.foundItems || [];
            setFoundItems(items);
        } catch (error) {
            console.error("Search request failed", error);
        }
    }

    const validationSchema = Yup.object({
        query: Yup.string().trim().required("Please enter a search term"),
    });

    return (
        <Formik
            initialValues={{ query: "" }}
            validationSchema={validationSchema}
            onSubmit={async ({ query }, { setSubmitting }) => {
                const trimmedQuery = query.trim();
                if (!trimmedQuery) {
                    setFoundItems([]);
                    setSubmitting(false);
                    return;
                }

                await search(trimmedQuery);
                setSubmitting(false);
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <Field name="query" />
                    <ErrorMessage name="query" component="div" />
                    <button type="submit" disabled={isSubmitting}>Submit</button>
                </Form>
            )}
        </Formik>
    )
}
