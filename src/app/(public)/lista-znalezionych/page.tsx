"use client";
import dataExample from "./data.json";
import List from "@/components/List/List";
import { IEventItem } from "@/types/types";
import "@/styles/lista-znalezionych/style.css";
import { useEffect, useState } from "react";
import Search from "@/components/Search/Search";
import Filters from "@/components/Filters/Filters";

export default function FoundListPage() {
  const [foundItems, setFoundItems] = useState<IEventItem[]>(
    dataExample.foundItems
  );
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) return;

    const controller = new AbortController();

    const fetchItems = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/found-items`, {
          signal: controller.signal,
        });
        if (!response.ok) return;

        const payload = await response.json();
        const items: IEventItem[] = Array.isArray(payload)
          ? payload
          : payload?.foundItems || [];
        if (items.length > 0) {
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

  return (
    <div className="container mb-50">
      <div className="global-white-bg">
        <div className="main-found-list">
          <h1 className="main-found-list__title">
            Baza przedmiotów znalezionych
          </h1>
          <div className="main-found-list__forms-wrapper">
            <Search setFoundItems={setFoundItems} />
            <Filters />
          </div>
          {foundItems && foundItems.length > 0 && (
            <List foundItems={foundItems} isOfficial={false} />
          )}
        </div>
      </div>
    </div>
  );
}
