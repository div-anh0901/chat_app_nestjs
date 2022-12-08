import { useState,useEffect } from "react";
import { useParams } from "react-router";
import { getConversationById } from "../api";

export function useConversationGuard() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    
    const [error, setError] = useState();
    const controller = new AbortController();

    useEffect(() => {
        setLoading(true);
        getConversationById(parseInt(id!))
            .catch((err) => {
                setError(err);
            })
            .finally(() => setLoading(false));
        return () => {
            controller.abort();
        }
    }, [id]);


    return { loading, error };
}