import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-slate-300">How we handle your data.</p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8 space-y-4">
          <p className="text-sm text-muted-foreground">RailBookPro is committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.</p>
          <h3 className="text-base font-bold text-foreground">Information We Collect</h3>
          <p className="text-sm text-muted-foreground">We collect information you provide during registration including name, email, phone number, and booking details.</p>
          <h3 className="text-base font-bold text-foreground">How We Use Your Information</h3>
          <p className="text-sm text-muted-foreground">Your information is used to process bookings, send confirmations, and provide customer support. We do not share your data with third parties.</p>
          <h3 className="text-base font-bold text-foreground">Data Security</h3>
          <p className="text-sm text-muted-foreground">We implement industry-standard security measures to protect your data from unauthorized access.</p>
        </Card>
      </div>
    </div>
  );
}
