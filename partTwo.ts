import axios from 'axios';
import config from './config';
import { WigleSearchResponse, WigleSearchResults } from './types';
import fs from 'fs';

let data: {
  macToSsid: {
    [mac: string]: string[];
  };
  ssidToWigle: {
    [ssid: string]: WigleSearchResults[];
  };
} = {
  macToSsid: {},
  ssidToWigle: {},
};

async function fetchWifiData(ssid: string) {
  try {
    const res = (
      await axios({
        method: 'GET',
        url: 'https://api.wigle.net/api/v2/network/search',
        params: {
          onlymine: false,
          freenet: false,
          paynet: false,
          ssid: ssid,
          city: config.city,
        },
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${config.encodedToken}`,
        },
      })
    ).data as WigleSearchResponse;

    console.log('fetch res', res);

    data.ssidToWigle[ssid] = res.results;
  } catch (errorEx) {
    const error = errorEx as any;
    if (error.response) {
      // Request made and server responded
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  }
}

async function run() {
  const rawData = fs.readFileSync('./data.json', 'utf-8');
  data = JSON.parse(rawData);

  await Promise.all(Object.keys(data.ssidToWigle).map(fetchWifiData));

  const stringifiedData = JSON.stringify(data, null, 2);

  console.log(stringifiedData);

  fs.writeFileSync('./data.json', stringifiedData);
}

run();
