import { Card } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold">Terms & Conditions</h1>
          <p className="mt-2 text-slate-300">Please read these terms carefully.</p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8 space-y-4">
          <p className="text-sm text-muted-foreground">By using RailBookPro, you agree to the following terms and conditions.</p>
          <h3 className="text-base font-bold text-foreground">Booking Policy</h3>
          <p className="text-sm text-muted-foreground">All bookings are subject to IRCTC rules and availability. RailBookPro acts as an intermediary and is not responsible for cancellations or delays by Indian Railways.</p>
          <h3 className="text-base font-bold text-foreground">Cancellation & Refund</h3>
          <p className="text-sm text-muted-foreground">Cancellation charges apply as per IRCTC policy. Refunds are processed to the original payment method within 5-7 working days.</p>
          <h3 className="text-base font-bold text-foreground">User Responsibility</h3>
          <p className="text-sm text-muted-foreground">Users must provide accurate information during booking. RailBookPro is not liable for incorrect details provided by users.</p>
        </Card>
      </div>
    </div>
  );
}
