export interface DataFileSchema {
  macToSsid: {
    [mac: string]: string[];
  };
  ssidToWigle: {
    [ssid: string]: WigleSearchResults[];
  };
}

export interface Config {
  wifiInterface: string;
  latRange?: [number, number];
  longRange?: [number, number];
  city: string;
  encodedToken: string;
}

export interface WigleSearchResponse {
  success: boolean;
  totalResults: number;
  first: number;
  last: number;
  resultCount: number;
  results: WigleSearchResults[];
  searchAfter?: null;
  search_after?: null;
}

export interface WigleSearchResults {
  trilat: number;
  trilong: number;
  ssid: string;
  qos: number;
  transid: string;
  firsttime: string;
  lasttime: string;
  lastupdt: string;
  netid: string;
  name: string;
  type: string;
  comment: string;
  wep: string;
  bcninterval: number;
  freenet: string;
  dhcp: string;
  paynet: string;
  userfound: boolean;
  channel: number;
  encryption: string;
  country: string;
  region: string;
  housenumber: string;
  road: string;
  city: string;
  postalcode: string;
}
