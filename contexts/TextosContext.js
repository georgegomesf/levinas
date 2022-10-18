import { createContext, useState, useEffect } from 'react';

const TextosContext = createContext();

export function TextosProvider({children}){

    const [status,setStatus] = useState();
    const [load,setLoad] = useState(true);

    return (
        <TextosContext.Provider value={{
            status,
            setStatus,
            load,
            setLoad
        }}>
            {children}
        </TextosContext.Provider>
    )

}

export const TextosConsumer = TextosContext.Consumer;

export default TextosContext;