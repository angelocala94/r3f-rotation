import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import * as THREE from 'three'

export default function Model({ movement, ...props }) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/charcter.glb')
  const { actions } = useAnimations(animations, group)
  const [position, setPosition] = useState([0, 3.5, 0])

  const [, api] = useSphere(
    () => ({
      mass: 10,
      ...props,
      args: [0.55],
      position: [0, 3.5, 0],
      rotation: [Math.PI / 2, 0, 0],
    }),
    group,
  )

  api.position.subscribe((p) => setPosition(p))

  useEffect(() => {
    if (movement) {
      actions.Idle.stop()
      actions.Walk.play()
    } else {
      actions.Walk.stop()
      actions.Idle.play()
    }
  }, [movement])

  const object = new THREE.Object3D()

  useFrame(() => {
    object.position.set(position[0], position[1], position[2])

    api.applyForce(object.position.normalize().multiplyScalar(-100).toArray(), [
      0,
      0,
      0,
    ])

    if (movement) {
      api.applyLocalImpulse([0, 0.2, 0], [0, 0, 0])
    } else {
      api.velocity.set(0, 0, 0)
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" scale={0.005}>
          <primitive object={nodes.Hips} />
          <skinnedMesh
            name="Boy01_Body_Geo"
            geometry={nodes.Boy01_Body_Geo.geometry}
            material={materials.Boy01_Body_MAT}
            skeleton={nodes.Boy01_Body_Geo.skeleton}
          />
          <skinnedMesh
            name="Boy01_Brows_Geo"
            geometry={nodes.Boy01_Brows_Geo.geometry}
            material={materials.Boy01_Brows_MAT1}
            skeleton={nodes.Boy01_Brows_Geo.skeleton}
          />
          <skinnedMesh
            name="Boy01_Eyes_Geo"
            geometry={nodes.Boy01_Eyes_Geo.geometry}
            material={materials.Boy01_Eyes_MAT1}
            skeleton={nodes.Boy01_Eyes_Geo.skeleton}
          />
          <skinnedMesh
            name="h_Geo"
            geometry={nodes.h_Geo.geometry}
            material={materials.Boy01_Mouth_MAT1}
            skeleton={nodes.h_Geo.skeleton}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/charcter.glb')
