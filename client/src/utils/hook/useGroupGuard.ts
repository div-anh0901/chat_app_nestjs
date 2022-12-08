import {useEffect,useState } from 'react';
import {useParams } from 'react-router-dom';
import { fetchGroupById } from '../api';

export function useGroupGurad() {
    const { id } = useParams();
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState();
    const controller = new AbortController();


    useEffect(() => {
        setLoading(true);
        fetchGroupById(parseInt(id!))
            .catch((err) => {
                setError(err)
            })
            .finally(() => setLoading(false));

        return () => {
            controller.abort()
        }
    }, [id]);
 

    return { loading, error }

}