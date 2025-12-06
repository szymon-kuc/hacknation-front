'use client'
import data from "@/app/(public)/lista-znalezionych/data.json";
import List from "@/components/List/List";
import {IEventItem} from "@/types/types";
import dataExample from "@/app/(public)/lista-znalezionych/data.json";
import {useAuth} from "@/context/AuthContext";
import Login from "@/components/Login/Login";
import {useState} from "react";
import '@/styles/urzednik/style.css'

const Page = () => {
    const [foundItems, setFoundItems] = useState<IEventItem[]>(dataExample.foundItems)

    const  {isAuthenticated} = useAuth();

    return (
        <div className="container">
            {isAuthenticated ? <>
                <List setFoundItems={setFoundItems} foundItems={foundItems} isOfficial={true} />
            </> : <>
                <Login />
            </>}

        </div>
    )
}
export default Page
