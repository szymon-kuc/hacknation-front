import { IEventItem } from "@/types/types";
import "@/components/List/style/list.css";
import ListActions from "@/components/ListActions/ListActions";
import { Dispatch, SetStateAction } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function List({
  foundItems,
  isOfficial,
  setFoundItems,
}: {
  foundItems: IEventItem[];
  isOfficial: boolean;
  setFoundItems?: Dispatch<SetStateAction<IEventItem[]>>;
}) {
  //TODO: create this as material ui table component
  return (
    <div className="found-list-wrapper">
      <TableContainer
        className="found-list-table"
        component={Paper}
        sx={{ maxHeight: 500, maxWidth: "100%", stickyHeader: true }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nr.</TableCell>
              <TableCell className="table-cell-wide">Nazwa</TableCell>
              <TableCell className="table-cell-wide">Opis</TableCell>
              <TableCell>Typ</TableCell>
              <TableCell>Data znalezienia</TableCell>
              <TableCell>Data publikacji</TableCell>
              <TableCell>Miejsce znalezienia</TableCell>
              <TableCell>Województwo</TableCell>
              {isOfficial && <TableCell align="right">Akcje</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {foundItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.issueNumber}</TableCell>
                <TableCell className="table-cell-wide">
                  {item.itemName}
                </TableCell>
                <TableCell className="table-cell-wide">
                  {item.description}
                </TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className="table-cell-no-wrap">
                  {item.foundDate}
                </TableCell>
                <TableCell className="table-cell-no-wrap">
                  {item.entryDate}
                </TableCell>
                <TableCell>{item.whereFound}</TableCell>
                <TableCell>{item.voivodeship}</TableCell>
                {isOfficial && (
                  <TableCell align="right">
                    <ListActions setFoundItems={setFoundItems} item={item} />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
