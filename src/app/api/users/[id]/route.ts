import { getAuth as adminAuth} from "firebase-admin/auth";
// import * as firebaseAdmin from "firebase-admin";

// const serviceAccount = "/Users/hussoni/Projects/board-5ed22-firebase-adminsdk-zkrqy-118a432926.json"
// if (!firebaseAdmin.apps.length) {
//     // firebaseAdmin.initializeApp()
// 	firebaseAdmin.initializeApp({
// 		credential: firebaseAdmin.credential.cert(serviceAccount),
//         projectId: "board-5ed22"
// 	});
// }

export async function PUT(request: Request) {
    const { id } = await request.json();
    console.log(id)

    try {
   
        const operation = await adminAuth().setCustomUserClaims(id, {  
            admin: true,
        })
        return new Response(JSON.stringify(operation), {
            status: 200
          });

    } catch (error: any) {
        console.log(error)
        return new Response(JSON.stringify('Error increasing user privileges.'), {
            status: 500
        })
    }
  }
  