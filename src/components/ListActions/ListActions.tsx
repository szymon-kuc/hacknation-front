import {IEventItem} from "@/types/types";
import {Dispatch, SetStateAction} from "react";

const ListActions = ({ item, setFoundItems }: { item: IEventItem; setFoundItems?: Dispatch<SetStateAction<IEventItem[]>> }) => {
    const handleDelete = (item: IEventItem) => {
        const confirmed = typeof window !== "undefined" ? window.confirm("Czy na pewno chcesz usunąć ten element?") : true;
        if (!confirmed) return;

        //todo usunac z bazy

        if (!setFoundItems) return;
        setFoundItems((prev) => prev.filter((i) => i.id !== item.id));
    }
    return (
        <div className="found-list__item__cell found-list__item__cell--actions">
            <button className="btn btn-sm btn-primary btn-edit" >
                Edytuj
            </button>
            <button className="btn btn-sm btn-primary btn-delete" onClick={() => handleDelete(item)} disabled={!setFoundItems}>
                Usuń
            </button>
        </div>
    )
}
export default ListActions
