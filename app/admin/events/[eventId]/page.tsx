"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { Bebas_Neue, Orbitron } from "next/font/google";
import { auth, db } from "@/lib/firebase";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700", "900"] });

type UserProfile = {
  role: "student" | "officer" | "admin";
};

type EventSignup = {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  graduationYear: string;
  status: string;
  serviceHours: number;
  createdAt?: Timestamp;
};

export default function AdminEventSignupsPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [eventTitle, setEventTitle] = useState("");
  const [signups, setSignups] = useState<EventSignup[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setChecking(false);
        return;
      }

      const profileSnap = await getDoc(doc(db, "users", user.uid));

      if (profileSnap.exists()) {
        const profile = profileSnap.data() as UserProfile;
        const canAccess = profile.role === "officer" || profile.role === "admin";
        setAllowed(canAccess);

        if (canAccess) {
          const eventSnap = await getDoc(doc(db, "events", eventId));

          if (eventSnap.exists()) {
            setEventTitle(eventSnap.data().title ?? "Event");
          }

          const signupsQuery = query(
            collection(db, "eventSignups"),
            where("eventId", "==", eventId)
          );

          const snapshot = await getDocs(signupsQuery);

          const loadedSignups = snapshot.docs.map((signupDoc) => ({
            id: signupDoc.id,
            ...(signupDoc.data() as Omit<EventSignup, "id">),
          }));

          setSignups(loadedSignups);
        }
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, [eventId]);

  if (checking) {
    return <main className="min-h-screen bg-black p-8 text-white">Checking access...</main>;
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <h1 className={`${bebas.className} text-6xl`}>Access Denied</h1>
        <p className="mt-4 text-neutral-300">Only officers and admins can view signups.</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#050008_0%,#16001f_35%,#3b0017_70%,#050008_100%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <nav className="mb-12 flex items-center justify-between">
          <Link href="/" className={`${orbitron.className} text-lg font-black tracking-widest`}>
            TCHS<span className="text-red-500">CAR</span>CLUB
          </Link>

          <Link
            href="/admin/events"
            className="text-sm uppercase tracking-widest text-neutral-300 hover:text-red-300"
          >
            Back to Events
          </Link>
        </nav>

        <p className={`${orbitron.className} text-xs uppercase tracking-[0.35em] text-red-300`}>
          Signups
        </p>

        <h1 className={`${bebas.className} mt-2 text-6xl tracking-wide md:text-8xl`}>
          {eventTitle || "Event"}
        </h1>

        <p className="mt-4 text-neutral-300">
          {signups.length} student{signups.length === 1 ? "" : "s"} signed up.
        </p>

        <div className="mt-10 overflow-x-auto border border-purple-400/25 bg-black/45">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead className="border-b border-white/10 text-sm uppercase tracking-widest text-red-300">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Grad Year</th>
                <th className="p-4">Status</th>
                <th className="p-4">Hours</th>
              </tr>
            </thead>

            <tbody>
              {signups.length === 0 ? (
                <tr>
                  <td className="p-4 text-neutral-300" colSpan={5}>
                    No students have signed up yet.
                  </td>
                </tr>
              ) : (
                signups.map((signup) => (
                  <tr key={signup.id} className="border-b border-white/10 text-neutral-300">
                    <td className="p-4">{signup.userName}</td>
                    <td className="p-4">{signup.userEmail}</td>
                    <td className="p-4">{signup.graduationYear || "—"}</td>
                    <td className="p-4">{signup.status}</td>
                    <td className="p-4">{signup.serviceHours}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}