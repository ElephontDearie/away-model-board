// import { getAuth as adminAuth} from "firebase-admin/auth";
import * as firebaseAdmin from "firebase-admin";
// import { User } from 'firebase/auth';
import { firebaseAdminConfig } from "./firebase_config";
import { User } from "firebase/auth";


const serviceAccount = "/Users/hussoni/Projects/board-5ed22-firebase-adminsdk-zkrqy-118a432926.json"
if (!firebaseAdmin.apps.length) {
	firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert(serviceAccount)
	});
}

// export const grantAdminRightsOnRegister = (user: User) => {
//     try {
//         // const auth = getAuth(firebase_app)
//         // const credentials = isRegister ? 
//         //   await createUserWithEmailAndPassword(auth, email, password)
//         //   : await signInWithEmailAndPassword(auth, email, password);


//         // console.log('has currentUSe:' + auth.currentUser)
//         // const adminSDKApp = initializeApp();
//         // if (isRegister && adminAuth().currentUser) {

//         //   updateProfile(user, {
//         //     displayName: username,
//         //   })

//           // console.log('email in admin list:' + adminEmailAddresses.includes(email))
//           // if (adminEmailAddresses.includes(email)) {
//             adminAuth().setCustomUserClaims(user.uid, {  
//                 admin: true,
//             }).then (() => console.log('success'))
//     } catch (error: any) {
//         console.log(error)
//     }
// }

export { firebaseAdmin }