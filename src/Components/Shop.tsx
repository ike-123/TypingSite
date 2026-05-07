import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import axios from 'axios'
import { useInView, InView } from "react-intersection-observer";
import { useNavigate } from 'react-router-dom';
import ShopCard from './ShopCard';


const Shop = () => {

    const navigate = useNavigate();

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

    function handleClick(item: any) {

        console.log("clicked");
        navigate(`/product/${item.id}`, { state: { item } })
    }


    return (
        <div className='flex bg-gray-700 max-w-7xl mx-auto'>

            <div className='bg-gray-400 h-100 w-70 sticky top-0 h-screen'>

                <div className='flex flex-col gap-3'>


                    <Button className={`text-2xl rounded-sm h-12 flex justify-start ${visibleSection === "featured" ? "bg-blue-900" : ""}`} onClick={() => { scrollToSection("featured") }}>
                        Featured
                    </Button>

                    <Button className={`text-2xl rounded-sm h-12 flex justify-start ${visibleSection === "multiplayer" ? "bg-blue-900" : ""}`} onClick={() => { scrollToSection("multiplayer") }}>
                        Multiplayer
                    </Button>
{/* 
                    <Button className={`text-2xl rounded-sm h-12 flex justify-start ${visibleSection === "game" ? "bg-blue-900" : ""}`} onClick={() => { scrollToSection("game") }}>
                        Game
                    </Button> */}

                    <Button className={`text-2xl rounded-sm h-12 flex justify-start  ${visibleSection === "keys" ? "bg-blue-900" : ""}`} onClick={() => { scrollToSection("keys") }}>
                        Keys
                    </Button>



                </div>

            </div>


            <div className='w-full bg-amber-200  p-2 ml-2'>

                {/* <h1 className='text-7xl font-bold text-cyan-700 fixed'>{visibleSection}</h1> */}

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
                            ref={ref} id='featured' className='mb-30 pt-5'
                        >
                            <h1 className='text-6xl mb-5 font-bold'>Featured</h1>

                            <div className=' flex flex-wrap gap-3'>



                                {
                                    shopItems.map((item: any) => (


                                        <>
                                            {
                                                item.featured === true ?

                                                    <ShopCard item={item} isKeyPackage={false}/> : ""

                                            }

                                        </>


                                    ))
                                }

                                {
                                    keyPackages.map((item: any) => (


                                        <>
                                            {
                                                item.featured === true ?
                                                    <ShopCard item={item} isKeyPackage={true}/>

                                                    : ""

                                            }

                                        </>


                                    ))
                                }

                            </div>


                        </div>
                    )}
                </InView>


                <InView
                    key={"multiplayer"}
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
                            ref={ref} id='multiplayer' className='mb-30  pt-5'
                        >
                            <h1 className='text-6xl mb-5 font-bold'>Multiplayer</h1>

                            <div className=' flex flex-wrap gap-3'>



                                {
                                    shopItems.map((item: any) => (


                                        <>
                                            {
                                                item.mode === "multiplayer" ?

                                                    <ShopCard item={item} isKeyPackage={false}/>: "nothing"

                                            }

                                        </>


                                    ))
                                }

                            </div>


                        </div>
                    )}
                </InView>


                {/* <InView
                    key={"game"}
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
                            ref={ref} id='game' className='mb-30 bg-orange-100 pt-5'
                        >
                            <h1 className='text-6xl mb-5 font-bold'>Game</h1>

                            <div className=' flex flex-wrap gap-3'>

                                {
                                    shopItems.map((item: any) => (


                                        <>
                                            {
                                                item.mode === "game" ?

                                                    <div className='flex flex-col bg-indigo-500 w-60 h-70 rounded-2xl'>


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
 */}



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

                                        <ShopCard item={item} isKeyPackage={true}/>
                                    ))
                                }





                            </div>
                        </div>
                    )}
                </InView>




                {/* empty padding */}
                {/* <div className='bg-amber-400 h-50'>
                </div> */}


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