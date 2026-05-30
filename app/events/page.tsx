"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { Bebas_Neue, Orbitron } from "next/font/google";
import { db } from "@/lib/firebase";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

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
  active: boolean;
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

export default function EventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const eventsQuery = query(
          collection(db, "events"),
          where("startAt", ">=", Timestamp.now()),
          orderBy("startAt", "asc")
        );

        const snapshot = await getDocs(eventsQuery);

        const loadedEvents = snapshot.docs
            .map((doc) => {
                const data = doc.data() as Omit<ClubEvent, "id">;

                return {
                id: doc.id,
                ...data,
                };
            })
            .filter((event) => event.active === true);

        setEvents(loadedEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.42),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(239,68,68,0.35),transparent_28%),linear-gradient(135deg,#050008_0%,#16001f_35%,#3b0017_70%,#050008_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <nav className="mb-16 flex items-center justify-between">
          <Link
            href="/"
            className={`${orbitron.className} text-lg font-black tracking-widest sm:text-xl`}
          >
            TCHS<span className="text-red-500">CAR</span>CLUB
          </Link>

          <Link
            href="/"
            className="text-sm uppercase tracking-widest text-neutral-300 transition hover:text-red-300"
          >
            Back Home
          </Link>
        </nav>

        <section className="mb-12">
          <p
            className={`${orbitron.className} text-xs uppercase tracking-[0.35em] text-red-300`}
          >
            Upcoming
          </p>

          <h1
            className={`${bebas.className} mt-2 text-6xl tracking-wide md:text-8xl`}
          >
            Club Events
          </h1>

          <p className="mt-4 max-w-2xl text-neutral-300">
            View upcoming Timber Creek Car Club meetings, volunteer
            opportunities, and special activities.
          </p>
        </section>

        {loading ? (
          <p className="text-neutral-300">Loading events...</p>
        ) : events.length === 0 ? (
          <div className="border border-white/10 bg-black/35 p-8 text-neutral-300">
            No upcoming events have been posted yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="group relative overflow-hidden border border-purple-400/25 bg-black/40 p-6 shadow-[0_0_35px_rgba(168,85,247,0.18)] backdrop-blur transition hover:-translate-y-2 hover:border-red-400/60 hover:shadow-[0_0_45px_rgba(239,68,68,0.35)]"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 94% 100%, 0 92%)",
                }}
              >
                <div className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition duration-700 group-hover:translate-x-[120%]" />

                <div className="relative z-10">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="border border-red-400/40 bg-red-600/15 px-3 py-1 text-xs uppercase tracking-widest text-red-200">
                      {event.category}
                    </span>

                    {event.isVolunteer && (
                      <span className="border border-purple-400/40 bg-purple-600/15 px-3 py-1 text-xs uppercase tracking-widest text-purple-200">
                        {event.serviceHours} service hrs
                      </span>
                    )}
                  </div>

                  <h2 className={`${bebas.className} text-4xl tracking-wide`}>
                    {event.title}
                  </h2>

                  <p className="mt-3 text-sm uppercase tracking-widest text-red-300">
                    {formatDate(event.startAt)} • {formatTime(event.startAt)}
                  </p>

                  <p className="mt-2 text-neutral-300">{event.location}</p>

                  <p className="mt-4 leading-7 text-neutral-300">
                    {event.description}
                  </p>

                  {event.signupEnabled && (
                    <Link
                      href="/login"
                      className={`${orbitron.className} mt-6 inline-block bg-red-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_25px_rgba(239,68,68,0.45)] transition hover:scale-105 hover:shadow-[0_0_40px_rgba(239,68,68,0.8)]`}
                    >
                      Login to Sign Up
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}