"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function FeedbackPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold">Feedback</h1>
          <p className="mt-2 text-slate-300">Help us improve RailBookPro.</p>
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-8">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Your Name</Label>
              <Input type="text" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Feedback</Label>
              <textarea rows={4} className="w-full rounded-[5px] border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30 resize-none" placeholder="Write your feedback..." />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Submit Feedback
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
