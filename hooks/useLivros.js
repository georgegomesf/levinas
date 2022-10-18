import { useContext } from 'react';
import LivrosContext from '../contexts/LivrosContext';

export function useLivros() {
    const value = useContext(LivrosContext);
    return value;
}