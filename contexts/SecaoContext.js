import { createContext, useState, useEffect } from 'react';

const SecaoContext = createContext();

export function SecaoProvider({children}){

    const [secao,setSecao] = useState();

    return (
        <SecaoContext.Provider value={{
            secao,
            setSecao
        }}>
            {children}
        </SecaoContext.Provider>
    )

}

export const SecaoConsumer = SecaoContext.Consumer;

export default SecaoContext;