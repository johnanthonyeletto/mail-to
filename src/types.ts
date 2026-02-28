export enum EmailProvider {
  GOOGLE = "google",
  MICROSOFT = "microsoft",
  ZOHO = "zoho",
  PROTON = "proton",
}

export interface GoogleDNSResponse {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: {
    name: string;
    type: number;
  }[];
  Answer?: {
    name: string;
    type: number;
    TTL: number;
    data: string;
  }[];
  Comment?: string;
}
