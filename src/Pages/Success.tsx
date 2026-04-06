import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSearchParams } from "react-router-dom";

const Success = () => {

    // const location = useLocation();

    const [searchParams] = useSearchParams();
    const [orderdetails,setOrderDetails] = useState<any>(null)

    useEffect(() => {

        console.log("sucess useeffect")
        // const queryParams = new URLSearchParams(location.search);
        const sessionId = searchParams.get("session_id");

        if (!sessionId)
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
                //make sure all get requests have withcredentailsenabled set to true
                const res = await axios.get(`http://localhost:3001/api/order?session_id=${sessionId}`, { withCredentials: true })
                console.log(res.data);

                setOrderDetails(res.data)


            } catch (error) {
                console.error("Failed to fetch order", error);
            }

        }

        GetOrder();

    }, [location.search])


    return (
        <>
            <div>Order Confirmation</div>

            <div>Price: {orderdetails?.productPrice} </div>
            <div>Order: {orderdetails?.productName} </div>

        </>

    )
}

export default Success