import axios from 'axios';
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const Success = () => {

    const location = useLocation();

    useEffect(() => {

        const queryParams = new URLSearchParams(location.search);
        const sessionId = queryParams.get("session_id");


        if (sessionId) {
            //call backend to confirm the payment was successful

            const res = axios.post("/api/confirm-payment", { sessionId }).then(Response => {

                //handle success, award user game keys
                console.log("adding keys")
            }).catch(error => {
                console.error("payment confirmation failed: ", error);
            })


        }
    }, [location])

    
    return (
        <div>Success</div>
    )
}

export default Success