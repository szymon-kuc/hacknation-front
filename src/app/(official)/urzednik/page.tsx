"use client";
import data from "@/app/(public)/lista-znalezionych/data.json";
import List from "@/components/List/List";
import { IEventItem } from "@/types/types";
import dataExample from "@/app/(public)/lista-znalezionych/data.json";
import { useAuth } from "@/context/AuthContext";
import Login from "@/components/Login/Login";
import { useState } from "react";
import "@/styles/urzednik/style.css";
import Filters from "@/components/Filters/Filters";
import Search from "@/components/Search/Search";

const Page = () => {
  const [foundItems, setFoundItems] = useState<IEventItem[]>(
    dataExample.foundItems
  );

  const { isAuthenticated } = useAuth();

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
};
export default Page;
