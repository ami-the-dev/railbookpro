"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Key, Database, CreditCard, RefreshCw, Check } from "lucide-react";
import { toast } from "sonner";

export default function AdminConfig() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    toast.success("Configuration saved");
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">API Configuration</h1>
        <p className="text-muted-foreground">Manage your API keys and service integrations</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">IRCTC Connect API</h2>
            <p className="text-sm text-muted-foreground">Read operations: search, availability, PNR</p>
          </div>
          <Badge className="ml-auto bg-success/10 text-success">Connected</Badge>
        </div>
        <div className="space-y-2">
          <Label htmlFor="irctc-key">API Key</Label>
          <Input
            id="irctc-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your IRCTC Connect API key"
          />
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100 text-green-600">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">Database</h2>
            <p className="text-sm text-muted-foreground">PostgreSQL via Prisma ORM</p>
          </div>
          <Badge className="ml-auto bg-success/10 text-success">Operational</Badge>
        </div>
        <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 font-mono">
          postgresql://railbook:****@localhost:5432/railbookpro
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">Payment Gateway</h2>
            <p className="text-sm text-muted-foreground">Razorpay integration</p>
          </div>
          <Badge variant="outline" className="bg-warning/10 text-warning">Sandbox</Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Payment gateway is in sandbox mode. No real transactions processed.
        </div>
      </Card>

      <hr className="border-t border-border" />

      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>
          {saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Save Configuration
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
