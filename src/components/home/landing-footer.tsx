import Link from "next/link";
import { Train, Globe, MessageCircle, Camera, Video, Phone, Mail, Headphones } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#030D22] text-slate-400 text-xs mt-16 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 text-white">
            <div className="rounded-xl bg-[#0052CC] p-1.5">
              <Train className="h-5 w-5" />
            </div>
            <span className="text-base font-extrabold tracking-tight">RailBookPro</span>
          </div>
          <p className="leading-relaxed max-w-sm text-slate-400">
            Your trusted partner for Indian Railways information. Check PNR status, live train status and get instant updates.
          </p>
          <div className="flex gap-3 pt-1">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full text-white hover:bg-[#0052CC] transition"><Globe className="h-4 w-4" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full text-white hover:bg-sky-400 transition"><MessageCircle className="h-4 w-4" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full text-white hover:bg-pink-600 transition"><Camera className="h-4 w-4" /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full text-white hover:bg-red-600 transition"><Video className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 text-sm tracking-wide">Services</h4>
          <ul className="space-y-2.5 font-medium">
            <li><Link href="/pnr" className="hover:text-white transition">PNR Status</Link></li>
            <li><Link href="/live-train" className="hover:text-white transition">Live Train Status</Link></li>
            <li><Link href="/search" className="hover:text-white transition">Seat Availability</Link></li>
            <li><Link href="/trains" className="hover:text-white transition">Train Schedule</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 text-sm tracking-wide">Useful Links</h4>
          <ul className="space-y-2.5 font-medium">
            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 text-sm tracking-wide">Contact Us</h4>
          <ul className="space-y-3 font-medium">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-500 shrink-0" /> +91 12345 67890</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-500 shrink-0" /> support@railbookpro.in</li>
            <li className="flex items-center gap-2"><Headphones className="h-4 w-4 text-blue-500 shrink-0" /> 24x7 Customer Support</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-slate-800/40 text-center py-6 text-[11px] text-slate-500 font-medium">
        © 2026 RailBookPro. All Rights Reserved.
      </div>
    </footer>
  );
}
