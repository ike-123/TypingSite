import { Button } from '@/components/ui/button'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as THREE from 'three';
import { OrbitControls, useHelper, useTexture } from "@react-three/drei";
import ItemModel from '@/Components/Item3dModel';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom"

import { MeshReflectorMaterial } from '@react-three/drei';





import {
    Application,
    extend,
    useApplication,
} from '@pixi/react';
import {
    Assets,
    Container,
    Graphics,
    Sprite,
    Texture,
} from 'pixi.js';
import AnimatedSpriteAvatar from '@/Components/AnimatedSpriteAvatar';
import MultiplayerRaceTrack from '@/Components/MultiplayerRaceTrack';
import type { PlayerState } from './Multiplayer';
import { Spotlight } from 'lucide-react';

extend({
    Container,
    Graphics,
    Sprite,
});

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogPortal
} from "@/components/ui/dialog"
import { useAuthStore } from '@/Stores/AuthStore';

import type { AvatarResult } from './Multiplayer';

// import robotUrl from '../assets/robot.fbx';

// function SpinningModel() {
//     const modelRef = useRef<any>(null);

//     useFrame(() => {
//         if (modelRef.current) {
//             modelRef.current.rotation.y += 0.01;
//         }
//     });

//     return (
//         <mesh ref={ref}>
//             <boxGeometry />
//             <meshStandardMaterial color="orange" />
//         </mesh>
//     );
// }

