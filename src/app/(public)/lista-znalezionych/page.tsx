"use client";
import dataExample from "./data.json";
import List from "@/components/List/List";
import { IEventItem } from "@/types/types";
import "@/styles/lista-znalezionych/style.css";
import { useEffect, useMemo, useState } from "react";
import Search from "@/components/Search/Search";
import Filters from "@/components/Filters/Filters";

export default function FoundListPage() {
  // Full dataset fetched from API (fallback to sample)
  const [allItems, setAllItems] = useState<IEventItem[]>(
    dataExample.foundItems
  );
  // Rendered, filtered items
  const [foundItems, setFoundItems] = useState<IEventItem[]>(
    dataExample.foundItems
  );

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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) return;

    const controller = new AbortController();

    const fetchItems = async () => {
      try {
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



          if (Array.isArray(items) && items.length > 0) {
            setAllItems(items);
            setFoundItems(items);
          }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch found items", error);
      }
    };

    fetchItems();

    return () => controller.abort();
  }, []);

  // Recompute filtered list on any filter change
  useEffect(() => {
    setFoundItems(applyFilters(allItems));
  }, [applyFilters, allItems]);

  return (
    <div className="container mb-50">
      <div className="global-white-bg">
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
          {foundItems && foundItems.length > 0 && (
            <List foundItems={foundItems} isOfficial={false} />
          )}
        </div>
      </div>
    </div>
  );
}
