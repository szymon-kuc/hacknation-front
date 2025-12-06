import List from "@/components/List/List";
import data from "@/app/(public)/lista-znalezionych/data.json";
import {IEventItem} from "@/types/types";
import dataExample from "@/app/(public)/lista-znalezionych/data.json";
import {useAuth} from "@/context/AuthContext";
import Login from "@/components/Login/Login";
export default function Home() {
    const {foundItems} : {foundItems: IEventItem[]} = dataExample
  return (

        <main className="main-found-list">
            <div className="container">
                <div className="main-found-list">
                    <h1 className="main-found-list__title">Lista rzeczy znalezionych</h1>
                    {(foundItems && foundItems.length > 0) && <List foundItems={foundItems} isOfficial={false}/>}
                </div>
            </div>
        </main>

  );
}
