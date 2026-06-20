import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SeatLayoutClient } from "./seat-layout-client";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string; date?: string }>;
}

export default async function SeatsPage(props: Props) {
  const { id } = await props.params;
  const params = await props.searchParams;
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E5EFF]" />
      </div>
    }>
      <SeatLayoutClient
        trainNo={id}
        from={params.from || ""}
        to={params.to || ""}
        date={params.date || ""}
      />
    </Suspense>
  );
}
