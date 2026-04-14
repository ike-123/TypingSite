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

                <div className='bg-indigo-500 w-60 h-70 rounded-2xl'>
                    {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                    <img src="https://static.vecteezy.com/system/resources/previews/052/259/440/non_2x/a-smiling-3d-cartoon-car-character-full-of-energy-and-joy-free-png.png" alt="" />

                </div>


                <div className='bg-indigo-500 w-60 h-70 rounded-2xl'>
                    {/* <Button onClick={handleCheckout}>Buy Item</Button> */}
                    <img src="https://cdn3d.iconscout.com/3d/premium/thumb/car-3d-icon-png-download-8650446.png" alt="" />
                    
                    <h1 className='text-4xl font-bold pl-2'>Car</h1>

                </div>


                <div className='bg-indigo-500 w-60 h-70 rounded-2xl'>
                    {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                    <img src="https://png.pngtree.com/png-clipart/20240115/original/pngtree-rabies-day-pet-dog-world-rabies-cute-3d-dog-png-image_14120145.png" alt="" />

                </div>


                <div className='bg-indigo-500 w-60 h-70 rounded-2xl'>
                    {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                    <img src="https://static.vecteezy.com/system/resources/previews/056/090/137/non_2x/cute-leopard-jungle-avatar-3d-render-png.png" alt="" />
                </div>






            </div>
        </div>

    )
}

export default Shop