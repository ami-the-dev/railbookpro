import { Train, Shield, Users, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold">About RailBookPro</h1>
          <p className="mt-2 text-slate-300 max-w-xl mx-auto">Your trusted partner for Indian Railways information and booking.</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: Train, title: "Real-time Tracking", desc: "Live train status and PNR updates directly from Indian Railways." },
            { icon: Shield, title: "Secure Booking", desc: "Safe and encrypted booking process with instant confirmation." },
            { icon: Users, title: "24x7 Support", desc: "Round-the-clock customer support for all your travel needs." },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="p-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-[5px] bg-[#1E5EFF]/10 text-[#1E5EFF] mb-4">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
