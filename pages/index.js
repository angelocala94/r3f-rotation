import { Canvas } from '@react-three/fiber'
import Scene from '../components/Scene'

export default function Home() {
  return (
    <div
      style={{
        background: '#000',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  )
}
