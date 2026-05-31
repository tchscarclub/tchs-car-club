"use client";

import AppNav from "@/components/AppNav";
import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { Bebas_Neue, Orbitron } from "next/font/google";
import { auth, db } from "@/lib/firebase";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700", "900"] });

type UserProfile = {
  id: string;
  name: string;
  email: string;
  graduationYear: string;
  role: "student" | "officer" | "admin";
  serviceHoursTotal: number;
};

export default function AdminMembersPage() {
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [editedHours, setEditedHours] = useState<Record<string, string>>({});
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
        const canAccess = profile.role === "admin";
        setAllowed(canAccess);

        if (canAccess) {
          const membersQuery = query(collection(db, "users"), orderBy("name", "asc"));
          const snapshot = await getDocs(membersQuery);

          const loadedMembers = snapshot.docs.map((memberDoc) => {
            const data = memberDoc.data() as Omit<UserProfile, "id">;

            return {
              id: memberDoc.id,
              ...data,
              serviceHoursTotal: data.serviceHoursTotal ?? 0,
            };
          });

          setMembers(loadedMembers);

          const initialHours: Record<string, string> = {};

          loadedMembers.forEach((member) => {
            initialHours[member.id] = String(member.serviceHoursTotal ?? 0);
          });

          setEditedHours(initialHours);
        }
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  async function saveHours(memberId: string) {
    setMessage("");

    const newHours = Number(editedHours[memberId]);

    if (Number.isNaN(newHours) || newHours < 0) {
      setMessage("Service hours must be a valid number.");
      return;
    }

    await updateDoc(doc(db, "users", memberId), {
      serviceHoursTotal: newHours,
    });

    setMembers((previous) =>
      previous.map((member) =>
        member.id === memberId
          ? { ...member, serviceHoursTotal: newHours }
          : member
      )
    );

    setMessage("Service hours updated.");
  }

  if (checking) {
    return <main className="min-h-screen bg-black p-8 text-white">Checking access...</main>;
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <h1 className={`${bebas.className} text-6xl`}>Access Denied</h1>
        <p className="mt-4 text-neutral-300">Only admins can edit member service hours.</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#050008_0%,#16001f_35%,#3b0017_70%,#050008_100%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <AppNav
            links={[
                { label: "Admin", href: "/admin" },
                { label: "Events", href: "/admin/events" },
                { label: "Create Event", href: "/admin/events/new" },
            ]}
        />

        <p className={`${orbitron.className} text-xs uppercase tracking-[0.35em] text-red-300`}>
          Admin
        </p>

        <h1 className={`${bebas.className} mt-2 text-7xl tracking-wide`}>
          Members
        </h1>

        <p className="mt-4 text-neutral-300">
          View members and update total service hours.
        </p>

        {message && (
          <p className="mt-6 border border-purple-400/40 bg-purple-600/15 p-3 text-sm text-purple-200">
            {message}
          </p>
        )}

        <div className="mt-10 overflow-x-auto border border-purple-400/25 bg-black/45">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="border-b border-white/10 text-sm uppercase tracking-widest text-red-300">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Grad Year</th>
                <th className="p-4">Role</th>
                <th className="p-4">Service Hours</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-white/10 text-neutral-300">
                  <td className="p-4">{member.name}</td>
                  <td className="p-4">{member.email}</td>
                  <td className="p-4">{member.graduationYear}</td>
                  <td className="p-4">{member.role}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={editedHours[member.id] ?? "0"}
                      onChange={(event) =>
                        setEditedHours((previous) => ({
                          ...previous,
                          [member.id]: event.target.value,
                        }))
                      }
                      className="w-28 border border-white/10 bg-black/50 px-3 py-2 text-white outline-none focus:border-red-400"
                    />
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => saveHours(member.id)}
                      className="bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}