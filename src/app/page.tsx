"use client";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { useAuthContext } from './context/AuthContext';
import { SprintView } from "./components/sprint";
import { LoadingPage } from "./components/load";
import "./sass/board.scss";

// Entrypoint for the Web App
export default function Home() {
  const { user, isAdmin } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);


  // Load for 3 seconds while user is fetched from AuthContext
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); 
  }, []);

  return (
    <main className="board">
      {loading && <LoadingPage />}
      {!loading && 
        <>
          {user && <SprintView />}
          {!user && <UserLessDisplay />}
        </>
      }
    </main>
  )
}

const UserLessDisplay = () => {
  return (
    <section className={"text-center my-5 py-5"}>
      <h1 className={"text-muted alert alert-warning"}>Please <b>log in</b> <i>or</i> <b>sign up</b> to access sprints</h1>
      <Image
            src="/sprintLogo.svg"
            alt="board-logo"
            width={200}
            height={200}
            priority={true}
        />

    </section>
  )
}


