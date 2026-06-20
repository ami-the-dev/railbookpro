"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Train, Users, IndianRupee, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { checkAvailability } from "@/lib/api/irctc";
import { createBooking } from "@/lib/api/booking";
import { saveUserBooking } from "@/lib/booking-store";
import { sendBookingConfirmation } from "@/lib/notifications";
import { toast } from "sonner";
import { useT } from "@/lib/i18n/i18n-context";
import { stationLabel } from "@/lib/i18n/utils";

interface Props {
  trainNo: string;
  from: string;
  to: string;
  date: string;
}

interface PassengerForm {
  name: string;
  age: string;
  gender: string;
  berth_pref: string;
}

const classes = [
  { value: "1A", price: 2500 },
  { value: "2A", price: 1500 },
  { value: "3A", price: 1000 },
  { value: "SL", price: 450 },
  { value: "2S", price: 200 },
];

const tatkalCharges: Record<string, number> = { "1A": 400, "2A": 300, "3A": 200, SL: 100, "2S": 50 };

export function TrainDetailClient({ trainNo, from, to, date }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useT();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"select" | "passengers" | "confirm" | "done">("select");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    const coach = searchParams.get("coach");
    const seats = searchParams.get("seats");
    if (coach) {
      const clsMap: Record<string, string> = { A1: "1A", A2: "1A", B1: "2A", B2: "2A", B3: "2A", C1: "3A", C2: "3A", C3: "3A", S1: "SL", S2: "SL", S3: "SL", S4: "SL", S5: "SL", D1: "2S", D2: "2S" };
      const cls = clsMap[coach] || "";
      if (cls) setSelectedClass(cls);
    }
    if (seats) {
      setSelectedSeats(seats.split(","));
    }
  }, [searchParams]);
  const [tatkal, setTatkal] = useState(false);
  const [passengers, setPassengers] = useState<PassengerForm[]>([
    { name: "", age: "", gender: "M", berth_pref: "LB" },
  ]);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedClassData = classes.find((c) => c.value === selectedClass);

  function addPassenger() {
    setPassengers([...passengers, { name: "", age: "", gender: "M", berth_pref: "LB" }]);
  }

  function updatePassenger(index: number, field: keyof PassengerForm, value: string) {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  }

  function removePassenger(index: number) {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  }

  async function handleContinue() {
    if (!selectedClass) return;
    setStep("passengers");
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const result = await createBooking({
        train_number: trainNo,
        train_name: t("train." + trainNo + ".name"),
        from_station: from,
        to_station: to,
        date,
        class: selectedClass,
        quota: tatkal ? "TQ" : "GN",
        tatkal,
        passengers: passengers.map((p) => ({
          name: p.name,
          age: parseInt(p.age),
          gender: p.gender,
          berth_pref: p.berth_pref,
        })),
        payment_method: "razorpay",
      });

      setBookingResult(result);
      setStep("done");
      if (session?.user?.email) {
        saveUserBooking(session.user.email, result);
        sendBookingConfirmation(session.user.email, "", {
          pnr: result.pnr,
          train_name: result.train_name,
          train_number: result.train_number,
          from: result.from,
          to: result.to,
          date: result.travel_date,
          total_fare: result.total_fare,
        });
      }
      toast.success(t("train_detail.toast_confirmed"));
    } catch {
      toast.error(t("train_detail.toast_failed"));
    } finally {
      setSubmitting(false);
    }
  }

  const tatkalAmt = selectedClassData ? (tatkal ? (tatkalCharges[selectedClassData.value] || 0) : 0) : 0;
  const totalFare = ((selectedClassData?.price || 0) + tatkalAmt) * passengers.length;

  if (step === "done" && bookingResult) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-12">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">{t("train_detail.confirmed")}</h1>
        <Card className="p-6 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("train_detail.pnr")}</span>
            <span className="font-mono font-bold text-lg">{bookingResult.pnr}</span>
          </div>
          <hr className="border-t border-border" />
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("train_detail.train")}</span>
            <span>{bookingResult.train_name} ({bookingResult.train_number})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("train_detail.journey")}</span>
            <span>{bookingResult.from} → {bookingResult.to}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("train_detail.date")}</span>
            <span>{bookingResult.travel_date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("train_detail.seat")}</span>
            <span className="font-medium">{bookingResult.seat}</span>
          </div>
          <hr className="border-t border-border" />
          <div className="flex justify-between text-lg font-bold">
            <span>{t("booking.totalfare")}</span>
            <span>₹{bookingResult.total_fare}</span>
          </div>
        </Card>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => router.push("/")}>
            {t("booking.backhome")}
          </Button>
          <Button onClick={() => router.push(`/booking/confirm?pnr=${bookingResult.pnr}`)}>
            {t("booking.viewticket")}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/pnr?pnr=${bookingResult.pnr}`)}>
            {t("booking.checkpnr")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{t("train_detail.page_title")} {trainNo}</h1>
          <p className="text-muted-foreground">{stationLabel(t, from)} → {stationLabel(t, to)} | {date}</p>
        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/trains/${trainNo}/schedule`)}>
                          {t("train_detail.schedule")}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/trains/${trainNo}/seats?from=${from}&to=${to}&date=${date}`)}>
                          {t("train_detail.seat_layout")}
                        </Button>
      </div>

      <div className="flex gap-2">
        {["select", "passengers", "confirm", "done"].map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full ${
              ["select", "passengers", "confirm", "done"].indexOf(step) >= i
                ? "bg-primary"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {step === "select" && (
        <div className="space-y-4">
          {selectedSeats.length > 0 && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 text-blue-800">
                <Check className="h-4 w-4" />
                <span className="font-medium">{t("train_detail.seats_preselected")} {selectedSeats.length}</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                Seats: {selectedSeats.join(", ")}
              </p>
            </Card>
          )}
          <h2 className="text-lg font-semibold">{t("train_detail.select_class")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {classes.map((cls) => {
              const tatkalAmt = tatkalCharges[cls.value] || 0;
              const totalPrice = cls.price + (tatkal ? tatkalAmt : 0);
              return (
                <Card
                  key={cls.value}
                  className={`p-4 cursor-pointer border-2 transition-all ${
                    selectedClass === cls.value
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:border-border"
                  }`}
                  onClick={() => setSelectedClass(cls.value)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{t("schedule.class_" + cls.value.toLowerCase())} ({cls.value})</div>
                      <div className="text-sm text-muted-foreground">
                        {tatkal ? `${t("train_detail.base_price")} ₹${cls.price} + ${t("train_detail.tatkal_short")} ₹${tatkalAmt}` : t("train_detail.starts_from")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">₹{totalPrice}</div>
                      {tatkal && <div className="text-[10px] text-tertiary font-medium">{t("train_detail.tatkal_short")}</div>}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border bg-amber-50/50">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-tertiary" />
              <div>
                <div className="text-sm font-medium">{t("train_detail.tatkal_booking")}</div>
                <div className="text-xs text-muted-foreground">
                  {t("train_detail.tatkal_desc")}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTatkal(!tatkal)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                tatkal ? "bg-tertiary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  tatkal ? "translate-x-[22px]" : "translate-x-[2px]"
                }`}
              />
            </button>
          </div>

          <Button className="w-full" size="lg" disabled={!selectedClass} onClick={handleContinue}>
            {t("train_detail.continue")}
          </Button>
        </div>
      )}

      {step === "passengers" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("train_detail.passenger_details")}</h2>
          {passengers.map((p, i) => (
            <Card key={i} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("train_detail.passenger_n")} {i + 1}</span>
                {passengers.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removePassenger(i)}>
                    {t("train_detail.remove")}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <Label>{t("train_detail.name")}</Label>
                  <Input
                    value={p.name}
                    onChange={(e) => updatePassenger(i, "name", e.target.value)}
                    placeholder={t("train_detail.name_placeholder")}
                  />
                </div>
                <div className="space-y-1">
                  <Label>{t("train_detail.age")}</Label>
                  <Input
                    type="number"
                    value={p.age}
                    onChange={(e) => updatePassenger(i, "age", e.target.value)}
                    placeholder={t("train_detail.age_placeholder")}
                  />
                </div>
                <div className="space-y-1">
                  <Label>{t("train_detail.gender")}</Label>
                  <select value={p.gender} onChange={(e) => updatePassenger(i, "gender", e.target.value)} className="flex h-9 w-full rounded-[5px] border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="M">{t("train_detail.male")}</option>
                    <option value="F">{t("train_detail.female")}</option>
                    <option value="T">{t("train_detail.transgender")}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>{t("train_detail.berth_pref")}</Label>
                  <select value={p.berth_pref} onChange={(e) => updatePassenger(i, "berth_pref", e.target.value)} className="flex h-9 w-full rounded-[5px] border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="LB">{t("train_detail.lower")}</option>
                    <option value="MB">{t("train_detail.middle")}</option>
                    <option value="UB">{t("train_detail.upper")}</option>
                    <option value="SL">{t("train_detail.side_lower")}</option>
                    <option value="SU">{t("train_detail.side_upper")}</option>
                  </select>
                </div>
              </div>
            </Card>
          ))}
          <Button variant="outline" className="w-full" onClick={addPassenger}>
            <Users className="h-4 w-4 mr-2" />
            {t("train_detail.add_passenger")}
          </Button>

          <hr className="border-t border-border" />

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">{t("train_detail.total_fare")}</span>
              <div className="text-xl font-bold">₹{totalFare}</div>
              {tatkal && <div className="text-xs text-tertiary">{t("train_detail.includes_tatkal")}</div>}
            </div>
            <Button size="lg" onClick={handleSubmit} disabled={submitting}>
              {submitting ? t("train_detail.booking") : t("train_detail.pay_confirm")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
