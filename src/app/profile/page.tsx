"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Train, Eye, EyeOff, Loader2, ChevronDown, ChevronUp, User, Shield, MapPin, IdCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const genders = [
  { value: "", label: "Select Gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "transgender", label: "Transgender" },
];

const maritalStatuses = [
  { value: "", label: "Select Marital Status" },
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];

const idTypes = [
  { value: "", label: "Select ID Type" },
  { value: "aadhaar", label: "Aadhaar Card" },
  { value: "pan", label: "PAN Card" },
  { value: "passport", label: "Passport" },
  { value: "voter_id", label: "Voter ID" },
  { value: "driving_license", label: "Driving License" },
];

const indianStates = [
  "", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

type FormData = {
  name: string; email: string; phone: string; role: string;
  dateOfBirth: string; gender: string; maritalStatus: string;
  nationality: string; occupation: string;
  address: string; city: string; state: string; pincode: string; country: string;
  idType: string; idNumber: string;
  securityQuestion: string; securityAnswer: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", role: "",
    dateOfBirth: "", gender: "", maritalStatus: "",
    nationality: "Indian", occupation: "",
    address: "", city: "", state: "", pincode: "", country: "India",
    idType: "", idNumber: "",
    securityQuestion: "", securityAnswer: "",
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status !== "authenticated") return;

    fetch("/api/auth/profile")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        setForm({
          name: data.name || "", email: data.email || "", phone: data.phone || "", role: data.role || "",
          dateOfBirth: data.dateOfBirth || "", gender: data.gender || "", maritalStatus: data.maritalStatus || "",
          nationality: data.nationality || "Indian", occupation: data.occupation || "",
          address: data.address || "", city: data.city || "", state: data.state || "", pincode: data.pincode || "", country: data.country || "India",
          idType: data.idType || "", idNumber: data.idNumber || "",
          securityQuestion: data.securityQuestion || "", securityAnswer: data.securityAnswer || "",
        });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [status, router]);

  function updateField(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }

    if (passwordForm.newPassword && passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, string> = {};
      for (const [key, value] of Object.entries(form)) {
        if (key !== "email" && key !== "role") body[key] = value;
      }

      if (passwordForm.newPassword) {
        if (!passwordForm.currentPassword) {
          toast.error("Current password is required to change password");
          setSaving(false);
          return;
        }
        body.currentPassword = passwordForm.currentPassword;
        body.newPassword = passwordForm.newPassword;
      }

      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update profile");
        return;
      }

      setForm((prev) => ({
        ...prev,
        name: data.name, phone: data.phone,
        dateOfBirth: data.dateOfBirth, gender: data.gender, maritalStatus: data.maritalStatus,
        nationality: data.nationality, occupation: data.occupation,
        address: data.address, city: data.city, state: data.state, pincode: data.pincode, country: data.country,
        idType: data.idType, idNumber: data.idNumber,
        securityQuestion: data.securityQuestion, securityAnswer: data.securityAnswer,
      }));
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowChangePassword(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-8 px-4">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Train className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-primary">RailBookPro</span>
          </div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and personal details</p>
        </div>

        <form onSubmit={handleSave}>
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3 border-b pb-3">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Personal Details</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" placeholder="Full Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select id="gender" value={form.gender} onChange={(e) => updateField("gender", e.target.value)} className="flex h-10 w-full rounded-[5px] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    {genders.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <select id="maritalStatus" value={form.maritalStatus} onChange={(e) => updateField("maritalStatus", e.target.value)} className="flex h-10 w-full rounded-[5px] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    {maritalStatuses.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input id="nationality" placeholder="Indian" value={form.nationality} onChange={(e) => updateField("nationality", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input id="occupation" placeholder="Occupation" value={form.occupation} onChange={(e) => updateField("occupation", e.target.value)} />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3 border-b pb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Contact Details</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} disabled className="bg-muted cursor-not-allowed" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number *</Label>
                  <Input id="phone" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Residential Address</Label>
                  <Input id="address" placeholder="Address" value={form.address} onChange={(e) => updateField("address", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="India" value={form.country} onChange={(e) => updateField("country", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input id="pincode" placeholder="6-digit PIN" value={form.pincode} onChange={(e) => updateField("pincode", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City / Town</Label>
                  <Input id="city" placeholder="City" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <select id="state" value={form.state} onChange={(e) => updateField("state", e.target.value)} className="flex h-10 w-full rounded-[5px] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    {indianStates.map((s) => <option key={s} value={s}>{s || "Select State"}</option>)}
                  </select>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3 border-b pb-3">
                <IdCard className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Identity Proof</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="idType">ID Type</Label>
                  <select id="idType" value={form.idType} onChange={(e) => updateField("idType", e.target.value)} className="flex h-10 w-full rounded-[5px] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    {idTypes.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input id="idNumber" placeholder="ID Number" value={form.idNumber} onChange={(e) => updateField("idNumber", e.target.value)} />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3 border-b pb-3">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Security</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="securityQuestion">Security Question</Label>
                  <Input id="securityQuestion" placeholder="e.g. What is your pet's name?" value={form.securityQuestion} onChange={(e) => updateField("securityQuestion", e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="securityAnswer">Security Answer</Label>
                  <Input id="securityAnswer" placeholder="Answer" value={form.securityAnswer} onChange={(e) => updateField("securityAnswer", e.target.value)} />
                </div>
              </div>

              <div className="border-t pt-4">
                <button type="button" onClick={() => setShowChangePassword(!showChangePassword)} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                  {showChangePassword ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  <Lock className="h-4 w-4" />
                  Change Password
                </button>

                {showChangePassword && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input id="currentPassword" type={showPassword.current ? "text" : "password"} placeholder="Current" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
                        <button type="button" onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input id="newPassword" type={showPassword.new ? "text" : "password"} placeholder="New" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                        <button type="button" onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input id="confirmPassword" type={showPassword.confirm ? "text" : "password"} placeholder="Confirm" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
                        <button type="button" onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="mt-6 flex justify-center">
            <Button type="submit" className="w-full max-w-sm" size="lg" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
