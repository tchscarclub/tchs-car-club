"use client";

import AppNav from "@/components/AppNav";
import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
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

type ClubEvent = {
  id: string;
  title: string;
  startAt: Timestamp;
  location: string;
  category: string;
  isVolunteer: boolean;
  serviceHours: number;
  maxSpots: number;
  signupCount: number;
  active: boolean;
};

function formatDate(timestamp: Timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp.toDate());
}

export default function AdminEventsPage() {
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [message, setMessage] = useState("");

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
          await loadEvents();
        }
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  async function loadEvents() {
    const eventsQuery = query(
      collection(db, "events"),
      orderBy("startAt", "desc")
    );

    const snapshot = await getDocs(eventsQuery);

    const loadedEvents = snapshot.docs.map((eventDoc) => {
      const data = eventDoc.data() as Omit<ClubEvent, "id">;

      return {
        id: eventDoc.id,
        ...data,
        signupCount: data.signupCount ?? 0,
      };
    });

    setEvents(loadedEvents);
  }

  async function handleDeleteEvent(eventId: string, eventTitle: string) {
    const confirmed = window.confirm(
      `Delete "${eventTitle}"? This will also delete its signups.`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      const signupsQuery = query(
        collection(db, "eventSignups"),
        where("eventId", "==", eventId)
      );

      const signupsSnapshot = await getDocs(signupsQuery);

      const batch = writeBatch(db);

      signupsSnapshot.docs.forEach((signupDoc) => {
        batch.delete(signupDoc.ref);
      });

      batch.delete(doc(db, "events", eventId));

      await batch.commit();

      setEvents((previous) => previous.filter((event) => event.id !== eventId));
      setMessage("Event deleted successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Could not delete event.");
    }
  }

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
          Only officers and admins can view this page.
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#050008_0%,#16001f_35%,#3b0017_70%,#050008_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <AppNav
            links={[
                { label: "Admin", href: "/admin" },
                { label: "Create Event", href: "/admin/events/new" },
                { label: "Members", href: "/admin/members" },
            ]}
            />

        <p
          className={`${orbitron.className} text-xs uppercase tracking-[0.35em] text-red-300`}
        >
          Admin
        </p>

        <h1 className={`${bebas.className} mt-2 text-7xl tracking-wide`}>
          Manage Events
        </h1>

        {message && (
          <p className="mt-6 border border-purple-400/40 bg-purple-600/15 p-3 text-sm text-purple-200">
            {message}
          </p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
            const isFull =
              event.maxSpots > 0 && event.signupCount >= event.maxSpots;

            return (
              <article
                key={event.id}
                className="border border-purple-400/25 bg-black/45 p-6 shadow-[0_0_35px_rgba(168,85,247,0.18)]"
              >
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="border border-red-400/40 bg-red-600/15 px-3 py-1 text-xs uppercase tracking-widest text-red-200">
                    {event.category}
                  </span>

                  {isFull && (
                    <span className="border border-red-300 bg-red-600/30 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-100">
                      Full
                    </span>
                  )}
                </div>

                <h2 className={`${bebas.className} text-4xl tracking-wide`}>
                  {event.title}
                </h2>

                <p className="mt-2 text-sm text-red-300">
                  {formatDate(event.startAt)}
                </p>

                <p className="mt-2 text-neutral-300">{event.location}</p>

                {event.maxSpots > 0 ? (
                  <p className="mt-4 text-purple-200">
                    {event.signupCount}/{event.maxSpots} spots filled
                  </p>
                ) : (
                  <p className="mt-4 text-purple-200">
                    {event.signupCount} signup
                    {event.signupCount === 1 ? "" : "s"}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="bg-red-600 px-4 py-3 text-xs font-black uppercase tracking-widest text-white"
                  >
                    View Signups
                  </Link>

                  <button
                    onClick={() => handleDeleteEvent(event.id, event.title)}
                    className="border border-red-400/50 bg-red-950/40 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-200 transition hover:bg-red-700 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}