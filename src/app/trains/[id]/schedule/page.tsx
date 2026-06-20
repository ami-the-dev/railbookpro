import { ScheduleClient } from "./schedule-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SchedulePage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-8">
      <ScheduleClient trainNo={id} />
    </div>
  );
}
