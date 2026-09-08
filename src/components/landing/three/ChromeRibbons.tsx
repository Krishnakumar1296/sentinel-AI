import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { landingStore, smooth01 } from '../../../lib/landingStore'

// High-gloss liquid-metal chrome ribbons undulating in bright daylight.
export default function ChromeRibbons() {
  const group = useRef<THREE.Group>(null!)
  const meshes = useRef<THREE.Mesh[]>([])
  const materials = useRef<THREE.MeshStandardMaterial[]>([])
  const base = useRef<Float32Array[]>([])
  const speeds = useMemo(() => [0.9, 0.65, 0.8, 1.1], [])

  useFrame((state) => {
    const t = Math.min(state.clock.getDelta(), 0.05)
    const time = state.clock.elapsedTime
    const r = landingStore.ribbons
    const show = r > 0.02
    if (!group.current) return
    group.current.visible = show
    if (!show) return

    const reveal = smooth01(r * 1.3)
    group.current.scale.setScalar(0.7 + 0.3 * reveal)
    group.current.rotation.y += t * 0.18

    meshes.current.forEach((mesh, idx) => {
      if (!mesh) return
      const geo = mesh.geometry as THREE.PlaneGeometry
      const posAttr = geo.attributes.position as THREE.BufferAttribute
      const arr = posAttr.array as Float32Array
      const baseArr = base.current[idx]
      const sp = speeds[idx]
      for (let i = 0; i < arr.length / 3; i++) {
        const bx = baseArr[i * 3]
        const by = baseArr[i * 3 + 1]
        const bz = baseArr[i * 3 + 2]
        const u = bx / geo.parameters.width
        const v = (by + 3.5) / 7
        const w =
          Math.sin(v * 6.2 - time * sp) * 0.28 +
          Math.sin(v * 2.3 - time * sp * 0.5 + idx) * 0.4 +
          Math.sin(v * 11 - time * sp * 1.6) * 0.08 +
          Math.sin(u * 4.1 + v * 3.3 + time * sp * 0.7) * 0.12
        arr[i * 3] = bx + Math.sin(v * 4.7 + time * sp * 0.36) * 0.18
        arr[i * 3 + 1] = by
        arr[i * 3 + 2] = bz + w
      }
      posAttr.needsUpdate = true
      geo.computeVertexNormals()
      const mat = materials.current[idx]
      if (mat) {
        mat.opacity = 0.92 * reveal
        mat.emissiveIntensity = 0.05 * reveal
      }
    })
  })

  const ribbonGeos = useMemo(() => {
    return [0, 1, 2, 3].map((i) => {
      const w = 0.42 + i * 0.06
      const geo = new THREE.PlaneGeometry(w, 7, 1, 100)
      const posAttr = geo.attributes.position as THREE.BufferAttribute
      const b = (posAttr.array as Float32Array).slice()
      base.current.push(new Float32Array(b))
      return geo
    })
  }, [])

  return (
    <group ref={group} position={[2.4, 0, 0]} visible={false}>
      {ribbonGeos.map((geo, i) => (
        <mesh
          key={i}
          ref={(m) => { if (m && !meshes.current.includes(m)) meshes.current.push(m) }}
          geometry={geo}
          position={[(i - 1.5) * 0.55, 0, (i - 1.5) * 0.2]}
          rotation={[0.12 * (i % 2 === 0 ? 1 : -1), i * 0.16 - 0.35, 0]}
        >
          <meshStandardMaterial ref={(m) => { if (m && !materials.current.includes(m)) materials.current.push(m) }} color="#ffffff" transparent opacity={0} metalness={1} roughness={0.06} envMapIntensity={1.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}