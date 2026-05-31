"use client";

import AppNav from "@/components/AppNav";   
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
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

type UserProfile = {
  name: string;
  email: string;
  role: "student" | "officer" | "admin";
};

export default function NewEventPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("meeting");
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [serviceHours, setServiceHours] = useState("0");
  const [signupEnabled, setSignupEnabled] = useState(false);
  const [maxSpots, setMaxSpots] = useState("0");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isAllowed = profile?.role === "officer" || profile?.role === "admin";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      const profileRef = doc(db, "users", currentUser.uid);
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        setCheckingAuth(false);
        return;
      }

      setProfile(profileSnap.data() as UserProfile);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  async function handleCreateEvent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      if (!user) {
        throw new Error("You must be logged in.");
      }

      if (!isAllowed) {
        throw new Error("You do not have permission to create events.");
      }

      if (!startAt || !endAt) {
        throw new Error("Start and end time are required.");
      }

      const startDate = new Date(startAt);
      const endDate = new Date(endAt);

      if (endDate <= startDate) {
        throw new Error("End time must be after start time.");
      }

      await addDoc(collection(db, "events"), {
        title,
        startAt: Timestamp.fromDate(startDate),
        endAt: Timestamp.fromDate(endDate),
        location,
        description,
        category,
        isVolunteer,
        serviceHours: Number(serviceHours),
        signupEnabled,
        maxSpots: Number(maxSpots),
        signupCount: 0,
        active: true,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });

      setSuccess("Event created successfully.");

      setTitle("");
      setStartAt("");
      setEndAt("");
      setLocation("");
      setDescription("");
      setCategory("meeting");
      setIsVolunteer(false);
      setServiceHours("0");
      setSignupEnabled(false);
      setMaxSpots("0");
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while creating the event.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        Checking access...
      </main>
    );
  }

  if (!isAllowed) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.42),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(239,68,68,0.35),transparent_28%),linear-gradient(135deg,#050008_0%,#16001f_35%,#3b0017_70%,#050008_100%)]" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 py-10">
          <Link
            href="/"
            className={`${orbitron.className} text-lg font-black tracking-widest sm:text-xl`}
          >
            TCHS<span className="text-red-500">CAR</span>CLUB
          </Link>

          <div className="mt-16 border border-red-400/30 bg-black/45 p-8 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
            <h1 className={`${bebas.className} text-6xl tracking-wide`}>
              Access Denied
            </h1>

            <p className="mt-4 text-neutral-300">
              Only officers and admins can create events.
            </p>

            <Link
              href="/dashboard"
              className="mt-6 inline-block text-sm uppercase tracking-widest text-red-300 hover:text-red-200"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.42),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(239,68,68,0.35),transparent_28%),linear-gradient(135deg,#050008_0%,#16001f_35%,#3b0017_70%,#050008_100%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-10">
        <AppNav
            links={[
                { label: "Admin", href: "/admin" },
                { label: "Events", href: "/admin/events" },
                { label: "Dashboard", href: "/dashboard" },
            ]}
            />

        <section className="mb-8">
          <p
            className={`${orbitron.className} text-xs uppercase tracking-[0.35em] text-red-300`}
          >
            Admin Menu
          </p>

          <h1
            className={`${bebas.className} mt-2 text-6xl tracking-wide md:text-8xl`}
          >
            Create Event
          </h1>

          <p className="mt-4 max-w-2xl text-neutral-300">
            Add a new club meeting, volunteer opportunity, showcase, or special
            event. Once created, it will automatically appear on the Events page.
          </p>
        </section>

        <form
          onSubmit={handleCreateEvent}
          className="border border-purple-400/25 bg-black/45 p-6 shadow-[0_0_40px_rgba(168,85,247,0.2)] backdrop-blur"
        >
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm uppercase tracking-widest text-neutral-300">
                Event Title
              </span>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-red-400"
                placeholder="Weekly Club Meeting"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm uppercase tracking-widest text-neutral-300">
                  Start Date & Time
                </span>
                <input
                  required
                  type="datetime-local"
                  value={startAt}
                  onChange={(event) => setStartAt(event.target.value)}
                  className="border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-red-400"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm uppercase tracking-widest text-neutral-300">
                  End Date & Time
                </span>
                <input
                  required
                  type="datetime-local"
                  value={endAt}
                  onChange={(event) => setEndAt(event.target.value)}
                  className="border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-red-400"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm uppercase tracking-widest text-neutral-300">
                Location
              </span>
              <input
                required
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-red-400"
                placeholder="Room 506"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm uppercase tracking-widest text-neutral-300">
                Description
              </span>
              <textarea
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-32 border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-red-400"
                placeholder="Describe the event..."
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm uppercase tracking-widest text-neutral-300">
                Category
              </span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-red-400"
              >
                <option value="meeting">Meeting</option>
                <option value="volunteer">Volunteer</option>
                <option value="showcase">Showcase</option>
                <option value="workshop">Workshop</option>
                <option value="fundraiser">Fundraiser</option>
                <option value="other">Other</option>
              </select>
            </label>

            <div className="grid gap-5 border border-white/10 bg-white/5 p-5">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isVolunteer}
                  onChange={(event) => {
                    setIsVolunteer(event.target.checked);

                    if (event.target.checked) {
                      setCategory("volunteer");
                      setSignupEnabled(true);
                    } else {
                      setServiceHours("0");
                      setMaxSpots("0");
                      setSignupEnabled(false);
                    }
                  }}
                  className="h-5 w-5"
                />

                <span className="text-sm uppercase tracking-widest text-neutral-300">
                  This is a volunteer/service-hour event
                </span>
              </label>

              {isVolunteer && (
                <div className="grid gap-5 md:grid-cols-3">
                  <label className="grid gap-2">
                    <span className="text-sm uppercase tracking-widest text-neutral-300">
                      Service Hours
                    </span>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.5"
                      value={serviceHours}
                      onChange={(event) => setServiceHours(event.target.value)}
                      className="border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-red-400"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm uppercase tracking-widest text-neutral-300">
                      Max Spots
                    </span>
                    <input
                      required
                      type="number"
                      min="0"
                      value={maxSpots}
                      onChange={(event) => setMaxSpots(event.target.value)}
                      className="border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-red-400"
                    />
                  </label>

                  <label className="flex items-center gap-3 pt-7">
                    <input
                      type="checkbox"
                      checked={signupEnabled}
                      onChange={(event) =>
                        setSignupEnabled(event.target.checked)
                      }
                      className="h-5 w-5"
                    />

                    <span className="text-sm uppercase tracking-widest text-neutral-300">
                      Enable Signup
                    </span>
                  </label>
                </div>
              )}
            </div>

            {error && (
              <p className="border border-red-400/40 bg-red-600/15 p-3 text-sm text-red-200">
                {error}
              </p>
            )}

            {success && (
              <p className="border border-purple-400/40 bg-purple-600/15 p-3 text-sm text-purple-200">
                {success}
              </p>
            )}

            <button
              disabled={submitting}
              className={`${orbitron.className} bg-red-600 px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(239,68,68,0.5)] transition hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(239,68,68,0.8)] disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {submitting ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}