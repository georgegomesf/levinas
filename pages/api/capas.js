import axios from 'axios';

const admin = require("firebase-admin");
var {google} = require("googleapis");

const { privateKey } = JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY)

const serviceAccount = {
    "type": "service_account",
    "project_id": process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    "private_key_id": process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    "private_key": privateKey,
    "client_email": process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_ADMIN_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL
  }

var scopes = [
"https://www.googleapis.com/auth/userinfo.email",
"https://www.googleapis.com/auth/firebase.database",
"https://www.googleapis.com/auth/datastore",
"https://www.googleapis.com/auth/cloud-platform"
];

const url = 'https://firebasestorage.googleapis.com/v0/b/filodoc-af03f.appspot.com/o/'

const setUrlImage = async (id,tipo) => {
    var jwtClient = new google.auth.JWT(
        serviceAccount.client_email,
        null,
        serviceAccount.private_key,
        scopes
    );

    const res = await jwtClient.authorize();    

    const image = await axios.get(`${url}${tipo}%2F${id}.jpeg`,{ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${res.access_token}`
        }
    }).catch(e=>console.log())

    return image;

}

const capas = async (req, res) => {
        
    const { action, id, tipo } = req.body  

    if(action=="getImages"){

        const loadEvents = id.map(
            async event =>
            await setUrlImage(event,tipo)
            );
            

        try {

            const resolvedValues = await Promise.all(loadEvents);
                    
            return res.json(resolvedValues?.map( i => { return { id: parseInt(i?.data.name.replace(tipo+'/','').replace('.jpeg','')), token: i?.data.downloadTokens } }));

        } catch (err) {

            return res.status(500).json({
            status: 'err',
            error: err.message
            });

        }

    }

}

export default capas;