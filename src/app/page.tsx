"use client";

import Image from "next/image";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-24">
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>

      {isSignedIn && isLoaded && (
        <Link href={`/seller/${user.username}/manage-gigs/create`}>
          Create Gig
        </Link>
      )}
    </main>
  );
}
