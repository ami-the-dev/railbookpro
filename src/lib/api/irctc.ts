import {
  configure,
  searchTrainBetweenStations,
  getAvailability,
  checkPNRStatus,
  getTrainInfo,
} from "irctc-connect";
import { cacheGet, cacheSet, generateCacheKey } from "@/lib/cache";

const API_KEY = process.env.IRCTC_API_KEY || "";
const CACHE_TTL = 120_000;

let configured = false;
function ensureConfigured() {
  if (!configured && API_KEY) {
    configure(API_KEY);
    configured = true;
  }
}

export interface Train {
  train_number: string;
  train_name: string;
  from_station: string;
  to_station: string;
  departure: string;
  arrival: string;
  duration: string;
  classes: string[];
}

export interface Availability {
  class: string;
  quota: string;
  status: string;
  fare: number;
  available: number;
}

export interface PNRInfo {
  pnr: string;
  train_number: string;
  train_name: string;
  from_station: string;
  to_station: string;
  date_of_journey: string;
  booking_status: string;
  current_status: string;
  passengers: { no: number; booking_status: string; current_status: string }[];
}

export async function searchTrains(from: string, to: string) {
  const cacheKey = generateCacheKey("search", from, to);
  const cached = await cacheGet<Train[]>(cacheKey);
  if (cached) return cached;

  if (!API_KEY) {
    const data = mockSearchTrains(from, to);
    await cacheSet(cacheKey, data, CACHE_TTL);
    return data;
  }
  ensureConfigured();
  try {
    const data = await searchTrainBetweenStations(from, to);
    await cacheSet(cacheKey, data as Train[], CACHE_TTL);
    return data as Train[];
  } catch {
    const data = mockSearchTrains(from, to);
    await cacheSet(cacheKey, data, CACHE_TTL);
    return data;
  }
}

export async function checkAvailability(
  trainNo: string,
  from: string,
  to: string,
  date: string,
  coach: string,
  quota: string
) {
  const cacheKey = generateCacheKey("availability", trainNo, from, to, date, coach, quota);
  const cached = await cacheGet<Availability>(cacheKey);
  if (cached) return cached;

  if (!API_KEY) {
    const data = mockCheckAvailability(trainNo, coach);
    await cacheSet(cacheKey, data, CACHE_TTL);
    return data;
  }
  ensureConfigured();
  try {
    const data = await getAvailability(trainNo, from, to, date, coach, quota);
    await cacheSet(cacheKey, data as Availability, CACHE_TTL);
    return data as Availability;
  } catch {
    const data = mockCheckAvailability(trainNo, coach);
    await cacheSet(cacheKey, data, CACHE_TTL);
    return data;
  }
}

export async function getPNRStatus(pnr: string) {
  const cacheKey = generateCacheKey("pnr", pnr);
  const cached = await cacheGet<PNRInfo>(cacheKey);
  if (cached) return cached;

  if (!API_KEY) {
    const data = mockPNRStatus(pnr);
    await cacheSet(cacheKey, data, CACHE_TTL);
    return data;
  }
  ensureConfigured();
  try {
    const data = await checkPNRStatus(pnr);
    await cacheSet(cacheKey, data as PNRInfo, CACHE_TTL);
    return data as PNRInfo;
  } catch {
    const data = mockPNRStatus(pnr);
    await cacheSet(cacheKey, data, CACHE_TTL);
    return data;
  }
}

export async function getTrainDetails(trainNo: string) {
  const cacheKey = generateCacheKey("train", trainNo);
  const cached = await cacheGet<TrainDetail>(cacheKey);
  if (cached) return cached;

  if (!API_KEY) {
    const data = mockTrainDetails(trainNo);
    await cacheSet(cacheKey, data, 300_000);
    return data;
  }
  ensureConfigured();
  try {
    const data = await getTrainInfo(trainNo);
    await cacheSet(cacheKey, data, 300_000);
    return data;
  } catch {
    const data = mockTrainDetails(trainNo);
    await cacheSet(cacheKey, data, 300_000);
    return data;
  }
}

export interface RouteStop {
  station_code: string;
  station_name: string;
  arrival: string;
  departure: string;
  day: number;
  distance: number;
}

export interface TrainDetail {
  train_number: string;
  train_name: string;
  from_station: string;
  to_station: string;
  departure: string;
  arrival: string;
  duration: string;
  running_days: string[];
  route: RouteStop[];
}

