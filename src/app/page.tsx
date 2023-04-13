"use client";
// import { Inter } from 'next/font/google'
// import styles from './page.module.css'
import Image from "next/image";
import "./sass/board.scss";
import { useEffect, useState } from 'react';
import { useAuthContext } from './context/AuthContext';
import { SprintView } from "./components/sprint";
import { LoadingPage } from "./components/load";


// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { user, isAdmin } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);


  // Load for 3 seconds while user is fetched from AuthContext
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); 
  }, []);


  // useEffect(() => {
  //   // import("bootstrap/dist/js/bootstrap");
  //   require("bootstrap/dist/js/bootstrap.bundle.min.js");
  // }, []);
  return (

    // <main className={styles.main}>  
    // <h1 className={inter.className}>Sprint Board</h1>
    // <main className='board'>  
    <main>
      {loading && <LoadingPage />}
      {!loading && 
        <>
          {user && <SprintView />}
          {!user && <UserLessDisplay />}
        </>

      }
      {/* {!user && <UserLessDisplay />}

      {user && <SprintView />} */}

      {/* <h1 className="display-5 fw-bold text-center">Away Project Tracker</h1> */}

    {/* <main className='d-flex flex-column'></main> */}
      {/* <h1>Sprint Board 1</h1> */}
      {/* <Header setAuthenticated={setAuthenticated} authenticated /> */}
      {/* <SprintBoard isAdmin={isAdmin}/> */}
      {/* Add peerInProgress peerCodeReview */}
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


