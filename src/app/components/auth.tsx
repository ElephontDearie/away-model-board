import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal } from "react-bootstrap"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User, deleteUser } from 'firebase/auth';
import firebase_app from "../firebase/firebase_config";
import { grantAdminRightsOnRegister } from "../handlers/auth";
import { useAuthContext } from "../context/AuthContext";



const adminEmailAddresses = [
  'admin@example.com',
  'admin1@example.com',
  'admin@test.com',
  'admin1@test.com',
  'test@test.com'
]

// TODO: Add User deleted confirmation modal
export const deleteUserAccount = async (user: User) => {
  await deleteUser(user);
}

export const signOutUser = async () => {
  try {
    const auth = getAuth(firebase_app);
    const req = await auth.signOut();
    console.log(req)
  } catch (error) {
    console.log(error)
  }
}

const authoriseUser = async(email: string, password: string,
    isRegister: boolean,
    setError: Dispatch<SetStateAction<string | null>>, 
    setShowModal: Dispatch<SetStateAction<boolean>>,
    username: string,
     ) => {
    try {
        const auth = getAuth(firebase_app)
        const credentials = isRegister ? 
          await createUserWithEmailAndPassword(auth, email, password)
          : await signInWithEmailAndPassword(auth, email, password);

        if (isRegister && auth.currentUser) {

          updateProfile(auth.currentUser, {
            displayName: username,
          })

          if (adminEmailAddresses.includes(email)) {
            await grantAdminRightsOnRegister(auth.currentUser.uid);   
            await auth.currentUser.getIdTokenResult(true);
          }
        }
        setShowModal(false);
    } catch (error: any) {
        if (isRegister) {
          if(error.code == 'auth/email-already-in-use') {
            setError('An account already exists for this email address. Please sign in.')
          } else if (error.code == 'auth/weak-password') {
            setError(error.message)
          }
        }
        console.error(error)
        if (error.code == 'auth/invalid-email') {
          if (email == '') {
            setError('Please enter a valid email address.')
          } else if (password == '') {
            setError('Please enter a valid password.')
          } else if (isRegister) {
            setError('Email address is invalid.')
          } else  {
            setError('Please sign up to create a new account.')
          }
          
        } else if (error.code == 'auth/wrong-password') {
          setError('Incorrect login details. Please try again.')
        } else if (error.code == 'auth/user-not-found') {
          setError('Please sign up to create a new account.')
        }

    }
}


type Props = {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    isRegister: boolean;
}


export const AuthModal = (props: Props) => {
    const {showModal, setShowModal, isRegister, 
    } = props;
    const [input, setInput] = useState({ username: '', email: '', password: ''});
    const [error, setError] = useState<null | string>(null);

    const displayString = isRegister ? 'Sign Up' : 'Login';

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const userInput = e.target.value;
        setInput({...input, [e.target.name]: userInput})
    }
    const authorise = (email: string, password: string, displayName: string) =>  {
        authoriseUser(email, password, 
          isRegister, setError, setShowModal, 
          displayName, 
        )
    }


    return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{displayString}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {isRegister && <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <FormControl type="username" name="username" placeholder="Username" autoComplete="username"
                onChange={handleInput} />
              </Form.Group>
            }
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <InputGroup>
                <InputGroup.Text>@</InputGroup.Text>
                <FormControl type="email" name="email" placeholder="Enter email" autoComplete="email" 
                    onChange={handleInput} />
              </InputGroup>
            </Form.Group>
    
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <FormControl type="password" name="password" placeholder="Password" autoComplete={isRegister ? "new-password" : "current-password"}
                onChange={handleInput} />
            </Form.Group>

            {isRegister && <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <FormControl type="password" placeholder="Confirm Password" autoComplete={isRegister ? "new-password" : "current-password"}/>
            </Form.Group>}
          </Form>
          {error}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowModal(false)
            setError(null)
          }}>
            Close
          </Button>
          <Button variant="primary" onClick={() => authorise(input.email, input.password, input.username)}>
            {displayString}
          </Button>
        </Modal.Footer>
    </Modal>
    )
}