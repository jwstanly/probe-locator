import { exec } from 'child_process';
import config from './config';
import type { WigleSearchResults } from './types';
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

function splitIncomingBuffer(data: any) {
  const res: string = data.toString();
  const probes = res.split('\n');
  probes.forEach(processProbe);
}

function processProbe(probeStdout: string) {
  if (!probeStdout) return;

  const mac = probeStdout.split(' ')[16].slice(3);
  const temp = probeStdout.substring(probeStdout.indexOf('Probe Request'));
  const ssid = temp.substring(temp.indexOf('(') + 1, temp.indexOf(')'));

  // sometimes the ssid is empty
  if (!ssid) return;

  console.log(ssid, '\t', Date.now());

  data.macToSsid[mac] = data.macToSsid[mac]
    ? data.macToSsid[mac].indexOf(ssid) === -1
      ? [...data.macToSsid[mac], ssid]
      : data.macToSsid[mac]
    : [ssid];

  if (!data.ssidToWigle[ssid]) {
    data.ssidToWigle[ssid] = [];
  }
}

async function run() {
  const rawData = fs.readFileSync('./data.json', 'utf-8');
  data = JSON.parse(rawData);

  const tcpDump = exec(
    `tcpdump -l -I -i ${config.wifiInterface} -e -s 256 type mgt subtype probe-req`
  );

  tcpDump?.stdout?.on('data', splitIncomingBuffer);

  await new Promise((resolve) => setTimeout(resolve, 60000));

  tcpDump?.kill();

  const stringifiedData = JSON.stringify(data, null, 2);

  console.log(stringifiedData);

  fs.writeFileSync('./data.json', stringifiedData);
}

run();
