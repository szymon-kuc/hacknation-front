import { IEventItem } from "@/types/types";
import dataExample from "@/app/(public)/lista-znalezionych/data.json";
import Link from "next/link";
export default function Home() {
  const { foundItems }: { foundItems: IEventItem[] } = dataExample;
  return (
    <div className="container mb-50">
      <div className="global-white-bg">
        <Link
          href="/lista-znalezionych"
          className="btn btn-lg btn-secondary mt-50"
        >
          Przejdź do bazy przedmiotów znalezionych
        </Link>
      </div>
    </div>
  );
}
