import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import axios from 'axios'
import { useInView, InView } from "react-intersection-observer";


const Shop = () => {

    const [visibleSection, setVisibleSection] = useState("featured");


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
        <div className='mx-auto max-w-7xl'>

            <h1 className='text-7xl font-bold text-cyan-700 fixed'>{visibleSection}</h1>


            <InView 
                key={"featured"}
                threshold={.8}
                onChange={(inView, entry) => {
                    if (inView) {
                        setVisibleSection(entry.target.id);
                    }
                }}
            >
                {({ ref }) => (
                    <div
                        ref={ref} id='featured' className='mb-30 bg-orange-100'
                    >
                        <h1 className='text-6xl mb-5 font-bold'>Featured</h1>

                        <div className=' flex flex-wrap gap-3'>

                            <div className='flex flex-col bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                <img className='w-3/4 h-50 self-center' src="https://static.vecteezy.com/system/resources/previews/052/259/440/non_2x/a-smiling-3d-cartoon-car-character-full-of-energy-and-joy-free-png.png" alt="" />

                                <h1 className='text-4xl font-bold pl-2'>Disney Car</h1>
                                <h2 className='pl-2'>Keys 100</h2>


                            </div>


                            <div className='flex flex-col items-center justify-around bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}
                                <img className='w-3/4 h-50 ' src="https://cdn3d.iconscout.com/3d/premium/thumb/car-3d-icon-png-download-8650446.png" alt="" />



                                <h1 className='text-4xl font-bold self-start pl-2'>Car</h1>

                            </div>


                            <div className='flex flex-col items-center justify-around bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}
                                <img className='w-3/4 h-50' src="https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg" alt="" />


                                <h1 className='text-4xl font-bold self-start pl-2'>Car</h1>

                            </div>



                            <div className='bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                <img src="https://static.vecteezy.com/system/resources/previews/056/090/137/non_2x/cute-leopard-jungle-avatar-3d-render-png.png" alt="" />
                            </div>

                            <div className='bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                <img src="https://static.vecteezy.com/system/resources/previews/052/259/440/non_2x/a-smiling-3d-cartoon-car-character-full-of-energy-and-joy-free-png.png" alt="" />

                            </div>


                            <div className='flex flex-col items-center justify-around bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}
                                <img className='w-3/4 h-50 ' src="https://cdn3d.iconscout.com/3d/premium/thumb/car-3d-icon-png-download-8650446.png" alt="" />



                                <h1 className='text-4xl font-bold self-start pl-2'>Car</h1>

                            </div>


                            <div className='flex flex-col items-center justify-around bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}
                                <img className='w-3/4 h-50' src="https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg" alt="" />


                                <h1 className='text-4xl font-bold self-start pl-2'>Car</h1>

                            </div>



                            <div className='bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                <img src="https://static.vecteezy.com/system/resources/previews/056/090/137/non_2x/cute-leopard-jungle-avatar-3d-render-png.png" alt="" />
                            </div>

                        </div>
                    </div>
                )}
            </InView>


             <InView
             
                key={"Mulitplayer"}
                threshold={0.8}
                onChange={(inView, entry) => {
                    if (inView ) {
                        setVisibleSection(entry.target.id);
                    }
                }}
            >
                {({ ref }) => (
                    <div
                        ref={ref} id='multiplayer' className='mb-30'
                    >
                        <h1 className='text-6xl mb-5 font-bold'>Mulitplayer</h1>

                        <div className=' flex flex-wrap gap-3'>

                            <div className='flex flex-col bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                <img className='w-3/4 h-50 self-center' src="https://static.vecteezy.com/system/resources/previews/052/259/440/non_2x/a-smiling-3d-cartoon-car-character-full-of-energy-and-joy-free-png.png" alt="" />

                                <h1 className='text-4xl font-bold pl-2'>Disney Car</h1>
                                <h2 className='pl-2'>Keys 100</h2>


                            </div>


                            <div className='flex flex-col items-center justify-around bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}
                                <img className='w-3/4 h-50 ' src="https://cdn3d.iconscout.com/3d/premium/thumb/car-3d-icon-png-download-8650446.png" alt="" />



                                <h1 className='text-4xl font-bold self-start pl-2'>Car</h1>

                            </div>


                            <div className='flex flex-col items-center justify-around bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}
                                <img className='w-3/4 h-50' src="https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg" alt="" />


                                <h1 className='text-4xl font-bold self-start pl-2'>Car</h1>

                            </div>



                            <div className='bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                <img src="https://static.vecteezy.com/system/resources/previews/056/090/137/non_2x/cute-leopard-jungle-avatar-3d-render-png.png" alt="" />
                            </div>

                            <div className='bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                <img src="https://static.vecteezy.com/system/resources/previews/052/259/440/non_2x/a-smiling-3d-cartoon-car-character-full-of-energy-and-joy-free-png.png" alt="" />

                            </div>


                            <div className='flex flex-col items-center justify-around bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}
                                <img className='w-3/4 h-50 ' src="https://cdn3d.iconscout.com/3d/premium/thumb/car-3d-icon-png-download-8650446.png" alt="" />



                                <h1 className='text-4xl font-bold self-start pl-2'>Car</h1>

                            </div>


                            <div className='flex flex-col items-center justify-around bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}
                                <img className='w-3/4 h-50' src="https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg" alt="" />


                                <h1 className='text-4xl font-bold self-start pl-2'>Car</h1>

                            </div>



                            <div className='bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                <img src="https://static.vecteezy.com/system/resources/previews/056/090/137/non_2x/cute-leopard-jungle-avatar-3d-render-png.png" alt="" />
                            </div>

                        </div>
                    </div>
                )}
            </InView>

            


             <InView
                key={"Merch"}
                threshold={0.5}
                onChange={(inView, entry) => {
                    if (inView && entry.intersectionRatio > 0.5) {
                        setVisibleSection(entry.target.id);
                    }
                }}
            >
                {({ ref }) => (
                    <div
                        ref={ref} id='merch' className='mb-30'
                    >
                        <h1 className='text-6xl mb-5 font-bold'>Merch</h1>

                        <div className=' flex flex-wrap gap-3'>

                            <div className='flex flex-col bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                <img className='w-3/4 h-50 self-center' src="https://static.vecteezy.com/system/resources/previews/052/259/440/non_2x/a-smiling-3d-cartoon-car-character-full-of-energy-and-joy-free-png.png" alt="" />

                                <h1 className='text-4xl font-bold pl-2'>Disney Car</h1>
                                <h2 className='pl-2'>Keys 100</h2>


                            </div>


                            <div className='flex flex-col items-center justify-around bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}
                                <img className='w-3/4 h-50 ' src="https://cdn3d.iconscout.com/3d/premium/thumb/car-3d-icon-png-download-8650446.png" alt="" />



                                <h1 className='text-4xl font-bold self-start pl-2'>Car</h1>

                            </div>


                            <div className='flex flex-col items-center justify-around bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}
                                <img className='w-3/4 h-50' src="https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg" alt="" />


                                <h1 className='text-4xl font-bold self-start pl-2'>Car</h1>

                            </div>



                            <div className='bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                <img src="https://static.vecteezy.com/system/resources/previews/056/090/137/non_2x/cute-leopard-jungle-avatar-3d-render-png.png" alt="" />
                            </div>

                            <div className='bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                <img src="https://static.vecteezy.com/system/resources/previews/052/259/440/non_2x/a-smiling-3d-cartoon-car-character-full-of-energy-and-joy-free-png.png" alt="" />

                            </div>


                            <div className='flex flex-col items-center justify-around bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}
                                <img className='w-3/4 h-50 ' src="https://cdn3d.iconscout.com/3d/premium/thumb/car-3d-icon-png-download-8650446.png" alt="" />



                                <h1 className='text-4xl font-bold self-start pl-2'>Car</h1>

                            </div>


                            <div className='flex flex-col items-center justify-around bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}
                                <img className='w-3/4 h-50' src="https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg" alt="" />


                                <h1 className='text-4xl font-bold self-start pl-2'>Car</h1>

                            </div>



                            <div className='bg-indigo-500 w-60 h-70 rounded-2xl'>
                                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                <img src="https://static.vecteezy.com/system/resources/previews/056/090/137/non_2x/cute-leopard-jungle-avatar-3d-render-png.png" alt="" />
                            </div>

                        </div>
                    </div>
                )}
            </InView>


            

            {/* Section */}
            <div >


            </div>



           



        </div>

    )
}

export default Shop