const Product = () => {

    // const [model, SetModel] = useState<any>();

    const location = useLocation();
    const passedItemFromShopPage = location.state?.item

    // const Floortexture = useTexture("https://png.pngtree.com/background/20250104/original/pngtree-texture-of-vibrant-purple-wallpaper-picture-image_15297775.jpg");


    const User = useAuthStore((state) => state.user)


    const { type, id } = useParams()

    const [shopItem, setShopItem] = useState<any>();

    const model = useLoader(FBXLoader, '/robot.fbx');

    // const Modelref = useRef<any>(null);


    const [loading, setLoading] = useState(true)

    const [resetKey, setResetKey] = useState(0);

    const [modalContent, SetModalContent] = useState<any>()

    const [showDialogBox, SetDialogBox] = useState(false)

    // const sprite = new Sprite({
    //     texture: Texture.from('https://pixijs.com/assets/bunny.png')
    // });



    const [Inventory, SetInventory] = useState<any>();


    // //Use a UseMemo to only rebuild when equippeditem Changes
    // const equippedItemIds = new Set(
    //     equippedItems?.map((item: any) => item.itemid)
    // )






    const [texture, setTexture] = useState(null)


    const placeholderPlayer: PlayerState = {
        id: "placeholder",
        progressIndex: 1,
        wpm: 0,
        accuracy: 0,
        finished: false,
        finishtime: "",
        DisplayName: "",
        avatarUrl: {
            atlasUrl: "",
            spriteSheetUrl: ""
        },
        lastWordIndexIncreaseTime: 0,
        Disconnected: false
    }

    const [PlaceHolderPlayerArray, SetPlaceHolderPlayerArray] = useState<PlayerState[]>([placeholderPlayer])


    // PlaceHolderPlayerArray[0] = placeholderPlayer;

    useEffect(() => {

        //should I always use a try catch block with axios requests?


        try {
            async function getItems() {

                const res = await axios.get("http://localhost:3001/api/Inventory", { withCredentials: true });

                console.log(res?.data);
                SetInventory(res?.data?.GroupedItems);

            }

            getItems();

        } catch (error) {
            console.log(error)
        }


    }, [])



    useEffect(() => {

        // async function loadAsset() {
        //     const texture = await Assets.load('/profile.jpeg');

        //     setTexture(texture);

        //     //  const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

        // }

        // loadAsset();

        console.log("AAAAAAAAAASDFASDF")

        async function getShopItem() {


            try {
                setLoading(true)

                console.log(id)


                const res = await axios.get(`http://localhost:3001/api/product/${type}/${id}`, { params: { productId: id } });

                console.log(res?.data);
                setShopItem(res?.data);

                const newAvatarUrl = res?.data.assetUrl
                const newSpriteSheetUrl = res?.data.spriteSheetUrl

                SetPlaceHolderPlayerArray((prev) =>

                    prev.map(player => ({
                        ...player,
                        avatarUrl: {
                            atlasUrl: newAvatarUrl,
                            spriteSheetUrl: newSpriteSheetUrl,
                        }
                    }))
                )


            } catch (error) {
                if (axios.isAxiosError(error)) {

                    if (error.response?.data.code === "ITEM_NOT_FOUND") {
                        //redirect to error page or custom item not found page
                        // navigate("/not-found");
                        console.log("Item not found")
                    }
                }
            }
            finally {
                setLoading(false)
            }

        }

        if (passedItemFromShopPage) {
            console.log("passeditemfromshop")
            console.log(passedItemFromShopPage);
            setShopItem(passedItemFromShopPage);

            SetPlaceHolderPlayerArray((prev) =>

                prev.map(player => ({
                    ...player,
                    avatarUrl: {
                        atlasUrl: passedItemFromShopPage.assetUrl,
                        spriteSheetUrl: passedItemFromShopPage.spriteSheetUrl,
                    }
                }))
            )


            setLoading(false);
        }
        else {
            getShopItem();
        }



    }, [id, passedItemFromShopPage])

    useEffect(() => {
        model.traverse((child: any) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({ color: 'teal' });
            }
        });
    }, [model]);




    async function BuyShopItem(shopItemId: string) {
        try {


            const res = await axios.post("http://localhost:3001/api/BuyShopItem", { shopItemId },
                {
                    withCredentials: true
                }
            )

            console.log(res.data);


            // SetModalContent(
            //     <>
            //         <h1 className="text-2xl">Purchase Successful!</h1>
            //     </>
            // );

            // SetDialogBox(true);

            window.location.reload();


        } catch (error) {


            if (axios.isAxiosError(error)) {

                const errorCode = error.response?.data.code

                let modaltext = null;

                switch (errorCode) {

                    case "USER_NOT_FOUND":

                        modaltext = (
                            <>
                                <h1 className='text-2xl'>User Not Found</h1>
                            </>
                        )

                        SetModalContent(modaltext);
                        SetDialogBox(true);
                        break;

                    case "ITEM_NOT_FOUND":

                        modaltext = (
                            <>
                                <h1 className='text-2xl'>Item not Found</h1>
                            </>
                        )

                        SetModalContent(modaltext);
                        SetDialogBox(true);
                        break;

                    case "INSUFFICIENT_KEYS":

                        modaltext = (
                            <>
                                <h1 className='text-2xl'>Insufficent amount of keycaps</h1>
                            </>
                        )

                        SetModalContent(modaltext);
                        SetDialogBox(true);
                        break;



                    case "ITEM_ALREADY_OWNED":

                        modaltext = (
                            <>
                                <h1 className='text-2xl'>{error.response?.data.error}</h1>
                            </>
                        )

                        SetModalContent(modaltext);
                        SetDialogBox(true);
                        break;

                    default:
                        console.log("Unknown error");
                }
            }

            console.error("checkout error", error);
        }
    }



    async function handleCheckout(keyPackageId: string) {
        try {
            // const packageId = "key0"

            const res = await axios.post("http://localhost:3001/api/create-checkout-session", { keyPackageId },
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





    const renderSlot = () => {

        //If the type is key then we only need to render the thumbnail image in the render section
        switch (type) {
            case "key":

                return (
                    <>
                        {/* Get the imageurl from the shopitem */}
                        <img src="https://static.vecteezy.com/system/resources/previews/022/187/081/non_2x/3d-key-caps-or-keyboard-icon-rendering-free-png.png" alt="" />
                    </>
                )
        }



        switch (shopItem?.slot) {
            case "avatar":
                return (

                    //Use HTML/Tailwind to overlay a finish line at the end of the track

                    <div className='flex flex-col justify-center h-full'>
                        <Application >
                            <pixiContainer scale={2.5}>
                                <MultiplayerRaceTrack key={resetKey} ShopDisplay={true} Players={PlaceHolderPlayerArray} wordsLength={30} />
                            </pixiContainer>
                        </Application>

                        <Button size={"lg"} className='w-18 mt-2' onClick={handleReset}>Restart</Button>

                    </div>




                );

            case "character":

                <Canvas shadows camera={{ position: [0, .5, 1.5], rotation: [0, 0, 0] }}>
                    <ambientLight intensity={.6} />
                    {/* <directionalLight castShadow position={[2, 2, 2]} /> */}

                    {/* <planeGeometry></planeGeometry> */}


                    //Floor
                    <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[20, 20]} />
                        {/* <meshStandardMaterial color={"#231452"} roughness={.2} metalness={.8} />
                             */}

                        <MeshReflectorMaterial
                            blur={[0, 0]} // Blur ground reflections (width, height), 0 skips blur
                            mixBlur={0} // How much blur mixes with surface roughness (default = 1)
                            mixStrength={1} // Strength of the reflections
                            mixContrast={1} // Contrast of the reflections
                            resolution={512} // Off-buffer resolution, lower=faster, higher=better quality, slower
                            mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
                            depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
                            minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
                            maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
                            depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
                            distortion={1} // Amount of distortion based on the distortionMap texture
                            reflectorOffset={0} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
                            color={"#231452"}
                        />
                    </mesh>

                    //Back Plane
                    <mesh receiveShadow position={[0, 0, -3]} >
                        <planeGeometry args={[30, 30]} />
                        <meshStandardMaterial color={"#231452"} />
                    </mesh>

                    <directionalLight

                        position={[2, 4, 2]}
                        intensity={4}

                    />

                    <pointLight intensity={1.5} position={[-1, 1, 1]} castShadow>

                    </pointLight>

                    <pointLight intensity={1.5} position={[1, 1, 1]} castShadow>

                    </pointLight>

                    <spotLight penumbra={.3} castShadow angle={Math.PI / 11} intensity={4} decay={1} position={[0, 2.5, 1]}>

                    </spotLight>

                    <mesh position={[0, 2.5, .75]}>
                        <sphereGeometry args={[0.1]} />
                        <meshBasicMaterial color="red" />
                    </mesh>



                    <mesh position={[-1, 1, 1]}>
                        <sphereGeometry args={[0.1]} />
                        <meshBasicMaterial color="yellow" />
                    </mesh>

                    <mesh position={[2, 5, 2]}>
                        <sphereGeometry args={[0.1]} />
                        <meshBasicMaterial color="yellow" />
                    </mesh>

                    {/* <MeshReflectorMaterial args={[10, 10]}
                            rotation={[-Math.PI / 2, 0, 0]}
                            mirror={0.7}
                            blur={[300, 100]}
                        >

                        </MeshReflectorMaterial> */}



                    <Suspense>

                        {/* We need to make sure that we rotate the item and not the camera when we click and drag */}
                        <ItemModel></ItemModel>

                    </Suspense>

                    <OrbitControls
                        enableRotate={false}
                        enablePan={false}
                        minDistance={1}
                        maxDistance={4}
                    />


                </Canvas>


            case "celebration":
                ""

            case "trail":
                ""



            default:
                return null;
        }
    };

    const InitialModalContent = () => {

        return (
            <>
                <h1 className='text-2xl'>Are you sure you want to Purchase?</h1>

                <h1 className='text-2xl'>{shopItem?.name}</h1>

                <div className='flex gap-4 mt-auto'>
                    <Button onClick={() => { BuyShopItem(shopItem.id) }} className='bg-green-400' size={"lg"}>Confirm Purchase</Button>
                    <Button className="bg-red-400" size={"lg"}>Cancel</Button>
                </div>


            </>
        )
    }


    function PurchaseButtonClicked() {


        //Confirm the user wants to purchase item


        SetModalContent(InitialModalContent);
        SetDialogBox(true);

    }



    const PurchaseSection = () => {

        switch (type) {
            case "item":

                return (
                    <div>
                        <h1 className='text-4xl font-bold'>{shopItem?.name}</h1>


                        <div className='flex h-15 gap-1 items-center mt-5'>
                            <img className='h-15' src="https://static.vecteezy.com/system/resources/previews/022/187/081/non_2x/3d-key-caps-or-keyboard-icon-rendering-free-png.png" alt="" />
                            <h2 className='text-3xl font-bold'>{shopItem?.priceKeys}</h2>
                        </div>

                        {/* 
                        <Button onClick={() => { SetDialogBox(true) }}>Open Dialog</Button> */}


                        {/* //If user clicks purchase button and they don't have enough keys show not enough keys modal and request
                        // server to send back updated key amount
                        //Open up a modal box to confirm purchase  */}

                        {
                            User


                                ?



                                (
                                    Inventory?.[shopItem.slot].some((item: any) => item.id === shopItem?.id) ?
                                        <Button size={"lg"} variant={"outline"} className='mt-20 w-full h-12 text-xl self-center' onClick={() => { }}>Item owned</Button>
                                        :
                                        User.Keys >= shopItem?.priceKeys ?
                                            <Button size={"lg"} className='mt-20 w-full h-12 text-xl self-center' onClick={() => { PurchaseButtonClicked() }}>Purchase</Button>
                                            : <Button size={"lg"} variant={"outline"} className='mt-20 w-full h-12 text-xl self-center' onClick={() => { }}>Not Enough Keys</Button>

                                )


                                :

                                // Show a toast or a modal when user clicks the purchase button when not logged in
                                <Button size={"lg"} className='mt-20 w-full h-12 text-xl self-center' onClick={() => { }}>Purchase</Button>
                        }





                    </div>
                );

            case "key":
                return (
                    <div>
                        <h1>keys section</h1>
                        <h1 className='text-4xl font-bold'>{shopItem?.name}</h1>


                        <div className='flex h-15 gap-1 items-center mt-5'>
                            <h2 className='text-3xl font-bold'>£{shopItem?.price}</h2>
                        </div>



                        <Button size={"lg"} className='mt-20 w-full h-12 text-xl self-center' onClick={() => { handleCheckout(shopItem.id) }}>Purchase</Button>

                        {/* <img src="/profile.jop" alt="" /> */}
                    </div>
                );
        }
    }


    const handleReset = () => {
        setResetKey(prev => prev + 1);
    };



    // function Model({ modelPath }: Props) {
    //     const fbx = useLoader(FBXLoader, modelPath);

    //     return <primitive object={fbx} scale={0.01} />;
    // }

    // useEffect(() => {

    //     const fbx = useLoader(FBXLoader, '/robot.fbx')
    //     SetModel(fbx);

    // }, [])


    return (
        <div className='flex mx-auto max-w-7xl bg-teal-900 '>

            {/* Item view */}
            <div className='bg-amber-300 flex-4 h-150'>

                {/* Conditonally render based on shopItemType */}

                {/* <img src="https://static.vecteezy.com/system/resources/thumbnails/035/576/135/small_2x/ai-generated-3d-rendering-of-a-beautiful-car-on-transparent-background-ai-generated-free-png.png" alt="" /> */}




                {
                    renderSlot()
                }



                {/* <Application autoStart sharedTicker background={"#1099bb"}> */}

                {/* {texture && <pixiSprite anchor={.5} x={400} y={300} texture={texture} />}  */}

                {/* <AnimatedSpriteAvatar/> */}

                {/* <pixiSprite
                        texture="https://pixijs.io/pixi-react/img/bunny.png"
                        x={400}
                        y={300}
                        anchor={{ x: 0.5, y: 0.5 }}
                    /> */}





                {/* </Application> */}
            </div>

            <div className='flex flex-col flex-3 p-10'>

                {
                    PurchaseSection()
                }

            </div>


            <Dialog open={showDialogBox} onOpenChange={SetDialogBox}>

                <DialogPortal>

                    {/* <DialogOverlay className="fixed inset-0 bg-white/50 p-10" /> */}




                    heey

                    {/* <DialogContent className='w-full max-w-sm sm:max-w-full  bg-orange-300 '> */}

                    //Make dialogcontent box is the right size
                    <DialogContent className='w-125 h-70 flex flex-col items-center pt-10 gap-10' >

                        {/* <h1 className='text-2xl'>Are you sure you want to Purchase?</h1>

                        <h1 className='text-2xl'>Item Name</h1> */}

                        {
                            modalContent
                        }




                        {/* <div className='flex gap-4 mt-auto'>
                            <Button onClick={() => { BuyShopItem(shopItem.id) }} className='bg-green-400' size={"lg"}>Confirm Purchase</Button>
                            <Button className="bg-red-400" size={"lg"}>Cancel</Button>
                        </div> */}




                    </DialogContent>



                </DialogPortal>

            </Dialog>
        </div>
    )
}

export default Product