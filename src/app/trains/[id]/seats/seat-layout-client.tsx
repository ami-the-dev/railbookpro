"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Train, MapPin, CalendarDays, IndianRupee, Check, X, Loader2 } from "lucide-react";
import { getTrainDetails, checkAvailability } from "@/lib/api/irctc";
import type { TrainDetail } from "@/lib/api/irctc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";

interface Props {
  trainNo: string;
  from: string;
  to: string;
  date: string;
}

interface SeatInfo {
  id: string;
  booked: boolean;
  berth: string;
  row: number;
}

interface CoachInfo {
  coachName: string;
  cls: string;
  seats: SeatInfo[];
  available: number;
  total: number;
  fare: number;
}

const berthLabels: Record<string, string> = {
  LB: "Lower", MB: "Middle", UB: "Upper", SL: "Side Lower", SU: "Side Upper",
};

const classLabels: Record<string, string> = {
  "1A": "First AC", "2A": "Second AC", "3A": "Third AC",
  SL: "Sleeper", "2S": "Second Sitting",
};

const fareMap: Record<string, number> = { "1A": 2500, "2A": 1500, "3A": 1000, SL: 450, "2S": 200 };

const coachNames: Record<string, string[]> = {
  "1A": ["A1", "A2"],
  "2A": ["B1", "B2", "B3"],
  "3A": ["C1", "C2", "C3"],
  SL: ["S1", "S2", "S3", "S4", "S5"],
  "2S": ["D1", "D2"],
};

const coachConfig: Record<string, { rows: number; berths: string[] }> = {
  "1A": { rows: 6, berths: ["LB", "UB", "SL", "SU"] },
  "2A": { rows: 8, berths: ["LB", "UB", "SL", "SU"] },
  "3A": { rows: 8, berths: ["LB", "MB", "UB", "SL", "SU"] },
  SL: { rows: 9, berths: ["LB", "MB", "UB", "SL", "SU"] },
  "2S": { rows: 10, berths: ["LB", "UB"] },
};

