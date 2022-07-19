import { useNormalTexture } from '@react-three/drei'
import { useSphere } from '@react-three/cannon'

export default function Planet({ ...props }) {
  const [normalMap, url] = useNormalTexture(0, {
    offset: [0, 0],
    repeat: [1, 1],
    anisotropy: 8,
  })

  const [ref, api] = useSphere(() => ({
    mass: 0,
    ...props,
    args: [2],
  }))

  return (
    <mesh ref={ref}>
      <sphereBufferGeometry args={[2]} />
      <meshStandardMaterial color={'#f39c12'} normalMap={normalMap} />
    </mesh>
  )
}
