import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useInView, InView } from "react-intersection-observer";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import UserLockerCard from '@/Components/UserLockerCard';


const MultiplayerCharacterSelect = () => {

    const navigate = useNavigate();

    // const [visibleSection, setVisibleSection] = useState("featured");

    const [GroupedItems, SetGroupedItems] = useState<any>();
    const [equippedItems, SetEquippedItems] = useState<any>();


    //Use a UseMemo to only rebuild when equippeditem Changes
    const equippedItemIds = new Set(
        equippedItems?.map((item: any) => item.itemid)
    )

    // const [keyPackages, SetKeyPackages] = useState([]);




    //Retrieve the users inventory 
    // Retrieve the user equipped items


    //Show that item is equipped


    useEffect(() => {

        //should I always use a try catch block with axios requests?


        try {
            async function getItems() {

                const res = await axios.get("http://localhost:3001/api/Inventory", { withCredentials: true });


                console.log(res?.data);
                SetGroupedItems(res?.data?.GroupedItems);
                SetEquippedItems(res?.data?.equippedItems);



            }

            getItems();

        } catch (error) {
            console.log(error)
        }


    }, [])

    function EquipItem(item: any) {

        try {

            async function Equip() {

                const res = await axios.post("http://localhost:3001/api/EquipItem",
                    { itemid: item.id },
                    { withCredentials: true });
                console.log(res?.data?.equippedItems);
                SetEquippedItems(res?.data?.equippedItems);
            }

            Equip();

        } catch (error) {

        }
    }




    const scrollToSection = (id: any) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
        });
    };


    return (
        <div className='flex  border-2  bg-zinc-900 rounded-2xl h-full p-3 overflow-y-scroll w-full mx-auto'>

            <div >
                {
                    GroupedItems?.avatar ?

                        <>

                            <div className=' flex flex-wrap gap-3'>



                                {
                                    GroupedItems?.avatar?.map((item: any) => {

                                        const isequipped = equippedItemIds.has(item.id)

                                        return (
                                            <>
                                                {
                                                    item.slot === "avatar" ?

                                                        <div className={`flex ${isequipped ? "border-green-300 border-5" : "border-1"} relative flex-col bg-gray-800 w-20 h-20 rounded-2xl`} onClick={() => { EquipItem(item) }}>


                                                            {/* <Button className='w-4 right-1 rounded-full absolute' onClick={() => { handleClick(props.item) }}>Info</Button> */}
                                                            {/* <Button onClick={handleCheckout}>Buy Item</Button> */}


                                                            <img className='w-55 h-55  object-contain self-center' src="https://static.vecteezy.com/system/resources/previews/052/259/440/non_2x/a-smiling-3d-cartoon-car-character-full-of-energy-and-joy-free-png.png" alt="" />


                                                            {/* {
                                                                isequipped ?

                                                                    <div className='mt-auto'>


                                                                        <div className=' flex justify-center items-center h-12 rounded-2xl rounded-t-none bg-green-500  gap-0.5'>

                                                                            <h1 className=' text-2xl font-bold'>Equipped</h1>

                                                                        </div>

                                                                    </div>

                                                                    : ""
                                                            } */}

                                                        </div>

                                                        : ""

                                                }

                                            </>
                                        )



                                    })
                                }

                            </div>

                        </>
                        : ""
                }

            </div>

        </div>

    )
}

export default MultiplayerCharacterSelect