function generateSeatLayout(
  cls: string,
  coachIndex: number,
  availableCount: number,
  totalSeats: number
): SeatInfo[] {
  const cfg = coachConfig[cls] || coachConfig.SL;
  const seats: SeatInfo[] = [];
  let seatId = 1;

  for (let row = 1; row <= cfg.rows; row++) {
    for (const b of cfg.berths) {
      seats.push({
        id: `${seatId}`,
        booked: true,
        berth: b,
        row,
      });
      seatId++;
    }
  }

  const actualTotal = Math.min(totalSeats, seats.length);
  const actualAvail = Math.min(availableCount, actualTotal);
  const bookedCount = actualTotal - actualAvail;

  const indices = seats.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor((i * 13 + coachIndex * 17 + (coachIndex + 1) * 7) % (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const bookedIndices = new Set(indices.slice(0, bookedCount));
  seats.forEach((s, i) => {
    s.booked = bookedIndices.has(i);
  });

  return seats;
}

export function SeatLayoutClient({ trainNo, from, to, date }: Props) {
  const router = useRouter();
  const [train, setTrain] = useState<TrainDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCoach, setSelectedCoach] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [coaches, setCoaches] = useState<CoachInfo[]>([]);

  useEffect(() => {
    async function fetch() {
      const result = await getTrainDetails(trainNo);
      setTrain(result as TrainDetail);

      const allClasses = ["1A", "2A", "3A", "SL", "2S"];
      const coachesList: CoachInfo[] = [];

      const availResults = await Promise.allSettled(
        allClasses.map((cls) => checkAvailability(trainNo, from, to, date, cls, "GN"))
      );

      for (let ci = 0; ci < allClasses.length; ci++) {
        const cls = allClasses[ci];
        const names = coachNames[cls] || [];
        const avail = availResults[ci];
        const availData = avail.status === "fulfilled" && avail.value
          ? avail.value
          : { available: 0, fare: fareMap[cls] || 500 };

        const perCoach = Math.max(1, Math.floor((availData.available || 0) / names.length));

        names.forEach((name, i) => {
          const cfg = coachConfig[cls] || coachConfig.SL;
          const total = cfg.rows * cfg.berths.length;
          const seats = generateSeatLayout(cls, i, perCoach, total);
          coachesList.push({
            coachName: name,
            cls,
            seats,
            available: seats.filter((s) => !s.booked).length,
            total,
            fare: availData.fare || fareMap[cls] || 500,
          });
        });
      }

      setCoaches(coachesList);
      if (coachesList.length > 0) setSelectedCoach(coachesList[0].coachName);
      setLoading(false);
    }
    fetch();
  }, [trainNo, from, to, date]);

  const currentCoach = coaches.find((c) => c.coachName === selectedCoach);

  const rows: { row: number; seats: SeatInfo[] }[] = [];
  if (currentCoach) {
    const byRow: Record<number, SeatInfo[]> = {};
    currentCoach.seats.forEach((s) => {
      if (!byRow[s.row]) byRow[s.row] = [];
      byRow[s.row].push(s);
    });
    Object.entries(byRow).sort(([a], [b]) => Number(a) - Number(b)).forEach(([_, seatList]) => {
      rows.push({ row: seatList[0].row, seats: seatList });
    });
  }

  const totalAvail = coaches.reduce((s, c) => s + c.available, 0);
  const totalSeats = coaches.reduce((s, c) => s + c.total, 0);

  function toggleSeat(seatId: string) {
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else {
        next.add(seatId);
      }
      return next;
    });
  }

  function proceedToBook() {
    const seatList = Array.from(selectedSeats);
    const seatsParam = seatList.length > 0 ? seatList.join(",") : "";
    const coach = selectedCoach;
    const url = `/trains/${trainNo}?from=${from}&to=${to}&date=${date}&coach=${coach}${seatsParam ? `&seats=${seatsParam}` : ""}`;
    router.push(url);
    toast.success(`Proceeding to book ${coach}${seatsParam ? ` (${seatsParam.length} seat${seatsParam.length > 1 ? "s" : ""})` : ""}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E5EFF]" />
      </div>
    );
  }

  if (!train) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        Train not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold">Seat Availability</h1>
          <p className="mt-2 text-slate-300 max-w-xl mx-auto">
            Have a question or need help? We are here for you 24x7.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()} className="rounded-[5px] p-2 text-slate-500 hover:bg-slate-100 transition cursor-pointer">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{train.train_name}</h2>
            <p className="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
              <Train className="h-4 w-4" />
              {train.train_number} | {train.from_station} &rarr; {train.to_station}
            </p>
          </div>
        </div>

        <Card className="p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 text-sm flex-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="h-4 w-4" />
                {from} &rarr; {to}
              </div>
              {date && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-emerald-600 font-medium">{totalAvail} seats available</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">{totalSeats} total</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {coaches.map((c) => (
            <button
              key={c.coachName}
              onClick={() => { setSelectedCoach(c.coachName); setSelectedSeats(new Set()); }}
              className={`rounded-[5px] px-4 py-2 text-sm font-medium transition ${
                selectedCoach === c.coachName
                  ? "bg-[#1E5EFF] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-[#1E5EFF]"
              }`}
            >
              {c.coachName}
              <span className="text-xs ml-1.5 opacity-75">
                {classLabels[c.cls]}
              </span>
              <span className={`ml-2 text-xs ${selectedCoach === c.coachName ? "text-blue-200" : "text-slate-400"}`}>
                {c.available}/{c.total}
              </span>
            </button>
          ))}
        </div>

        {currentCoach && (
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <Card className="p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Coach {currentCoach.coachName}</h2>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-300" /> Available</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-slate-200 border border-slate-300" /> Booked</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#1E5EFF] border border-[#1E5EFF]" /> Selected</span>
                </div>
              </div>

              {selectedSeats.size > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-[5px] text-sm">
                  <span className="font-medium text-blue-800">{selectedSeats.size} seat{selectedSeats.size > 1 ? "s" : ""} selected</span>
                  <span className="text-blue-600 ml-2">
                    ({Array.from(selectedSeats).map((id) => {
                      const seat = currentCoach.seats.find((s) => s.id === id);
                      return seat ? `${seat.id}${berthLabels[seat.berth] ? `-${berthLabels[seat.berth]}` : ""}` : id;
                    }).join(", ")})
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {rows.map((row) => (
                  <div key={row.row}>
                    <div className="text-[10px] font-medium text-slate-400 uppercase mb-1.5">Row {row.row}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {row.seats.map((seat) => {
                        const isSelected = selectedSeats.has(seat.id);
                        return (
                          <button
                            key={seat.id}
                            type="button"
                            disabled={seat.booked}
                            onClick={() => toggleSeat(seat.id)}
                            className={`w-10 h-10 rounded-md flex flex-col items-center justify-center text-[9px] font-bold transition-all ${
                              isSelected
                                ? "bg-[#1E5EFF] text-white shadow-sm scale-105"
                                : seat.booked
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-500 cursor-pointer"
                            }`}
                            title={
                              seat.booked
                                ? `Booked - ${seat.id}`
                                : isSelected
                                ? `Selected - ${seat.id}`
                                : `Available - ${seat.id}`
                            }
                          >
                            {seat.booked ? <X className="h-3 w-3" /> : isSelected ? <Check className="h-3 w-3" /> : <><span>{seat.id}</span><span className="text-[6px] opacity-60">{berthLabels[seat.berth]?.slice(0,2)}</span></>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-t border-border my-4" />
              <div className="flex items-center justify-between text-sm">
                <div className="text-slate-500">
                  <span className="font-medium text-emerald-600">{currentCoach.available}</span> available / <span className="font-medium text-slate-600">{currentCoach.total}</span> total
                  {selectedSeats.size > 0 && (
                    <span className="ml-3 text-blue-600">
                      <span className="font-medium">{selectedSeats.size}</span> selected
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 font-bold text-slate-800">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {currentCoach.fare}
                  <span className="text-xs font-normal text-slate-400">/seat</span>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-sm h-fit">
              <h3 className="font-bold mb-3">Booking Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Train</span>
                  <span className="text-slate-800 font-medium">{train.train_name}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Number</span>
                  <span className="text-slate-800 font-medium">{train.train_number}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Class</span>
                  <span className="text-slate-800 font-medium">{classLabels[currentCoach.cls]} ({currentCoach.coachName})</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Route</span>
                  <span className="text-slate-800 font-medium">{from} &rarr; {to}</span>
                </div>
                {date && (
                  <div className="flex justify-between text-slate-500">
                    <span>Date</span>
                    <span className="text-slate-800 font-medium">
                      {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Coach</span>
                  <span className="text-slate-800 font-medium">{currentCoach.coachName}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Available</span>
                  <span className="text-emerald-600 font-medium">{currentCoach.available} seats</span>
                </div>
                {selectedSeats.size > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Selected</span>
                    <span className="text-blue-600 font-medium">{selectedSeats.size} seat{selectedSeats.size > 1 ? "s" : ""}</span>
                  </div>
                )}
                <hr className="border-t border-border" />
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Fare per seat</span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="h-3.5 w-3.5" />{currentCoach.fare}
                  </span>
                </div>
                {selectedSeats.size > 0 && (
                  <div className="flex justify-between font-bold text-slate-800 text-base">
                    <span>Total Fare</span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />{currentCoach.fare * selectedSeats.size}
                    </span>
                  </div>
                )}
              </div>

              <hr className="border-t border-border my-3" />
              <Button
                className="w-full rounded-[5px]"
                onClick={proceedToBook}
              >
                {selectedSeats.size > 0
                  ? `Book ${selectedSeats.size} Seat${selectedSeats.size > 1 ? "s" : ""}`
                  : `Book ${currentCoach.coachName}`}
              </Button>
              <p className="text-[10px] text-slate-400 text-center mt-1.5">
                {selectedSeats.size === 0 ? "Click on available seats to select" : "Proceed to passenger details"}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
