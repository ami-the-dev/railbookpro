import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { LiveTrainClient } from "./live-train-client";

export default function LiveTrainPage() {
  return (
    <Suspense fallback={
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E5EFF]" />
      </div>
    }>
      <LiveTrainClient />
    </Suspense>
  );
}
