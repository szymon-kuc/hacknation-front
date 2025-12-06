"use client";
import dataExample from "./data.json";
import List from "@/components/List/List";
import { IEventItem } from "@/types/types";
import "@/styles/lista-znalezionych/style.css";

export default function FoundListPage() {
    const {foundItems} : {foundItems: IEventItem[]} = dataExample

  return (
    <main className="main-found-list">
      <div className="container">
        <div className="main-found-list">
          <h1 className="main-found-list__title">Lista rzeczy znalezionych</h1>
          {(foundItems && foundItems.length > 0) && <List foundItems={foundItems} />}
        </div>
      </div>
    </main>
  );
}