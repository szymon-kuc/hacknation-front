'use client'
import data from "@/app/(public)/found-list/data.json";
import List from "@/components/List/List";
import {IEventItem} from "@/types/types";
import dataExample from "@/app/(public)/found-list/data.json";
import {useAuth} from "@/context/AuthContext";

const Page = () => {
    const {foundItems} : {foundItems: IEventItem[]} = dataExample
    const  {isAuthenticated, login} = useAuth();
    console.log(isAuthenticated);

    const handleLogin = () => {
        login();
        console.log(isAuthenticated);
    }
    return (
        <div className="container">
            {/*isOfficial=true do dodania*/}
            <List foundItems={foundItems} />
            <div className="btn" onClick={handleLogin}>Logowanie</div>
        </div>
    )
}
export default Page
