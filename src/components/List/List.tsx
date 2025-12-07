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
  const formatDate = (value?: string | Date | null): string => {
    if (!value) return "—";
    const str = typeof value === "string" ? value : value.toString();
    // treat sentinel/empty values
    if (str.startsWith("0001-01-01") || str === "0000-00-00") return "—";
    const d = new Date(str);
    if (isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  };
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
            {foundItems && foundItems.map((item) => (
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
                  {formatDate(item.foundDate as any)}
              </TableCell>
              <TableCell className="table-cell-no-wrap">
                  {formatDate(item.entryDate as any)}
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
