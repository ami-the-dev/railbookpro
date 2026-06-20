"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Train, Clock, MapPin, ChevronRight } from "lucide-react";

interface TrainCardProps {
  name: string;
  number: string;
  from: string;
  departure: string;
  to: string;
  arrival: string;
  duration: string;
  classes: { type: string; fare: number; available: boolean }[];
  days: string[];
}

export function TrainCard({
  name,
  number,
  from,
  departure,
  to,
  arrival,
  duration,
  classes,
  days,
}: TrainCardProps) {
  return (
    <div className="rounded-[5px] border border-border bg-card transition-shadow hover:shadow-md">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Train className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-foreground sm:text-base">
                {name}
              </h3>
              <span className="text-xs text-muted-foreground">#{number}</span>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0 text-[10px]">
            {days.length === 7 ? "Daily" : days.join(", ")}
          </Badge>
        </div>

        <div className="mt-4 flex items-center justify-between sm:mt-5">
          <div className="text-center">
            <p className="text-base font-bold text-foreground sm:text-lg">
              {departure}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {from}
            </p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {duration}
            </div>
            <div className="relative flex w-20 items-center sm:w-28">
              <div className="h-0.5 flex-1 bg-border" />
              <ChevronRight className="h-4 w-4 -ml-2 text-primary" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-base font-bold text-foreground sm:text-lg">
              {arrival}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {to}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          {classes.map((cls) => (
            <button
              key={cls.type}
              disabled={!cls.available}
              className={`rounded-[5px] border px-2.5 py-1 text-xs font-medium transition-colors ${
                cls.available
                  ? "border-border hover:border-primary hover:bg-primary/5"
                  : "cursor-not-allowed border-border/50 text-muted-foreground/50 line-through"
              }`}
            >
              <span>{cls.type}</span>
              <span className="ml-1">&bull;</span>
              <span className="ml-1">&euro;{cls.fare}</span>
            </button>
          ))}
          <div className="ml-auto">
            <Button size="sm" className="rounded-[5px]">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
