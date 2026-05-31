"use client";

import AppNav from "@/components/AppNav";
import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Bebas_Neue, Orbitron } from "next/font/google";
import { auth, db } from "@/lib/firebase";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

type UserProfile = {
  role: "student" | "officer" | "admin";
};

const adminLinks = [
  {
    title: "Create Event",
    href: "/admin/events/new",
    description: "Add a new meeting, volunteer event, showcase, or workshop.",
  },
  {
    title: "Manage Events",
    href: "/admin/events",
    description: "View event signups, spot counts, and delete old events.",
  },
  {
    title: "Members",
    href: "/admin/members",
    description: "View members and edit total service hours.",
  },
];

export default function AdminPage() {
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setChecking(false);
        return;
      }

      const profileSnap = await getDoc(doc(db, "users", user.uid));

      if (profileSnap.exists()) {
        const profile = profileSnap.data() as UserProfile;
        setAllowed(profile.role === "officer" || profile.role === "admin");
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        Checking access...
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <h1 className={`${bebas.className} text-6xl`}>Access Denied</h1>
        <p className="mt-4 text-neutral-300">
          Only officers and admins can access the admin dashboard.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block text-sm uppercase tracking-widest text-red-300"
        >
          Back to Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.42),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(239,68,68,0.35),transparent_28%),linear-gradient(135deg,#050008_0%,#16001f_35%,#3b0017_70%,#050008_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <AppNav
            links={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Create Event", href: "/admin/events/new" },
                { label: "Events", href: "/admin/events" },
                { label: "Members", href: "/admin/members" },
            ]}
            />

        <p
          className={`${orbitron.className} text-xs uppercase tracking-[0.35em] text-red-300`}
        >
          Officer Tools
        </p>

        <h1
          className={`${bebas.className} mt-2 text-6xl tracking-wide md:text-8xl`}
        >
          Admin Dashboard
        </h1>

        <p className="mt-4 max-w-2xl text-neutral-300">
          Manage events, view volunteer signups, and update member service
          hours.
        </p>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group border border-purple-400/25 bg-black/45 p-6 shadow-[0_0_35px_rgba(168,85,247,0.18)] backdrop-blur transition hover:-translate-y-2 hover:border-red-400/60 hover:shadow-[0_0_45px_rgba(239,68,68,0.35)]"
            >
              <h2 className={`${bebas.className} text-4xl tracking-wide`}>
                {link.title}
              </h2>

              <p className="mt-3 leading-7 text-neutral-300">
                {link.description}
              </p>

              <p className="mt-6 text-sm uppercase tracking-widest text-red-300">
                Open →
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}