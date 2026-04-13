import React from 'react'
import { Button } from './ui/button'
import axios from 'axios'

const Shop = () => {

    async function handleCheckout() {
        try {
            const packageId = "key0"

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

            <div className='mx-auto flex justify-around max-w-7xl'>

                <div className='bg-indigo-500 w-60 h-70'>
                    {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                </div>


    <div className='bg-indigo-500 w-60 h-70'>
                    {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                </div>


    <div className='bg-indigo-500 w-60 h-70'>
                    {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                </div>


    <div className='bg-indigo-500 w-60 h-70'>
                    {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                </div>






            </div>
        </div>

    )
}

export default Shop