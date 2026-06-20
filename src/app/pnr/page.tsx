import { PNRStatusClient } from "./pnr-status-client";

interface Props {
  searchParams: Promise<{ pnr?: string }>;
}

export default async function PNRPage(props: Props) {
  const params = await props.searchParams;
  return (
    <div className="container mx-auto">
      <PNRStatusClient initialPNR={params.pnr || ""} />
    </div>
  );
}
