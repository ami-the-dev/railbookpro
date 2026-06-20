import { HeroSection } from "@/components/home/hero-section";
import { SearchCard } from "@/components/home/search-card";
import { QuickServices } from "@/components/home/quick-services";
import { LiveTrains } from "@/components/home/live-trains";
import { PopularRoutes } from "@/components/home/popular-routes";
import { AppPromo } from "@/components/home/app-promo";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="bg-[#F8FAFC] font-sans text-slate-800 antialiased">
      <HeroSection />
      <SearchCard />
      <div className="h-24"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <Card className="rounded-[24px] p-6 sm:p-8 bg-blue-50/60 border-blue-100/50">
          <QuickServices />
        </Card>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <Card className="rounded-[24px] p-6 sm:p-8 bg-emerald-50/60 border-emerald-100/50">
          <LiveTrains />
        </Card>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <Card className="rounded-[24px] p-6 sm:p-8 bg-purple-50/60 border-purple-100/50">
          <PopularRoutes />
        </Card>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <Card className="rounded-[24px] p-6 sm:p-8 bg-amber-50/60 border-amber-100/50">
          <AppPromo />
        </Card>
      </div>
    </div>
  );
}
