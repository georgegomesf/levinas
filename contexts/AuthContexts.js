import { createContext, useState, useEffect } from 'react';
import { provider, getAuth, signInWithPopup, signOut, db, doc, getDoc, setDoc, updateDoc } from '../services/firebase'
import axios from "axios";
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({children}){
    
    const auth = getAuth();
    const [user, setUser] = useState();
    const [authLoading, setAuthLoading] = useState(true);
    const router = useRouter();  

    // Valida dados de autenticação e grava na sessão
    const getAuthentication = async (name,photoURL,uid,email,token) => {

        const docUser = doc(db, "users", uid)
        const userExists = await getDoc(docUser);

        if(!userExists.data()){
            setDoc(docUser,{                
                name: name,
                photo: photoURL,
                email: email
            })
        }
        
        setUser({            
            uid: uid,            
            name: name,
            photo: photoURL,
            email: email,
            token: token,
            isAdmin: userExists.data().isAdmin
        })        

        return true
        
    }

    // Autentica no Google
    const signInWithGoogle = async (path) => {

        setAuthLoading(true)
                
        const signIn = await signInWithPopup(auth,provider)
            .catch(e => console.log(e)); 
        const result_auth = signIn?.user && await getAuthentication(signIn?.user?.displayName, signIn?.user?.photoURL, signIn?.user?.uid, signIn?.user?.email, signIn?.user?.accessToken)

        setAuthLoading(false)

    }

    // Fica escutando a autenticação
    useEffect(() => {

        const authenticated = auth.onAuthStateChanged(userAuth => {

            if (!userAuth) {
                setUser(null)
                setAuthLoading(false)
                return;
            }            

            setAuthLoading(true)

            const { displayName, photoURL, uid, email, accessToken } = userAuth;

            const getMe = async () => {

                const docUser = doc(db, "users", uid);
                const userExists = await getDoc(docUser);                
                
                setUser( 
                    { 
                        uid: uid,
                        name: displayName,
                        photo: photoURL,
                        email: email,                        
                        token: accessToken,
                        isAdmin: userExists.data()?.isAdmin
                    }
                )                

                setAuthLoading(false)                

                return true      

            }
            getMe()                        

        })        

        return () => {            
           authenticated()
        }        

    }, [])

    // Desconecta do Google
    const signOutGoogle = (path) => {

        setAuthLoading(true)

        if(user){
            signOut(auth).then(() => {
                setUser()
                router.push();
            }).catch((error) => {
                console.log(error)
            });
        } else {            
            router.push();
        }

        setAuthLoading(false)        

    }

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle,
            signOutGoogle,            
            authLoading
        }}>
            {children}
        </AuthContext.Provider>
    )

}

export const AuthConsumer = AuthContext.Consumer;

export default AuthContext;