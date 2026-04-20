import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import axios from 'axios'
import { useInView, InView } from "react-intersection-observer";


const Shop = () => {

    const [visibleSection, setVisibleSection] = useState("featured");

    const [shopItems, setShopItems] = useState([]);
    const [keyPackages, SetKeyPackages] = useState([]);


    useEffect(() => {

        //should I always use a try catch block with axios requests?


        try {
            async function getShopItems() {

                const res = await axios.get("http://localhost:3001/api/shopItems");

                console.log(res?.data);
                setShopItems(res?.data.shopItems);
                SetKeyPackages(res?.data.keyPackages)


            }

            getShopItems();

        } catch (error) {
            console.log(error)
        }


    }, [])




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


    async function BuyShopItem(shopItemId: number) {
        try {


            const res = await axios.post("http://localhost:3001/api/BuyShopItem", { shopItemId },
                {
                    withCredentials: true
                }
            )

            console.log(res.data);

        } catch (error) {
            console.error("checkout error", error);
        }
    }


    const scrollToSection = (id: any) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
        });
    };



    return (
        <div className='flex'>

            <div className='bg-purple-400 h-100 w-50 fixed'>

                <div className='flex flex-col gap-3'>


                    <Button className={`text-2xl rounded-sm p-2 ${visibleSection === "featured" ? "bg-blue-900" : "bg-blue-500 "}`} onClick={() => { scrollToSection("featured") }}>
                        Featured
                    </Button>

                    <Button className={`text-2xl rounded-sm p-2 ${visibleSection === "multiplayer" ? "bg-blue-900" : "bg-blue-500 "}`} onClick={() => { scrollToSection("multiplayer") }}>
                        Multiplayer
                    </Button>

                    <Button className={`text-2xl rounded-sm p-2 ${visibleSection === "merch" ? "bg-blue-900" : "bg-blue-500 "}`} onClick={() => { scrollToSection("merch") }}>

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
                            ref={ref} id='featured' className='mb-30 bg-orange-100 pt-5'
                        >
                            <h1 className='text-6xl mb-5 font-bold'>Featured</h1>

                            <div className=' flex flex-wrap gap-3'>



                                {
                                    shopItems.map((item: any) => (


                                        <>
                                            {
                                                item.featured === true ?

                                                    <div className='flex flex-col bg-indigo-500 w-60 h-70 rounded-2xl'>
                                                        {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                                        <img className='w-3/4 h-50 self-center' src="https://static.vecteezy.com/system/resources/previews/052/259/440/non_2x/a-smiling-3d-cartoon-car-character-full-of-energy-and-joy-free-png.png" alt="" />

                                                        <h1 className='text-4xl font-bold pl-2'>{item.name}</h1>
                                                        <h2 className='pl-2'>Keys {item.priceKeys}</h2>

                                                        <Button onClick={() => { BuyShopItem(item.id) }}>Buy</Button>





                                                    </div> : ""

                                            }

                                        </>


                                    ))
                                }

                                {
                                    keyPackages.map((item: any) => (


                                        <>
                                            {
                                                item.featured === true ?

                                                    <div id={item.id} className='flex flex-col bg-indigo-500 w-60 h-70 rounded-2xl'>
                                                        {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                                        <img className='w-3/4 h-50 self-center' src="https://static.vecteezy.com/system/resources/previews/022/187/081/non_2x/3d-key-caps-or-keyboard-icon-rendering-free-png.png" alt="" />

                                                        <h1 className='text-4xl font-bold pl-2'>{item.name}</h1>
                                                        <h2 className='pl-2'>Keys {item.price}</h2>

                                                        <Button onClick={() => { BuyShopItem(item.id) }}>Buy</Button>





                                                    </div> : ""

                                            }

                                        </>


                                    ))
                                }

                            </div>


                        </div>
                    )}
                </InView>


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
                            ref={ref} id='featured' className='mb-30 bg-orange-100 pt-5'
                        >
                            <h1 className='text-6xl mb-5 font-bold'>Multiplayer</h1>

                            <div className=' flex flex-wrap gap-3'>



                                {
                                    shopItems.map((item: any) => (


                                        <>
                                            {
                                                item.mode === "multiplayer" ?

                                                    <div className='flex flex-col bg-indigo-500 w-60 h-70 rounded-2xl'>
                                                        {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                                        <img className='w-3/4 h-50 self-center' src="https://static.vecteezy.com/system/resources/previews/052/259/440/non_2x/a-smiling-3d-cartoon-car-character-full-of-energy-and-joy-free-png.png" alt="" />

                                                        <h1 className='text-4xl font-bold pl-2'>{item.name}</h1>
                                                        <h2 className='pl-2'>Keys {item.priceKeys}</h2>

                                                        <Button onClick={() => { BuyShopItem(item.id) }}>Buy</Button>





                                                    </div> : "nothing"

                                            }

                                        </>


                                    ))
                                }

                            </div>


                        </div>
                    )}
                </InView>


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
                            ref={ref} id='featured' className='mb-30 bg-orange-100 pt-5'
                        >
                            <h1 className='text-6xl mb-5 font-bold'>Game</h1>

                            <div className=' flex flex-wrap gap-3'>

                                {
                                    shopItems.map((item: any) => (


                                        <>
                                            {
                                                item.mode === "game" ?

                                                    <div className='flex flex-col bg-indigo-500 w-60 h-70 rounded-2xl'>
                                                        {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                                        <img className='w-3/4 h-50 self-center' src="https://static.vecteezy.com/system/resources/previews/052/259/440/non_2x/a-smiling-3d-cartoon-car-character-full-of-energy-and-joy-free-png.png" alt="" />

                                                        <h1 className='text-4xl font-bold pl-2'>{item.name}</h1>
                                                        <h2 className='pl-2'>Keys {item.priceKeys}</h2>

                                                        <Button onClick={() => { BuyShopItem(item.id) }}>Buy</Button>





                                                    </div> : "nothing"

                                            }

                                        </>


                                    ))
                                }

                            </div>

                        </div>
                    )}
                </InView>




                <InView
                    key={"Keys"}
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
                            ref={ref} id='keys' className='mb-30'
                        >
                            <h1 className='text-6xl mb-5 font-bold'>Keys</h1>

                            <div className=' flex flex-wrap gap-3'>

                                {
                                    keyPackages.map((item: any) => (

                                        <div id={item.id} className='flex flex-col bg-indigo-500 w-60 h-70 rounded-2xl'>
                                            {/* <Button onClick={handleCheckout}>Buy Item</Button> */}

                                            <img className='w-3/4 h-50 self-center' src="https://static.vecteezy.com/system/resources/previews/022/187/081/non_2x/3d-key-caps-or-keyboard-icon-rendering-free-png.png" alt="" />

                                            <h1 className='text-4xl font-bold pl-2'>{item.name}</h1>
                                            <h2 className='pl-2'>{item.price}</h2>

                                        </div>

                                    ))
                                }





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