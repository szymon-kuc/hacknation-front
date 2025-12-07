'use client'
import data from "@/app/(public)/lista-znalezionych/data.json";
import List from "@/components/List/List";
import { IEventItem } from "@/types/types";
import { useAuth } from "@/context/AuthContext";
import Login from "@/components/Login/Login";
import { useEffect, useMemo, useState } from "react";
import Filters from "@/components/Filters/Filters";
import Search from "@/components/Search/Search";
import "@/styles/urzednik/style.css";


const Page = () => {
  const { isAuthenticated } = useAuth();

  // Full dataset fetched from API and currently displayed filtered list
  const [allItems, setAllItems] = useState<IEventItem[]>([]);
  const [foundItems, setFoundItems] = useState<IEventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search and filter controls
  const [query, setQuery] = useState<string>("");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");

  const normalize = (s?: string | null) =>
    (s || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}+/gu, "")
      .trim();

  const applyFilters = useMemo(() => {
    const nq = normalize(query);
    const nn = normalize(nameFilter);
    const nl = normalize(locationFilter);
    const keywords = nq ? nq.split(/\s+/).filter(Boolean) : [];

    return (items: IEventItem[]) => {
      return items.filter((it) => {
        const name = normalize(it.itemName);
        const desc = normalize(it.description);
        const typ = normalize(it.type);
        const where = normalize(it.whereFound as any);

        // Keyword search across name + description + type
        const hay = `${name} ${desc} ${typ}`;
        const matchesKeywords =
          keywords.length === 0 || keywords.every((k) => hay.includes(k));

        // Explicit field filters
        const matchesName = !nn || name.includes(nn);
        const matchesLocation = !nl || where.includes(nl);

        return matchesKeywords && matchesName && matchesLocation;
      });
    };
  }, [query, nameFilter, locationFilter]);

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

        const items: IEventItem[] = data.data.items;

        console.log(data.data);

        setAllItems(items);
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
      setAllItems([]);
      setFoundItems([]);
      setError(null);
    }
  }, [isAuthenticated]);

  // Recompute filtered list on any filter change
  useEffect(() => {
    setFoundItems(applyFilters(allItems));
  }, [applyFilters, allItems]);

  return (
      <div className="container">
          <div className="global-white-bg">
              {isAuthenticated ? (
                  <div className="main-found-list">
                      <h1 className="main-found-list__title">
                          Baza przedmiotów znalezionych
                      </h1>
                      <div className="main-found-list__forms-wrapper">
                          <Search onQueryChange={setQuery} />
                          <Filters
                            onFiltersChange={({ name, location }) => {
                              setNameFilter(name || "");
                              setLocationFilter(location || "");
                            }}
                          />
                      </div>
                      <List
                          setFoundItems={setFoundItems}
                          foundItems={foundItems}
                          isOfficial={true}
                      />
                      {/* Export controls under the table */}
                      <div
                        className="export-controls"
                        style={{
                          marginTop: 16,
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          flexWrap: "wrap",
                        }}
                      >
                        <span style={{ fontSize: 18 }}>
                          Wyeksportuj tabelę do pliku:
                        </span>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="btn btn-md btn-secondary"
                            aria-label="Eksportuj do PDF"
                            onClick={() => {
                              /* TODO: implement export to PDF */
                            }}
                          >
                            PDF
                          </button>
                          <button
                            type="button"
                            className="btn btn-md btn-secondary"
                            aria-label="Eksportuj do Excel"
                            onClick={() => {
                              /* TODO: implement export to Excel */
                            }}
                          >
                            Excel
                          </button>
                          <button
                            type="button"
                            className="btn btn-md btn-secondary"
                            aria-label="Eksportuj do Word"
                            onClick={() => {
                              /* TODO: implement export to Word */
                            }}
                          >
                            Word
                          </button>
                        </div>
                      </div>
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
