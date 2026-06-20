import { TrainDetailClient } from "./train-detail-client";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string; date?: string }>;
}

export default async function TrainDetailPage(props: Props) {
  const { id } = await props.params;
  const params = await props.searchParams;
  return (
    <div className="container mx-auto px-4 py-8">
      <TrainDetailClient
        trainNo={id}
        from={params.from || ""}
        to={params.to || ""}
        date={params.date || ""}
      />
    </div>
  );
}
