import { getAuth as adminAuth} from "firebase-admin/auth";

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
  