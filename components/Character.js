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
  const [quaternion, setQuaternion] = useState()

  // Character physics
  const [, api] = useSphere(
    () => ({
      mass: 10,
      ...props,
      args: [0.55],
      position: [0, 3.5, 0],
    }),
    group,
  )

  // Subscribe to character position
  api.position.subscribe((p) => setPosition(p))

  // Set initial rotation
  useEffect(() => {
    const q = new THREE.Quaternion()
    const angle = Math.PI / 2
    const axis = new THREE.Vector3(1, 0, 0).normalize()
    q.setFromAxisAngle(axis, angle)
    api.quaternion.copy(q)
    setQuaternion(q)
  }, [])

  // Start character animations
  useEffect(() => {
    if (movement.forward || movement.backward) {
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

    // Apply planet gravity to character
    api.applyForce(
      object.position.normalize().multiplyScalar(-1000).toArray(),
      [0, 0, 0],
    )

    if (movement.forward) {
      // Move character forward
      api.applyLocalImpulse([0, 0.2, 0], [0, 0, 0])
    } else if (movement.backward) {
      // Move character backward
      api.applyLocalImpulse([0, -0.2, 0], [0, 0, 0])
    } else {
      // Stop character
      api.velocity.set(0, 0, 0)
    }

    if (movement.left) {
      // Rotate character left
      const rotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        THREE.MathUtils.degToRad(2),
      )

      rotation.multiplyQuaternions(rotation, quaternion)

      api.quaternion.copy(rotation)
      setQuaternion(rotation)
    }

    if (movement.right) {
      // Rotate character right
      const rotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        THREE.MathUtils.degToRad(-2),
      )

      rotation.multiplyQuaternions(rotation, quaternion)

      api.quaternion.copy(rotation)
      setQuaternion(rotation)
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
