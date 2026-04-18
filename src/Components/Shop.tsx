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
        <div className='flex'>

            <div className='bg-purple-400 h-100 w-50'>

                <div className='flex flex-col gap-3'>


                    <Button className='text-2xl  bg-blue-500 rounded-sm p-2'>
                        Featured
                    </Button>

                    <Button className='text-2xl   bg-blue-500  rounded-sm p-2' >
                        Multiplayer
                    </Button>

                    <Button className='text-2xl   bg-blue-500  rounded-sm p-2'>
                        Merch
                    </Button>



                </div>

            </div>

            <div className='mx-auto max-w-7xl'>

                <h1 className='text-7xl font-bold text-cyan-700 fixed'>{visibleSection}</h1>


                <InView
                    key={"featured"}
                    threshold={0}
                    rootMargin="-40% 0px -55% 0px"
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
                    threshold={0}
                    rootMargin="-40% 0px -55% 0px"
                    onChange={(inView, entry) => {
                        console.log("hey view")
                        if (inView) {
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
                    threshold={0}
                    rootMargin="-40% 0px -55% 0px"
                    onChange={(inView, entry) => {
                        if (inView) {
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




                {/* empty padding */}
                <div className='bg-amber-400 h-50'>
                </div>


                {/* 
                <div className="pointer-events-none fixed top-0 left-0 w-full h-full z-50">

                    <div className="absolute top-0 left-0 w-full h-[40%] bg-red-500/20" />


                    <div className="absolute top-[40%] left-0 w-full h-[5%] bg-green-500/30 border-y border-green-500" />


                    <div className="absolute bottom-0 left-0 w-full h-[55%] bg-blue-500/20" />
                </div>
 */}





            </div>

        </div>

    )
}

export default Shop