import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import axios from 'axios';


type ShopCardProps = {
    item: any
    isKeyPackage: boolean
    isequipped: boolean
    Equip: (item: any) => void;
}

const UserLockerCard = (props: ShopCardProps) => {


    const navigate = useNavigate();


    function handleClick(item: any) {

        navigate(`/product/item/${item.id}`, { state: { item } })

    }


    return (

        <>


            <div className={`flex relative border-3 ${props.isequipped ? "border-green-300 border-b-0 " : ""} relative flex-col bg-gray-800 w-60 h-60 rounded-2xl`} onClick={() => { props.Equip(props.item) }}>


                <Button className='w-4 right-1 rounded-full absolute' onClick={() => {handleClick(props.item)}}>Info</Button>
                {/* <Button onClick={handleCheckout}>Buy Item</Button> */}


                <h1 className='text-xl mt-auto font-bold pl-2  absolute rounded-t-2xl'>{props.item.name}</h1>

                <img className='w-50 h-60 pt-5 pb-5 object-contain self-center' src={props.item.thumbnailUrl} alt="" />


                {
                    props.isequipped ?

                        <div className='mt-auto absolute bottom-0 w-full'>


                            <div className=' flex justify-center items-center h-12 rounded-2xl rounded-t-none bg-green-500  gap-0.5'>

                                <h1 className=' text-2xl font-bold'>Equipped</h1>

                            </div>

                        </div>

                        : ""
                }

            </div>


        </>



    )
}

export default UserLockerCard