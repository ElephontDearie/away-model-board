import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal } from "react-bootstrap";
import { AuthContext, useAuthContext } from "../context/AuthContext";
import { AuthModal, signOutUser } from "./auth";
import Image from "next/image";
// import { AuthContext } from '../context/AuthContext';
import "../sass/header.scss"



type HeaderProps = {
  setAuthenticated: Dispatch<SetStateAction<boolean>>
  authenticated: boolean
}
const Header = (props: HeaderProps) => {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('');

  const { setAuthenticated, authenticated } = props
  // const { user } = useAuthContext();
  const user = useAuthContext();

  // const user = useContext(AuthContext);

  // console.log(user)
  // console.log(displayName)
  
  // console.log(authenticated)

  useEffect(() => {
    user?.displayName && setDisplayName(user.displayName)
  }, [user])


    return (
      <header className="p-3 bg-dark text-white">
        <div className="container">

          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <a
              href="#"
              className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
            >
              <Image
                src='/sprintLogo.svg'
                alt='board-logo'
                width={200}
                height={100}
                priority={true}
              />
            </a>
  
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li>
                <a href="#" className="nav-link px-2 text-white">
                  Past Sprints
                </a>
              </li>
              <li>
                <a href="#" className="nav-link px-2 text-white">
                  Backlog
                </a>
              </li>
              <li>
                <a href="#" className="nav-link px-2 text-white">
                  About
                </a>
              </li>
            </ul>
          </div>

            {!user && <UnauthorisedComponent setIsRegister={setIsRegister}
                setShowRegisterModal={setShowRegisterModal} 
                setShowLoginModal={setShowLoginModal} />}

            <AuthModal setShowModal={showLoginModal ? setShowLoginModal : setShowRegisterModal} 
              showModal={showLoginModal ? showLoginModal: showRegisterModal} 
              isRegister={isRegister} setAuthenticated={setAuthenticated} 
              setDisplayName={setDisplayName}/>
            {user && 
            <AuthorisedUserComponent displayName={displayName}
              setDisplayName={setDisplayName} setAuthenticated={setAuthenticated}
              authenticated={authenticated}/>}

        </div>
      </header>
    );
  };

const AuthorisedUserComponent = (props: {displayName: string, 
    setDisplayName: Dispatch<SetStateAction<string>>,
    setAuthenticated: Dispatch<SetStateAction<boolean>>, authenticated: boolean}): JSX.Element => {

      const user = useContext(AuthContext);

  return (
    <div className="container text-end">
      <span className='text-white'>
          <p>Hello {user?.displayName || props.displayName}</p>
      </span>
      <button type="button" className="btn btn-outline-light me-2" onClick={() => {
        signOutUser().then(() => {
          props.setDisplayName('');
          props.setAuthenticated(false)
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
    <button type="button" className="btn btn-warning" onClick={() => {
      props.setIsRegister(true)
      props.setShowRegisterModal(true)
    }}>
      Sign-up
    </button>
  </div>
  )
}
export default Header;