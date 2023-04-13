import * as firebaseAdmin from "firebase-admin";


const serviceAccount = "../../../../board-5ed22-firebase-adminsdk-zkrqy-118a432926.json"

if (!firebaseAdmin.apps.length) {
	firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert(serviceAccount)
	});
}


export { firebaseAdmin }