function mockSearchTrains(from: string, to: string): Train[] {
  return [
    {
      train_number: "12615",
      train_name: "Grand Trunk Express",
      from_station: from,
      to_station: to,
      departure: "06:00",
      arrival: "23:30",
      duration: "17h 30m",
      classes: ["1A", "2A", "3A", "SL", "2S"],
    },
    {
      train_number: "12433",
      train_name: "Rajdhani Express",
      from_station: from,
      to_station: to,
      departure: "16:55",
      arrival: "09:55",
      duration: "17h 00m",
      classes: ["1A", "2A", "3A"],
    },
    {
      train_number: "12621",
      train_name: "Tamil Nadu Express",
      from_station: from,
      to_station: to,
      departure: "22:30",
      arrival: "15:55",
      duration: "17h 25m",
      classes: ["2A", "3A", "SL", "2S"],
    },
    {
      train_number: "12641",
      train_name: "Thirukkural Express",
      from_station: from,
      to_station: to,
      departure: "21:15",
      arrival: "14:50",
      duration: "17h 35m",
      classes: ["1A", "2A", "3A", "SL"],
    },
  ];
}

function mockCheckAvailability(trainNo: string, coach: string): Availability {
  const seats = Math.floor(Math.random() * 120) + 1;
  const fares: Record<string, number> = { "1A": 2500, "2A": 1500, "3A": 1000, SL: 450, "2S": 200 };
  return {
    class: coach,
    quota: "GN",
    status: seats > 10 ? "AVAIL" : seats > 0 ? "RAC" : "WL",
    fare: fares[coach] || 500,
    available: seats,
  };
}

const waitlistStatuses = ["CNF", "CNF", "RAC2", "RAC5", "WL5", "WL10", "WL20", "WL35", "RAC1", "WL3", "CNF", "RAC3", "WL15", "CNF"];
let wlIndex = 0;

function generatePassengerStatus(baseStatus: string, index: number) {
  if (baseStatus === "CNF") return "CNF";
  if (baseStatus.startsWith("RAC")) {
    const num = parseInt(baseStatus.replace("RAC", "")) || 1;
    if (index === 0) return baseStatus;
    if (num <= 3) return index <= 1 ? "RAC" + (num + index) : "WL" + (index * 5);
    return "WL" + (index * 10);
  }
  if (baseStatus.startsWith("WL")) {
    const num = parseInt(baseStatus.replace("WL", "")) || 1;
    return "WL" + (num + index * 15);
  }
  return baseStatus;
}

function mockPNRStatus(pnr: string): PNRInfo {
  const status = waitlistStatuses[wlIndex++ % waitlistStatuses.length];
  const passengerCount = 1 + (wlIndex % 3);
  const passengers = Array.from({ length: passengerCount }, (_, i) => ({
    no: i + 1,
    booking_status: status,
    current_status: generatePassengerStatus(status, i),
  }));

  return {
    pnr,
    train_number: "12615",
    train_name: "Grand Trunk Express",
    from_station: "NDLS",
    to_station: "MAS",
    date_of_journey: "2026-06-15",
    booking_status: status,
    current_status: passengers[0]?.current_status || status,
    passengers,
  };
}

const stationNames: Record<string, string> = {
  NDLS: "New Delhi", MAS: "Chennai Central", BCT: "Mumbai Central",
  HWH: "Howrah Junction", SBC: "Bengaluru City", JP: "Jaipur",
  LKO: "Lucknow", PNBE: "Patna", ADI: "Ahmedabad", PUNE: "Pune",
  CNB: "Kanpur Central", BPL: "Bhopal Junction", NLR: "Nellore",
  GTL: "Guntakal", SC: "Secunderabad", BZA: "Vijayawada",
  CGL: "Chengalpattu", MSB: "MGR Chennai Central",
};

