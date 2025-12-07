import { IEventItem } from "@/types/types";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Menu, MenuItem } from "@mui/material";

const ListActions = ({ item, setFoundItems }: { item: IEventItem; setFoundItems?: Dispatch<SetStateAction<IEventItem[]>> }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = (item: IEventItem) => {
        const confirmed = typeof window !== "undefined" ? window.confirm("Czy na pewno chcesz usunąć ten element?") : true;
        if (!confirmed) return;

        //todo usunac z bazy

        if (!setFoundItems) return;
        setFoundItems((prev) => prev.filter((i) => i.id !== item.id));
    };
    return (
        <div className="found-list__item__cell found-list__item__cell--actions">
            <button
                type="button"
                className="btn btn-lg btn-secondary"
                id={`actions-button-${item.id}`}
                aria-controls={open ? `actions-menu-${item.id}` : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleOpen}
            >
                Akcja
            </button>
            <Menu
                id={`actions-menu-${item.id}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem  className="btn-edit">Oznacz jako odebrane przez właściciela</MenuItem>
                <MenuItem   onClick={() => { handleClose(); handleDelete(item); }}
                            disabled={!setFoundItems}
                            className="btn-delete">Nieodebrane - odmowa wpłaty i odbioru przez właściciela</MenuItem>
                <MenuItem   onClick={() => { handleClose(); handleDelete(item); }}
                            disabled={!setFoundItems}
                            className="btn-delete">Nieodebrane (minął termin)</MenuItem>
                <MenuItem  className="btn-edit">Generuj protokół przyjęcia rzeczy znalezionej</MenuItem>
                <MenuItem  className="btn-edit">Generuj protokół wydania rzeczy znalezionej</MenuItem>
                <MenuItem onClick={handleClose} className="btn-edit">Edytuj</MenuItem>
            </Menu>
        </div>
    )
}
export default ListActions
