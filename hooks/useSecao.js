import { useContext } from 'react';
import SecaoContext from '../contexts/SecaoContext';

export function useSecao() {
    const value = useContext(SecaoContext);
    return value;
}