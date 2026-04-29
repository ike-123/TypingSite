import { Button } from '@/components/ui/button'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as THREE from 'three';
import { OrbitControls } from "@react-three/drei";
import ItemModel from '@/Components/Item3dModel';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom"


import {
    Application,
    extend,
} from '@pixi/react';
import {
    Assets,
    Container,
    Graphics,
    Sprite,
    Texture,
} from 'pixi.js';
import AnimatedSpriteAvatar from '@/Components/AnimatedSpriteAvatar';

extend({
    Container,
    Graphics,
    Sprite,
});


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


    const { id } = useParams()

    const [shopItem, setShopItem] = useState<any>();

    const model = useLoader(FBXLoader, '/robot.fbx');

    const Modelref = useRef<any>(null);


    const [loading, setLoading] = useState(true)



    // const sprite = new Sprite({
    //     texture: Texture.from('https://pixijs.com/assets/bunny.png')
    // });


    const [texture, setTexture] = useState(null)


    useEffect(() => {

        async function loadAsset() {
            const texture = await Assets.load('/profile.jpeg');

            setTexture(texture);

            //  const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

        }

        loadAsset();

        async function getShopItem() {


            try {
                setLoading(true)

                console.log(id)
                const res = await axios.get("http://localhost:3001/api/singleShopItem", { params: { productId: id } });

                console.log(res?.data);
                setShopItem(res?.data);

            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false)
            }

        }

        if (passedItemFromShopPage) {
            console.log("passeditemfromshop")
            setShopItem(passedItemFromShopPage);
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

                <Canvas camera={{ position: [0, .5, 1.5], rotation: [0, 0, 0] }}>
                    <ambientLight intensity={1} />
                    <directionalLight position={[2, 2, 2]} />

                    {/* <mesh>
                        <planeGeometry rotateZ={90.} />
                        <meshStandardMaterial color={"orange"} />
                    </mesh> */}

                    <Suspense>

                        {/* We need to make sure that we rotate the item and not the camera when we click and drag */}
                        <ItemModel></ItemModel>

                    </Suspense>

                    <OrbitControls
                        minPolarAngle={Math.PI / 2}
                        maxPolarAngle={Math.PI / 2}
                        enablePan={false}
                        minDistance={1}
                        maxDistance={5}
                    />

                </Canvas>

                <Application  autoStart sharedTicker  background={"#1099bb"}>

                   {/* {texture && <pixiSprite anchor={.5} x={400} y={300} texture={texture} />}  */}

                   <AnimatedSpriteAvatar/>

                    {/* <pixiSprite
                        texture="https://pixijs.io/pixi-react/img/bunny.png"
                        x={400}
                        y={300}
                        anchor={{ x: 0.5, y: 0.5 }}
                    /> */}

                </Application>
            </div>

            <div className='flex flex-col flex-3 p-10'>
                <h1 className='text-4xl font-bold'>{shopItem?.name}</h1>


                <div className='flex h-15 gap-1 items-center mt-5'>
                    <img className='h-15' src="https://static.vecteezy.com/system/resources/previews/022/187/081/non_2x/3d-key-caps-or-keyboard-icon-rendering-free-png.png" alt="" />
                    <h2 className='text-3xl font-bold'>{shopItem?.priceKeys}</h2>
                </div>



                <Button size={"lg"} className='mt-20 w-full h-12 text-xl self-center'>Purchase</Button>

                {/* <img src="/profile.jop" alt="" /> */}

            </div>
        </div>
    )
}

export default Product