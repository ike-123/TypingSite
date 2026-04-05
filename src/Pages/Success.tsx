import axios from 'axios';
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSearchParams } from "react-router-dom";

const Success = () => {

    // const location = useLocation();

    const [searchParams] = useSearchParams();

    useEffect(() => {

        // const queryParams = new URLSearchParams(location.search);
        const sessionId = searchParams.get("session_id");

        if (sessionId)
            return

        async function GetOrder() {

            //call backend to confirm the payment was successful

            // const res = axios.post("/api/confirm-payment", { sessionId }).then(Response => {

            //     //handle success, award user game keys
            //     console.log("adding keys")
            // }).catch(error => {
            //     console.error("payment confirmation failed: ", error);
            // })


            try {
                const res = await axios.get(`http://localhost:3001/api/order?session_id=${sessionId}`)
                console.log(res.data);


            } catch (error) {
                console.error("Failed to fetch order", error);
            }

        }

        GetOrder();

    }, [location.search])


    return (
        <div>Success Page</div>
    )
}

export default Success