import { useContext } from 'react';
import TextosContext from '../contexts/TextosContext';

export function useTextos() {
    const value = useContext(TextosContext);
    return value;
}