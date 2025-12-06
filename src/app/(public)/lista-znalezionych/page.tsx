"use client";
import dataExample from "./data.json";
import List from "@/components/List/List";
import { IEventItem } from "@/types/types";
import "@/styles/lista-znalezionych/style.css";
import { useEffect, useState } from "react";
import Search from "@/components/Search/Search";

export default function FoundListPage() {
    const [foundItems, setFoundItems] = useState<IEventItem[]>(dataExample.foundItems);
    useEffect(() => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;

      const controller = new AbortController();

      const fetchItems = async () => {
        try {
          const response = await fetch(`${baseUrl}/api/found-items`, { signal: controller.signal });
          if (!response.ok) return;

          const payload = await response.json();
          const items: IEventItem[] = Array.isArray(payload) ? payload : payload?.foundItems || [];
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
    <main className="main-found-list">
      <div className="container">
        <div className="main-found-list">
          <h1 className="main-found-list__title">Lista rzeczy znalezionych</h1>
            <Search setFoundItems={setFoundItems} />
          {(foundItems && foundItems.length > 0) && <List foundItems={foundItems} isOfficial={false}/>}
        </div>
      </div>
    </main>
  );
}
