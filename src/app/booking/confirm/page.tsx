import { BookingConfirmClient } from "./booking-confirm-client";

interface Props {
  searchParams: Promise<{ pnr?: string }>;
}

export default async function BookingConfirmPage(props: Props) {
  const params = await props.searchParams;
  return (
    <div className="container mx-auto px-4 py-8">
      <BookingConfirmClient pnr={params.pnr || ""} />
    </div>
  );
}
