import * as firebaseAdmin from "firebase-admin";


const serviceAccount = process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_CONFIG_PATH as string;

if (!firebaseAdmin.apps.length) {
	firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert(serviceAccount)
	});
}


export { firebaseAdmin }