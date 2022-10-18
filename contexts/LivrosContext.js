import { createContext, useState, useEffect } from 'react';

const LivrosContext = createContext();

export function LivrosProvider({children}){

    const [status,setStatus] = useState();
    const [capa,setCapa] = useState();
    const [load,setLoad] = useState(true);

    return (
        <LivrosContext.Provider value={{
            capa,
            setCapa,
            status,
            setStatus,
            load,
            setLoad
        }}>
            {children}
        </LivrosContext.Provider>
    )

}

export const LivrosConsumer = LivrosContext.Consumer;

export default LivrosContext;