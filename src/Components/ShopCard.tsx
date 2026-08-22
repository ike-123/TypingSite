import React from 'react'
import { useNavigate } from 'react-router-dom';


type ShopCardProps = {
    item: any
    isKeyPackage: boolean
}

const ShopCard = (props: ShopCardProps) => {


    const navigate = useNavigate();

    function handleClick(item: any) {

        console.log("clicked");

        if (props.isKeyPackage) {
            navigate(`/product/key/${item.id}`, { state: { item } })

        }
        else {
            navigate(`/product/item/${item.id}`, { state: { item } })

        }
    }

    return (

        <>
         

                {
                    !props.isKeyPackage ?

                        <div className='flex flex-col bg-indigo-500 w-70 h-90 rounded-2xl hover:brightness-90 transition-all duration-150 hover:scale-99 border-2 border-white/50' onClick={() => { handleClick(props.item) }}>
                            {/* <Button onClick={handleCheckout}>Buy Item</Button> */}


                            <h1 className='text-4xl mt-auto font-bold pl-2 rounded-t-2xl'>{props.item.name}</h1>

                            <img className='w-60 h-60  object-contain self-center' src={props.item.thumbnailUrl} alt="" />


                            <div className='mt-auto'>


                                <div className=' flex justify-center items-center h-14 rounded-2xl rounded-t-none bg-purple-900 gap-0.5' onClick={() => { }}>

                                    <img className='h-12' src="https://static.vecteezy.com/system/resources/previews/022/187/081/non_2x/3d-key-caps-or-keyboard-icon-rendering-free-png.png" alt="" />
                                    <h1 className=' text-2xl font-bold'>{props.item.priceKeys}</h1>

                                </div>

                            </div>








                        </div>



                        :


                        <div className='flex flex-col bg-purple-500 w-70 h-90 rounded-2xl hover:brightness-90 transition-all duration-150 border-2 border-white/50 hover:scale-99  hover:' onClick={() => { handleClick(props.item) }}>
                            {/* <Button onClick={handleCheckout}>Buy Item</Button> */}


                            <h1 className='text-4xl mt-auto font-bold pl-2 rounded-t-2xl'>{props.item.name}</h1>

                            <img className='w-60 h-60  object-contain self-center' src="https://static.vecteezy.com/system/resources/previews/022/187/081/non_2x/3d-key-caps-or-keyboard-icon-rendering-free-png.png" alt="" />


                            <div className='mt-auto'>


                                <div className=' flex justify-center items-center h-14 rounded-2xl rounded-t-none bg-purple-900 gap-0.5' onClick={() => { }}>


                                    <h1 className=' text-2xl font-bold'>£{props.item.price}</h1>

                                </div>

                            </div>




                        </div>




                }

            

        </>



    )
}

export default ShopCard