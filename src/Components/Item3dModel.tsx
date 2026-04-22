import { useFrame, useLoader } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"


const ItemModel = () => {
  const ref = useRef<any>(null);
  const model = useLoader(FBXLoader, '/robot.fbx');


  useEffect(() => {
    model.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ color: 'teal' });
      }
    });
  }, [model]);


  useFrame((_,delta) => {
    if (ref.current) {
      ref.current.rotation.y += .5 * delta;
    }
  });

  return (
    <mesh ref={ref}>
      <primitive ref={ref} object={model} scale={0.01} />
    </mesh>
  );
}

export default ItemModel