"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  Timestamp,
  where,
} from "firebase/firestore";
import { Bebas_Neue, Orbitron } from "next/font/google";
import AppNav from "@/components/AppNav";
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

type ClubEvent = {
  id: string;
  title: string;
  startAt: Timestamp;
  endAt?: Timestamp;
  location: string;
  description: string;
  category: string;
  isVolunteer: boolean;
  serviceHours: number;
  signupEnabled: boolean;
  maxSpots: number;
  signupCount: number;
  active: boolean;
};

type SignedUpEvent = ClubEvent & {
  signupId: string;
  signupStatus: string;
};

function formatDate(timestamp: Timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(timestamp.toDate());
}

function formatTime(timestamp: Timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp.toDate());
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [signedUpEvents, setSignedUpEvents] = useState<SignedUpEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [droppingEventId, setDroppingEventId] = useState("");

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

      await loadSignedUpEvents(currentUser.uid);

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  async function loadSignedUpEvents(userId: string) {
    const eventsQuery = query(
      collection(db, "events"),
      where("startAt", ">=", Timestamp.now()),
      orderBy("startAt", "asc")
    );

    const eventsSnapshot = await getDocs(eventsQuery);

    const checks = await Promise.all(
      eventsSnapshot.docs.map(async (eventDoc) => {
        const data = eventDoc.data() as Omit<ClubEvent, "id">;

        const event = {
          id: eventDoc.id,
          ...data,
          signupCount: data.signupCount ?? 0,
        };

        const signupId = `${event.id}_${userId}`;
        const signupRef = doc(db, "eventSignups", signupId);
        const signupSnap = await getDoc(signupRef);

        if (!signupSnap.exists()) {
          return null;
        }

        const signupData = signupSnap.data();

        return {
          ...event,
          signupId,
          signupStatus: signupData.status ?? "pending",
        };
      })
    );

    setSignedUpEvents(
      checks.filter((event): event is SignedUpEvent => event !== null)
    );
  }

  async function handleDrop(event: SignedUpEvent) {
    setMessage("");

    if (!user) {
      router.push("/login");
      return;
    }

    const confirmed = window.confirm(`Drop "${event.title}"?`);

    if (!confirmed) {
      return;
    }

    setDroppingEventId(event.id);

    try {
      await runTransaction(db, async (transaction) => {
        const eventRef = doc(db, "events", event.id);
        const signupRef = doc(db, "eventSignups", `${event.id}_${user.uid}`);

        const eventSnap = await transaction.get(eventRef);
        const signupSnap = await transaction.get(signupRef);

        if (!eventSnap.exists()) {
          throw new Error("This event no longer exists.");
        }

        if (!signupSnap.exists()) {
          throw new Error("You are not signed up for this event.");
        }

        const eventData = eventSnap.data() as Omit<ClubEvent, "id">;
        const currentSignupCount = eventData.signupCount ?? 0;

        transaction.delete(signupRef);

        transaction.update(eventRef, {
          signupCount: Math.max(currentSignupCount - 1, 0),
        });
      });

      setSignedUpEvents((previous) =>
        previous.filter((item) => item.id !== event.id)
      );

      setMessage("Event dropped successfully.");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Could not drop this event.");
      }
    } finally {
      setDroppingEventId("");
    }
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

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <AppNav
          links={
            profile?.role === "admin" || profile?.role === "officer"
              ? [{ label: "Admin", href: "/admin" }]
              : []
          }
        />

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

        {message && (
          <p className="mt-6 border border-purple-400/40 bg-purple-600/15 p-3 text-sm text-purple-200">
            {message}
          </p>
        )}

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
              Total approved service hours.
            </p>
          </div>
        </section>

        {(profile?.role === "admin" || profile?.role === "officer") && (
          <section className="mt-8 border border-red-400/25 bg-black/45 p-6 shadow-[0_0_40px_rgba(239,68,68,0.2)] backdrop-blur">
            <h2 className={`${bebas.className} text-4xl tracking-wide`}>
              Admin Tools
            </h2>

            <p className="mt-3 text-neutral-300">
              Manage events, signups, and member service hours.
            </p>

            <Link
              href="/admin"
              className={`${orbitron.className} mt-6 inline-block bg-red-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_25px_rgba(239,68,68,0.45)] transition hover:scale-105 hover:shadow-[0_0_40px_rgba(239,68,68,0.8)]`}
            >
              Open Admin Dashboard
            </Link>
          </section>
        )}

        <section className="mt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p
                className={`${orbitron.className} text-xs uppercase tracking-[0.35em] text-red-300`}
              >
                Your Schedule
              </p>

              <h2 className={`${bebas.className} mt-2 text-5xl tracking-wide`}>
                Signed-Up Events
              </h2>
            </div>

            <Link
              href="/volunteer"
              className="text-sm uppercase tracking-widest text-neutral-300 transition hover:text-red-300"
            >
              Find More →
            </Link>
          </div>

          {signedUpEvents.length === 0 ? (
            <div className="border border-white/10 bg-black/35 p-8 text-neutral-300">
              You are not signed up for any upcoming events.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {signedUpEvents.map((event) => (
                <article
                  key={event.id}
                  className="border border-purple-400/25 bg-black/45 p-6 shadow-[0_0_35px_rgba(168,85,247,0.18)] backdrop-blur"
                >
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="border border-purple-400/40 bg-purple-600/15 px-3 py-1 text-xs uppercase tracking-widest text-purple-200">
                      {event.serviceHours} service hrs
                    </span>

                    <span className="border border-red-400/40 bg-red-600/15 px-3 py-1 text-xs uppercase tracking-widest text-red-200">
                      {event.signupStatus}
                    </span>
                  </div>

                  <h3 className={`${bebas.className} text-4xl tracking-wide`}>
                    {event.title}
                  </h3>

                  <p className="mt-3 text-sm uppercase tracking-widest text-red-300">
                    {formatDate(event.startAt)} • {formatTime(event.startAt)}
                  </p>

                  <p className="mt-2 text-neutral-300">{event.location}</p>

                  <p className="mt-4 leading-7 text-neutral-300">
                    {event.description}
                  </p>

                  <button
                    onClick={() => handleDrop(event)}
                    disabled={droppingEventId === event.id}
                    className={`${orbitron.className} mt-6 inline-block border border-red-400/50 bg-red-950/40 px-5 py-3 text-xs font-black uppercase tracking-widest text-red-200 transition hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {droppingEventId === event.id ? "Dropping..." : "Drop Event"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}