import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal } from "react-bootstrap";
import { useAuthContext } from "../context/AuthContext";
import { AuthModal, signOutUser } from "./auth";
// import { AuthContext } from '../context/AuthContext';



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

    return (
      <header className="p-3 bg-dark text-white">
        <div className="container">

          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <a
              href="#"
              className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
            >
              <img
                src='/sprintLogo.svg'
                alt='board-logo'
                width={200}
                height={100}
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
                    {console.log(authenticated)}

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
  return (
    <div>
      <div className='text-end text-white'>
          <p>Hello {props.displayName}!</p>
      </div>
      <button type="button" className="btn btn-outline-light me-2" onClick={() => {
        signOutUser().then(() => {
          props.setDisplayName('');
          props.setAuthenticated(false)
        });
        console.log(props.authenticated)

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