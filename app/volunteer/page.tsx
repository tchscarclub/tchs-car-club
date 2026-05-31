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
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
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

type UserProfile = {
  name: string;
  email: string;
  graduationYear: string;
  role: string;
  serviceHoursTotal: number;
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

export default function VolunteerPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [signedUpEventIds, setSignedUpEventIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingEventId, setSubmittingEventId] = useState("");
  const [actionType, setActionType] = useState<"signup" | "drop" | "">("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await loadVolunteerEvents(user);
    });

    return () => unsubscribe();
  }, []);

  async function loadVolunteerEvents(user: User | null) {
    setLoading(true);

    try {
      const volunteerQuery = query(
        collection(db, "events"),
        where("startAt", ">=", Timestamp.now()),
        orderBy("startAt", "asc")
      );

      const snapshot = await getDocs(volunteerQuery);

      const loadedEvents = snapshot.docs
        .map((eventDoc) => {
          const data = eventDoc.data() as Omit<ClubEvent, "id">;

          return {
            id: eventDoc.id,
            ...data,
            signupCount: data.signupCount ?? 0,
          };
        })
        .filter(
          (event) => event.active === true && event.isVolunteer === true
        );

      setEvents(loadedEvents);

      if (user) {
        const signupChecks = await Promise.all(
          loadedEvents.map(async (event) => {
            const signupRef = doc(
              db,
              "eventSignups",
              `${event.id}_${user.uid}`
            );

            const signupSnap = await getDoc(signupRef);

            return signupSnap.exists() ? event.id : null;
          })
        );

        setSignedUpEventIds(
          signupChecks.filter((eventId): eventId is string => eventId !== null)
        );
      } else {
        setSignedUpEventIds([]);
      }
    } catch (error) {
      console.error("Error loading volunteer events:", error);
      setMessage("Could not load volunteer events.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(event: ClubEvent) {
    setMessage("");

    if (!currentUser) {
      router.push("/login");
      return;
    }

    setSubmittingEventId(event.id);
    setActionType("signup");

    try {
      await runTransaction(db, async (transaction) => {
        const eventRef = doc(db, "events", event.id);
        const signupRef = doc(
          db,
          "eventSignups",
          `${event.id}_${currentUser.uid}`
        );
        const userRef = doc(db, "users", currentUser.uid);

        const eventSnap = await transaction.get(eventRef);
        const signupSnap = await transaction.get(signupRef);
        const userSnap = await transaction.get(userRef);

        if (!eventSnap.exists()) {
          throw new Error("This event no longer exists.");
        }

        if (signupSnap.exists()) {
          throw new Error("You already signed up for this event.");
        }

        const eventData = eventSnap.data() as Omit<ClubEvent, "id">;
        const profile = userSnap.exists()
          ? (userSnap.data() as UserProfile)
          : null;

        const currentSignupCount = eventData.signupCount ?? 0;
        const maxSpots = eventData.maxSpots ?? 0;

        if (maxSpots > 0 && currentSignupCount >= maxSpots) {
          throw new Error("This event is full.");
        }

        transaction.set(signupRef, {
          eventId: event.id,
          eventTitle: eventData.title,
          eventStartAt: eventData.startAt,
          eventLocation: eventData.location,
          userId: currentUser.uid,
          userName: profile?.name ?? currentUser.displayName ?? "Unknown",
          userEmail: currentUser.email,
          graduationYear: profile?.graduationYear ?? "",
          status: "pending",
          serviceHours: eventData.serviceHours ?? 0,
          createdAt: serverTimestamp(),
        });

        transaction.update(eventRef, {
          signupCount: currentSignupCount + 1,
        });
      });

      setMessage("You signed up successfully.");

      setSignedUpEventIds((previous) => [...previous, event.id]);

      setEvents((previous) =>
        previous.map((item) =>
          item.id === event.id
            ? { ...item, signupCount: (item.signupCount ?? 0) + 1 }
            : item
        )
      );
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Could not sign up for this event.");
      }
    } finally {
      setSubmittingEventId("");
      setActionType("");
    }
  }

  async function handleDrop(event: ClubEvent) {
    setMessage("");

    if (!currentUser) {
      router.push("/login");
      return;
    }

    const confirmed = window.confirm(`Drop "${event.title}"?`);

    if (!confirmed) {
      return;
    }

    setSubmittingEventId(event.id);
    setActionType("drop");

    try {
      await runTransaction(db, async (transaction) => {
        const eventRef = doc(db, "events", event.id);
        const signupRef = doc(
          db,
          "eventSignups",
          `${event.id}_${currentUser.uid}`
        );

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

      setMessage("You dropped the event.");

      setSignedUpEventIds((previous) =>
        previous.filter((eventId) => eventId !== event.id)
      );

      setEvents((previous) =>
        previous.map((item) =>
          item.id === event.id
            ? { ...item, signupCount: Math.max((item.signupCount ?? 0) - 1, 0) }
            : item
        )
      );
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Could not drop this event.");
      }
    } finally {
      setSubmittingEventId("");
      setActionType("");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.42),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(239,68,68,0.35),transparent_28%),linear-gradient(135deg,#050008_0%,#16001f_35%,#3b0017_70%,#050008_100%)]" />
      <div className="absolute left-[-10%] top-[18%] h-72 w-72 rounded-full bg-purple-600/25 blur-3xl" />
      <div className="absolute right-[-10%] top-[48%] h-80 w-80 rounded-full bg-red-600/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <nav className="mb-16 flex items-center justify-between">
          <Link
            href="/"
            className={`${orbitron.className} text-lg font-black tracking-widest sm:text-xl`}
          >
            TCHS<span className="text-red-500">CAR</span>CLUB
          </Link>

          <div className="flex gap-4 text-sm uppercase tracking-widest text-neutral-300">
            <Link href="/" className="transition hover:text-red-300">
              Home
            </Link>
            <Link href="/dashboard" className="transition hover:text-red-300">
              Dashboard
            </Link>
          </div>
        </nav>

        <section className="mb-12">
          <p
            className={`${orbitron.className} text-xs uppercase tracking-[0.35em] text-red-300`}
          >
            Service Hours
          </p>

          <h1
            className={`${bebas.className} mt-2 text-6xl tracking-wide md:text-8xl`}
          >
            Volunteer
          </h1>

          <p className="mt-4 max-w-2xl text-neutral-300">
            Find volunteer opportunities where students can help the school,
            support the community, and earn service hours through TCHS Car Club.
          </p>

          {message && (
            <p className="mt-6 border border-purple-400/40 bg-purple-600/15 p-3 text-sm text-purple-200">
              {message}
            </p>
          )}
        </section>

        {loading ? (
          <p className="text-neutral-300">Loading volunteer opportunities...</p>
        ) : events.length === 0 ? (
          <div className="border border-white/10 bg-black/35 p-8 text-neutral-300">
            No volunteer opportunities have been posted yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => {
              const alreadySignedUp = signedUpEventIds.includes(event.id);
              const isFull =
                event.maxSpots > 0 && event.signupCount >= event.maxSpots;
              const spotsLeft =
                event.maxSpots > 0
                  ? Math.max(event.maxSpots - event.signupCount, 0)
                  : null;

              return (
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
                      <span className="border border-purple-400/40 bg-purple-600/15 px-3 py-1 text-xs uppercase tracking-widest text-purple-200">
                        {event.serviceHours} service hrs
                      </span>

                      {event.maxSpots > 0 && (
                        <span className="border border-red-400/40 bg-red-600/15 px-3 py-1 text-xs uppercase tracking-widest text-red-200">
                          {event.signupCount}/{event.maxSpots} spots
                        </span>
                      )}

                      {isFull && !alreadySignedUp && (
                        <span className="border border-red-300 bg-red-600/30 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-100">
                          Full
                        </span>
                      )}

                      {alreadySignedUp && (
                        <span className="border border-purple-300 bg-purple-600/30 px-3 py-1 text-xs font-bold uppercase tracking-widest text-purple-100">
                          Signed Up
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

                    {spotsLeft !== null && !isFull && (
                      <p className="mt-4 text-sm text-purple-200">
                        {spotsLeft} spot{spotsLeft === 1 ? "" : "s"} remaining.
                      </p>
                    )}

                    {alreadySignedUp ? (
                      <button
                        onClick={() => handleDrop(event)}
                        disabled={submittingEventId === event.id}
                        className={`${orbitron.className} mt-6 inline-block border border-red-400/50 bg-red-950/40 px-5 py-3 text-xs font-black uppercase tracking-widest text-red-200 transition hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {submittingEventId === event.id && actionType === "drop"
                          ? "Dropping..."
                          : "Drop Event"}
                      </button>
                    ) : isFull ? (
                      <button
                        disabled
                        className={`${orbitron.className} mt-6 inline-block cursor-not-allowed bg-neutral-700 px-5 py-3 text-xs font-black uppercase tracking-widest text-neutral-300`}
                      >
                        Event Full
                      </button>
                    ) : event.signupEnabled ? (
                      <button
                        onClick={() => handleSignup(event)}
                        disabled={submittingEventId === event.id}
                        className={`${orbitron.className} mt-6 inline-block bg-red-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_25px_rgba(239,68,68,0.45)] transition hover:scale-105 hover:shadow-[0_0_40px_rgba(239,68,68,0.8)] disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {submittingEventId === event.id &&
                        actionType === "signup"
                          ? "Signing Up..."
                          : currentUser
                          ? "Sign Up"
                          : "Login to Sign Up"}
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}