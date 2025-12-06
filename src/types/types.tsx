export interface IEventItem {
    id: number;
    itemName: string;
    description: string;
    documentTransferDate: string;
    entryDate: string;
    foundDate: string;
    issueNumber: string;
    whereStorred: string;
    whereFound: null | string;
    type: string;
    status: string;
    voivodeship: string;
    issuer: string;
}