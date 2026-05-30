"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Bebas_Neue, Orbitron } from "next/font/google";
import { auth, db } from "@/lib/firebase";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

type UserProfile = {
  name: string;
  email: string;
  graduationYear: string;
  role: string;
  serviceHoursTotal: number;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      const profileRef = doc(db, "users", currentUser.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        setProfile(profileSnap.data() as UserProfile);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  async function handleLogout() {
    await signOut(auth);
    router.push("/");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.42),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(239,68,68,0.35),transparent_28%),linear-gradient(135deg,#050008_0%,#16001f_35%,#3b0017_70%,#050008_100%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <nav className="mb-14 flex items-center justify-between">
          <Link
            href="/"
            className={`${orbitron.className} text-lg font-black tracking-widest sm:text-xl`}
          >
            TCHS<span className="text-red-500">CAR</span>CLUB
          </Link>

          <button
            onClick={handleLogout}
            className="text-sm uppercase tracking-widest text-neutral-300 transition hover:text-red-300"
          >
            Logout
          </button>
        </nav>

        <p
          className={`${orbitron.className} text-xs uppercase tracking-[0.35em] text-red-300`}
        >
          Member Dashboard
        </p>

        <h1
          className={`${bebas.className} mt-2 text-6xl tracking-wide md:text-8xl`}
        >
          Welcome
        </h1>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="border border-purple-400/25 bg-black/45 p-6 shadow-[0_0_40px_rgba(168,85,247,0.2)] backdrop-blur">
            <h2 className={`${bebas.className} text-4xl tracking-wide`}>
              Profile
            </h2>

            <div className="mt-4 space-y-2 text-neutral-300">
              <p>Name: {profile?.name ?? user?.displayName ?? "Unknown"}</p>
              <p>Email: {profile?.email ?? user?.email}</p>
              <p>Graduation Year: {profile?.graduationYear ?? "Not set"}</p>
              <p>Role: {profile?.role ?? "student"}</p>
            </div>
          </div>

          <div className="border border-red-400/25 bg-black/45 p-6 shadow-[0_0_40px_rgba(239,68,68,0.2)] backdrop-blur">
            <h2 className={`${bebas.className} text-4xl tracking-wide`}>
              Service Hours
            </h2>

            <p className="mt-4 text-5xl font-bold text-red-300">
              {profile?.serviceHoursTotal ?? 0}
            </p>

            <p className="mt-3 text-neutral-300">
              Volunteer hour tracking will be expanded later after event signups
              are connected.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}