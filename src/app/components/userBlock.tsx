"use client";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { AuthContext, useAuthContext } from "../context/AuthContext";
import { AuthModal, signOutUser } from "./auth";
import "../sass/header.scss"
import { User, getAuth } from "firebase/auth";
import firebase_app from "../firebase/firebase_config";
import { Spinner } from "react-bootstrap";
import { GrowSpinner } from "./load";


const UserBlock = () => {
  const { user, isAdmin } = useAuthContext();

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [loadBuffer, setLoadBuffer] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoadBuffer(false);
    }, 600); 
  }, []);

    return (
        <div className="container">
            {loadBuffer && <GrowSpinner/>}
            {!loadBuffer && !user && <UnauthorisedComponent setIsRegister={setIsRegister}
                setShowRegisterModal={setShowRegisterModal} 
                setShowLoginModal={setShowLoginModal} />}

            <AuthModal setShowModal={showLoginModal ? setShowLoginModal : setShowRegisterModal} 
              showModal={showLoginModal ? showLoginModal: showRegisterModal} 
              isRegister={isRegister} 
            />
            {user && 
              <AuthorisedUserComponent displayName={user.displayName || "New User"} 
              />}

        </div>
    );
  };

const AuthorisedUserComponent = (props: {displayName: string,
  }): JSX.Element => {
  return (
    <div className="container text-end">
      <span className='text-white'>
          <p>Hello {props.displayName}</p>
      </span>
      <button type="button" className="btn btn-outline-light me-2" onClick={() => {
        signOutUser().catch(error => console.log(error))
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