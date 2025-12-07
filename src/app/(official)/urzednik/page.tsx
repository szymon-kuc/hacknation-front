'use client'
import data from "@/app/(public)/lista-znalezionych/data.json";
import List from "@/components/List/List";
import { IEventItem } from "@/types/types";
import { useAuth } from "@/context/AuthContext";
import Login from "@/components/Login/Login";
import { useEffect, useState } from "react";
import Filters from "@/components/Filters/Filters";
import Search from "@/components/Search/Search";
import "@/styles/urzednik/style.css";


const Page = () => {
  const { isAuthenticated } = useAuth();

  const [foundItems, setFoundItems] = useState<IEventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const token =
          (typeof window !== "undefined" && (localStorage.getItem("token") || localStorage.getItem("authToken"))) ||
          process.env.NEXT_PUBLIC_TOKEN ||
          "";

        const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
        const url = `${base}/items/1`;

        const res = await fetch(url, {
          method: "GET",
        });

        let data: any = null;
        try {
          data = await res.json();
        } catch {}

        if (!res.ok) {
          const msg = (data && (data.message || data.error)) || `Błąd pobierania (${res.status})`;
          throw new Error(msg);
        }

        const items: IEventItem[] = data.items;

        console.log(data);

        setFoundItems(items);
      } catch (e: any) {
        setError(e?.message || "Nie udało się pobrać listy.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchItems();
    } else {
      setFoundItems([]);
      setError(null);
    }
  }, [isAuthenticated]);

  return (
      <div className="container">
          <div className="global-white-bg">
              {isAuthenticated ? (
                  <div className="main-found-list">
                      <h1 className="main-found-list__title">
                          Baza przedmiotów znalezionych
                      </h1>
                      <div className="main-found-list__forms-wrapper">
                          <Search setFoundItems={setFoundItems} />
                          <Filters />
                      </div>
                      <List
                          setFoundItems={setFoundItems}
                          foundItems={foundItems}
                          isOfficial={true}
                      />
                  </div>
              ) : (
                  <>
                      <Login />
                  </>
              )}
          </div>
      </div>
  );
}
export default Page
