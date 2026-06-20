"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Headphones, Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useT } from "@/lib/i18n/i18n-context";

export function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const { t } = useT();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(t("contact.toast_required"));
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    setSent(true);
    toast.success(t("contact.toast_success"));
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold">{t("contact.page_title")}</h1>
          <p className="mt-2 text-slate-300 max-w-xl mx-auto">
            {t("contact.page_subtitle")}
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8 space-y-6 h-full">
              <div>
                <h2 className="text-xl font-bold">{t("contact.get_in_touch")}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                  {t("contact.description")}
                </p>
              </div>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-[#1E5EFF]/10 p-3 text-[#1E5EFF] shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{t("contact.phone")}</div>
                    <div className="text-sm text-muted-foreground">+91 12345 67890</div>
                    <div className="text-xs text-muted-foreground/70 mt-0.5">{t("contact.customer_support")}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-[#1E5EFF]/10 p-3 text-[#1E5EFF] shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{t("contact.email")}</div>
                    <div className="text-sm text-muted-foreground">support@railbookpro.in</div>
                    <div className="text-xs text-muted-foreground/70 mt-0.5">{t("contact.reply_time")}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-[#1E5EFF]/10 p-3 text-[#1E5EFF] shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{t("contact.office_address")}</div>
                    <div className="text-sm text-muted-foreground">{t("contact.address_line1")}</div>
                    <div className="text-sm text-muted-foreground">{t("contact.address_line2")}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-[#1E5EFF]/10 p-3 text-[#1E5EFF] shrink-0">
                    <Headphones className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{t("contact.live_chat")}</div>
                    <div className="text-sm text-muted-foreground">{t("contact.chat_available")}</div>
                    <div className="text-xs text-muted-foreground/70 mt-0.5">{t("contact.chat_desc")}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="p-6 sm:p-8 h-full">
              <h2 className="text-xl font-bold mb-6">{t("contact.send_message")}</h2>
              {sent ? (
                <div className="text-center py-12">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold">{t("contact.message_sent")}</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                    {t("contact.thank_you")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("contact.name_label")} <span className="text-rose-500">*</span></Label>
                      <Input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={t("contact.name_placeholder")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("contact.email_label")} <span className="text-rose-500">*</span></Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder={t("contact.email_placeholder")}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("contact.subject_label")}</Label>
                    <Input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder={t("contact.subject_placeholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("contact.message_label")} <span className="text-rose-500">*</span></Label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                      placeholder={t("contact.message_placeholder")}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={sending}>
                    {sending ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> {t("contact.sending")}</>
                    ) : (
                      <><Send className="h-4 w-4" /> {t("contact.send")}</>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
