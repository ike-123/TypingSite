import React from 'react'
import { Button } from './ui/button'
import axios from 'axios'

const Shop = () => {

    async function handleCheckout() {
        try {
            const packageId = "keys_500"

            const res = await axios.post("http://localhost:3001/api/create-checkout-session", { packageId },
                {
                    withCredentials: true
                }
            )

            //redirect to stripe checkout. USE REACT ROUTER IN THE FUTURE!!
            window.location.href = res.data.url;

        } catch (error) {
            console.error("checkout error", error);
        }
    }


    return (
        <div>
            <Button onClick={handleCheckout}>Buy Item</Button>
        </div>
    )
}

export default Shop