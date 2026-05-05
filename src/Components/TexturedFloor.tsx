import { MeshReflectorMaterial, useTexture } from '@react-three/drei'
import React from 'react'
import { RepeatWrapping } from 'three';

const TexturedFloor = () => {

    const texture = useTexture("https://png.pngtree.com/background/20250104/original/pngtree-texture-of-vibrant-purple-wallpaper-picture-image_15297775.jpg");

    // texture.wrapS = texture.wrapT = RepeatWrapping;
    // texture.repeat.set(8, 8);
    return (
        <>

            <MeshReflectorMaterial
                map={texture}
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
        </>
    )
}

export default TexturedFloor