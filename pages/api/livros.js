import axios from 'axios';

const admin = require("firebase-admin");

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

const verifyIdToken = async (token) => {
    
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    const auth = await admin.auth().verifyIdToken(token)

    const user = admin
    .firestore()
    .collection('users')
    .doc(auth.uid)
    .get().catch((e) => { console.log('') })

    return user;
    
    // return admin.auth().verifyIdToken(token).catch((e) => { console.log('') });
}

const setHeader = () => {
    return {
        headers: {
            'Content-Type':'application/json',            
            'x-hasura-admin-secret':`${process.env.HASURA_TOKEN}`
        }
    }
}

const livros = async (req, res) => {

    const { action, lang, page, filo, token, id, event } = req.body  

    const usuario = token && await verifyIdToken(token)

    if(action=="getLivros"){

        const idioma = lang ? `idioma: { _ilike: "%${lang ?? null}%" },` : ""
        const pagina = page > 1 ? `offset: ${(page-1)*9},` : ""
        const filosofo = filo>0 ? `filosofo: {filosofo_id: {_eq: ${filo}} },` : ""
        const autoria = filo==0 ? `_and: [ {autor: { _nilike: "%lévinas%" }}, {autor: { _nilike: "%levinas%" }}]` : ""
        const published = !usuario?.data().isAdmin ? `published_at: {  _is_null: false }` : `published_at: {  _is_null: false }`

        const response = await axios.post(process.env.HASURA_GRAPHQL_URL,{
            query: `{
                filodoc_livros(limit: 9, ${pagina} where: { ${idioma} ${filosofo} ${autoria} ${published} }, order_by: { data_publicacao: desc }) {
                    id
                    id_google
                    autor
                    titulo
                    subtitulo
                    descricao
                    editora
                    paginas
                    published_at
                    data_publicacao  
                }
            }`
        },setHeader()).catch(e=>console.log(e.response.data.errors))

        const response1 = await axios.post(process.env.HASURA_GRAPHQL_URL,{
            query: `{
                filodoc_livros_aggregate (where: { ${idioma} ${filosofo} ${autoria} ${published} } ) {
                    aggregate {
                        count
                    }
                }                
            }`
        },setHeader()).catch(e=>console.log(e.response.data.errors))

        return res.status(200).json({count: response1?.data.data?.filodoc_livros_aggregate.aggregate.count, dados: response?.data.data?.filodoc_livros})

    }

    if(action=="defStatus" && usuario?.data().isAdmin){

        const status = event ? '"2022-09-24 23:58:38.790"' : null
        
        const response = await axios.post(process.env.HASURA_GRAPHQL_URL,{
            query: `mutation status {
                update_filodoc_livros_by_pk(
                    pk_columns: { id: ${id} },_set: { published_at: ${status} }
                  ){
                    published_at
                }   
            }`
        },setHeader()).catch(e=>console.log(e.response.data.errors))

        return res.status(200).json({})

    }

    res.end()

}

export default livros;