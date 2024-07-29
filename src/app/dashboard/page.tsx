"use client";

import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) router.push('/signin'); // Redirect if not authenticated
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>You're logged in as {session?.user?.email}</p>
    </div>
  );
}