const trainSchedules: Record<string, TrainDetail> = {
  "12615": {
    train_number: "12615",
    train_name: "Grand Trunk Express",
    from_station: "NDLS",
    to_station: "MAS",
    departure: "06:00",
    arrival: "23:30",
    duration: "17h 30m",
    running_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    route: [
      { station_code: "NDLS", station_name: "New Delhi", arrival: "--:--", departure: "06:00", day: 1, distance: 0 },
      { station_code: "CNB", station_name: "Kanpur Central", arrival: "10:30", departure: "10:35", day: 1, distance: 440 },
      { station_code: "BPL", station_name: "Bhopal Junction", arrival: "14:15", departure: "14:20", day: 1, distance: 790 },
      { station_code: "SC", station_name: "Secunderabad", arrival: "17:45", departure: "17:50", day: 1, distance: 1110 },
      { station_code: "BZA", station_name: "Vijayawada", arrival: "20:30", departure: "20:35", day: 1, distance: 1420 },
      { station_code: "MAS", station_name: "Chennai Central", arrival: "23:30", departure: "--:--", day: 2, distance: 1700 },
    ],
  },
  "12433": {
    train_number: "12433",
    train_name: "Rajdhani Express",
    from_station: "NDLS",
    to_station: "MAS",
    departure: "16:55",
    arrival: "09:55",
    duration: "17h 00m",
    running_days: ["Mon", "Wed", "Fri"],
    route: [
      { station_code: "NDLS", station_name: "New Delhi", arrival: "--:--", departure: "16:55", day: 1, distance: 0 },
      { station_code: "CNB", station_name: "Kanpur Central", arrival: "21:10", departure: "21:15", day: 1, distance: 440 },
      { station_code: "BZA", station_name: "Vijayawada", arrival: "05:30", departure: "05:35", day: 2, distance: 1420 },
      { station_code: "MAS", station_name: "Chennai Central", arrival: "09:55", departure: "--:--", day: 2, distance: 1700 },
    ],
  },
  "12621": {
    train_number: "12621",
    train_name: "Tamil Nadu Express",
    from_station: "NDLS",
    to_station: "MAS",
    departure: "22:30",
    arrival: "15:55",
    duration: "17h 25m",
    running_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    route: [
      { station_code: "NDLS", station_name: "New Delhi", arrival: "--:--", departure: "22:30", day: 1, distance: 0 },
      { station_code: "CNB", station_name: "Kanpur Central", arrival: "02:45", departure: "02:50", day: 2, distance: 440 },
      { station_code: "BPL", station_name: "Bhopal Junction", arrival: "06:20", departure: "06:25", day: 2, distance: 790 },
      { station_code: "SC", station_name: "Secunderabad", arrival: "10:10", departure: "10:15", day: 2, distance: 1110 },
      { station_code: "BZA", station_name: "Vijayawada", arrival: "13:00", departure: "13:05", day: 2, distance: 1420 },
      { station_code: "MAS", station_name: "Chennai Central", arrival: "15:55", departure: "--:--", day: 2, distance: 1700 },
    ],
  },
  "12641": {
    train_number: "12641",
    train_name: "Thirukkural Express",
    from_station: "NDLS",
    to_station: "MAS",
    departure: "21:15",
    arrival: "14:50",
    duration: "17h 35m",
    running_days: ["Mon", "Thu", "Sat"],
    route: [
      { station_code: "NDLS", station_name: "New Delhi", arrival: "--:--", departure: "21:15", day: 1, distance: 0 },
      { station_code: "CNB", station_name: "Kanpur Central", arrival: "01:30", departure: "01:35", day: 2, distance: 440 },
      { station_code: "BZA", station_name: "Vijayawada", arrival: "11:45", departure: "11:50", day: 2, distance: 1420 },
      { station_code: "MAS", station_name: "Chennai Central", arrival: "14:50", departure: "--:--", day: 2, distance: 1700 },
    ],
  },
};

function mockTrainDetails(trainNo: string) {
  const schedule = trainSchedules[trainNo];
  if (schedule) return schedule;
  return {
    train_number: trainNo,
    train_name: "Sample Express",
    from_station: "NDLS",
    to_station: "MAS",
    departure: "06:00",
    arrival: "23:30",
    duration: "17h 30m",
    running_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    route: [
      { station_code: "NDLS", station_name: "New Delhi", arrival: "--:--", departure: "06:00", day: 1, distance: 0 },
      { station_code: "CNB", station_name: "Kanpur Central", arrival: "10:30", departure: "10:35", day: 1, distance: 440 },
      { station_code: "MAS", station_name: "Chennai Central", arrival: "23:30", departure: "--:--", day: 2, distance: 1700 },
    ],
  };
}
