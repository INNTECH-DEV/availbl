"use client";

import { Inter } from "@next/font/google";

import Hero from "@/components/Hero";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "@/firebase/firebaseClient";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [user, userLoading] = useAuthState(firebase.auth());

  return (
    <>{!userLoading ? <Hero user={user} /> : <Loading />}</>
    // <main className={styles.main}>
    //   <h1 className="text-3xl font-bold underline">Hello world!</h1>

    //   {/* Write me a link to navigate to /login in next js */}
    //   <Link href="/login">Login</Link>
    //   <Link href="/dashboard">Dashboard</Link>

    //   <button onClick={() => firebase.auth().signOut()}>Logout</button>
    // </main>
  );
}
