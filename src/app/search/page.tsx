import { Suspense } from "react";
import { SearchResultsClient } from "./search-results-client";
import { SearchForm } from "@/components/search/search-form";

interface Props {
  searchParams: Promise<{ from?: string; to?: string; date?: string; class?: string }>;
}

export default async function SearchPage(props: Props) {
  const params = await props.searchParams;

  if (!params.from || !params.to) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <SearchForm showHeading />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchResultsClient
        from={params.from}
        to={params.to}
        date={params.date || ""}
        coachClass={params.class || ""}
      />
    </div>
  );
}
