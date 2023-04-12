"use client";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { AuthContext, useAuthContext } from "../context/AuthContext";
import { AuthModal, signOutUser } from "./auth";
import "../sass/header.scss"
import { User, getAuth } from "firebase/auth";
import firebase_app from "../firebase/firebase_config";


const UserBlock = () => {
  const { user, isAdmin } = useAuthContext();
  // const user = useContext(AuthContext);


  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [isRegister, setIsRegister] = useState<boolean>(false);
  // const [displayName, setDisplayName] = useState<string>('');
  const [userLoaded, setUserLoaded] = useState<boolean>(false);
  // const [user, setUser] = useState<User | null>(useContext(AuthContext));

  
  // useEffect(() => {
  //   // user?.displayName && setDisplayName(user.displayName)
  //     const user = getAuth(firebase_app).currentUser;
  //     console.log(user)
  //     user && setUser(user)
    
  // }, [user])


    return (
        <div className="container">

            {!user && <UnauthorisedComponent setIsRegister={setIsRegister}
                setShowRegisterModal={setShowRegisterModal} 
                setShowLoginModal={setShowLoginModal} />}

            <AuthModal setShowModal={showLoginModal ? setShowLoginModal : setShowRegisterModal} 
              showModal={showLoginModal ? showLoginModal: showRegisterModal} 
              isRegister={isRegister} 
              // setDisplayName={setDisplayName} 
              // setUser={setUser}
              />
            {user && 
            <AuthorisedUserComponent 
              displayName={user.displayName || "New User"} 
              // setDisplayName={setDisplayName} 
              // setUser={setUser}
              />}

        </div>
    );
  };

const AuthorisedUserComponent = (props: {displayName: string, 
    // setDisplayName: Dispatch<SetStateAction<string>>, 
    // setUser: Dispatch<SetStateAction<User | null>>
  }): JSX.Element => {

  const user = useContext(AuthContext);

  return (
    <div className="container text-end">
      <span className='text-white'>
          <p>Hello {user?.displayName || props.displayName}</p>
      </span>
      <button type="button" className="btn btn-outline-light me-2" onClick={() => {
        signOutUser().then(() => {
          // props.setDisplayName('');
          // props.setUser(null);
        });
      }}>
        Sign Out
      </button>
    </div>
  )
}

const UnauthorisedComponent = (props: {setIsRegister: Dispatch<SetStateAction<boolean>>, 
  setShowRegisterModal: Dispatch<SetStateAction<boolean>>, 
  setShowLoginModal: Dispatch<SetStateAction<boolean>>}) => {
  return (
    <div className="text-end">
    <button type="button" className="btn btn-outline-light me-2" onClick={() => props.setShowLoginModal(true)}>
      Login
    </button>
    <button type="button" className="bg-success sign-up btn btn-outline-light" onClick={() => {
      props.setIsRegister(true)
      props.setShowRegisterModal(true)
    }}>
      Sign-up
    </button>
  </div>
  )
}
export default UserBlock;