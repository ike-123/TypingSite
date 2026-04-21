import { Button } from '@/components/ui/button'
import React, { Suspense, useEffect, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"

// import robotUrl from '../assets/robot.fbx';

const Product = () => {

    const [model, SetModel] = useState<any>();


    function Model({ modelPath }: Props) {
        const fbx = useLoader(FBXLoader, modelPath);

        return <primitive object={fbx} scale={0.01} />;
    }

    // useEffect(() => {

    //     const fbx = useLoader(FBXLoader, '/robot.fbx')
    //     SetModel(fbx);

    // }, [])
    
    return (
        <div className='flex mx-auto max-w-7xl bg-teal-900 '>

            {/* Item view */}
            <div className='bg-amber-300 flex-4 h-150'>

                {/* <img src="https://static.vecteezy.com/system/resources/thumbnails/035/576/135/small_2x/ai-generated-3d-rendering-of-a-beautiful-car-on-transparent-background-ai-generated-free-png.png" alt="" /> */}

                <Canvas>
                    <ambientLight intensity={1} />

                    <mesh>
                        <boxGeometry />
                        <meshStandardMaterial color={"orange"} />
                    </mesh>

                    <Suspense>
                        <primitive object={model} scale={0.01} />
                    </Suspense>
                </Canvas>
            </div>

            <div className='flex flex-col flex-3 p-10'>
                <h1 className='text-4xl font-bold'>Product Name</h1>


                <div className='flex h-15 gap-1 items-center mt-5'>
                    <img className='h-15' src="https://static.vecteezy.com/system/resources/previews/022/187/081/non_2x/3d-key-caps-or-keyboard-icon-rendering-free-png.png" alt="" />
                    <h2 className='text-3xl font-bold'>500</h2>
                </div>



                <Button size={"lg"} className='mt-20 w-full h-12 text-xl self-center'>Purchase</Button>

            </div>
        </div>
    )
}

export default Product