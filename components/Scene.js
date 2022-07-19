import { useEffect, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import Planet from './Planet'
import Character from './Character'
import { Physics, Debug } from '@react-three/cannon'

export default function Scene() {
  const [movement, setMovement] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e) => setMovement((m) => e.code === 'KeyW')
    const handleKeyUp = (e) => setMovement((m) => false)

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[15, 15, 15]} />
      <Physics gravity={[0, 0, 0]}>
        <Debug color="green" scale={1}>
          <Planet />
          <Character movement={movement} />
        </Debug>
      </Physics>
      <OrbitControls />
    </>
  )
}
