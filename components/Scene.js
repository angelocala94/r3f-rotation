import { useEffect, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import Planet from './Planet'
import Character from './Character'
import { Physics, Debug } from '@react-three/cannon'

export default function Scene() {
  // Map keys with action
  const keys = {
    KeyW: 'forward',
    KeyS: 'backward',
    KeyA: 'left',
    KeyD: 'right',
    Space: 'jump',
  }
  const moveFieldByKey = (key) => keys[key]

  // Movement state
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  })

  // Update movement state
  useEffect(() => {
    const handleKeyDown = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }))
    const handleKeyUp = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }))
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
