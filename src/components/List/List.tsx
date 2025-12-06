import { IEventItem } from "@/types/types";
import "@/components/List/style/list.css";

export default function List({ foundItems }: { foundItems: IEventItem[] }) {
    return(
        <div className="found-list">
            {foundItems.map((item) => (
                <div key={item.id} className="found-list__item">
                    <div className="found-list__item__cell found-list__item__cell--id">{item.id}</div>
                    <div className="found-list__item__cell found-list__item__cell--name">{item.name}</div>
                    <div className="found-list__item__cell found-list__item__cell--description">{item.description}</div>
                    <div className="found-list__item__cell found-list__item__cell--dateFound">{item.dateFound}</div>
                    <div className="found-list__item__cell found-list__item__cell--locationFound">{item.locationFound}</div>
                    <div className="found-list__item__cell found-list__item__cell--type">{item.type}</div>
                    <div className="found-list__item__cell found-list__item__cell--datePublish">{item.datePublish}</div>
                    <div className="found-list__item__cell found-list__item__cell--voivodeship">{item.voivodeship}</div>
                </div>
            ))}
        </div>
    )
}