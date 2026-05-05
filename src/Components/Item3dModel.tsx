import { useFrame, useLoader, useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"


const ItemModel = () => {
  const characterRef = useRef<any>(null);
  const model = useLoader(FBXLoader, '/robot.fbx');

  const isDragging = useRef(false);
  const previousX = useRef(0);

  const { gl } = useThree();

  const drag = useRef({ active: false, lastX: 0, deltaX: 0 });

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e: any) => {
      drag.current.active = true;
      drag.current.lastX = e.clientX;
      drag.current.deltaX = 0;
    };

    const onPointerMove = (e: any) => {
      if (!drag.current.active) return;
      drag.current.deltaX = e.clientX - drag.current.lastX;
      drag.current.lastX = e.clientX;
    };

    const onPointerUp = () => {
      drag.current.active = false;
      drag.current.deltaX = 0;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
    };
  }, [gl]);


  useEffect(() => {
    model.traverse((child: any) => {
      if (child.isMesh) {

        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshStandardMaterial({ color: 'teal' });
      }
    });
  }, [model]);


  useFrame((_, delta) => {
    // if (characterRef.current) {
    //   // characterRef.current.rotation.y += .5 * delta;
    // }

    if (!characterRef.current) return;

    // Auto-rotation
    characterRef.current.rotation.y += 0.5 * delta;

    // Manual drag rotation — scale the sensitivity with a constant
    const DRAG_SENSITIVITY = 0.01;
    characterRef.current.rotation.y += drag.current.deltaX * DRAG_SENSITIVITY;

    // Reset delta each frame so it doesn't accumulate when not dragging
    drag.current.deltaX = 0;
  });

  return (
    <mesh castShadow>
      <primitive ref={characterRef} object={model} scale={0.01}

      />
    </mesh>
  );
}

export default ItemModel