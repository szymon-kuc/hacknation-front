import { IEventItem } from "@/types/types";
import "@/components/List/style/list.css";

export default function List({ foundItems }: { foundItems: IEventItem[] }) {
    return(
        <div className="found-list">
            <div className="found-list__item found-list__item--heading">
                    <div className="found-list__item__cell found-list__item__cell--id">Nr.</div>
                    <div className="found-list__item__cell found-list__item__cell--name">Nazwa</div>
                    <div className="found-list__item__cell found-list__item__cell--description">Opis</div>
                    <div className="found-list__item__cell found-list__item__cell--type">Typ</div>
                    <div className="found-list__item__cell found-list__item__cell--dateFound">Data znalezienia</div>
                    <div className="found-list__item__cell found-list__item__cell--datePublish">Data publikacji</div>
                    <div className="found-list__item__cell found-list__item__cell--locationFound">Miejsce znalezienia</div>
                    <div className="found-list__item__cell found-list__item__cell--voivodeship">Województwo</div>
                </div>
            {foundItems.map((item) => (
                <div key={item.id} className="found-list__item">
                    <div className="found-list__item__cell found-list__item__cell--id">{item.issueNumber}</div>
                    <div className="found-list__item__cell found-list__item__cell--name">{item.itemName}</div>
                    <div className="found-list__item__cell found-list__item__cell--description">{item.description}</div>
                    <div className="found-list__item__cell found-list__item__cell--type">{item.type}</div>
                    <div className="found-list__item__cell found-list__item__cell--dateFound">{item.foundDate}</div>
                    <div className="found-list__item__cell found-list__item__cell--datePublish">{item.entryDate}</div>
                    <div className="found-list__item__cell found-list__item__cell--locationFound">{item.whereFound}</div>
                    <div className="found-list__item__cell found-list__item__cell--voivodeship">{item.voivodeship}</div>
                </div>
            ))}
        </div>
    )
}