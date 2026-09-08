import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { landingStore, clamp01, smooth01 } from '../../../lib/landingStore'

const PING = 0.001

// Vertical glass containment vessel: holographic sensor mode ⇄ CAD
// wireframe mode, swapped as the left-hand feature list changes.
export default function ContainmentVessel() {
  const group = useRef<THREE.Group>(null!)
  const halo = useRef<THREE.Points>(null!)
  const sensorMat = useRef<THREE.PointsMaterial>(null!)
  const wireRefs = useRef<THREE.LineSegments[]>([])
  const wireMats = useRef<THREE.Material[]>([])
  const glowMats = useRef<THREE.MeshStandardMaterial[]>([])

  useFrame((state, dt) => {
    const t = Math.min(dt, 0.05)
    const time = state.clock.elapsedTime
    const v = landingStore.vessel
    const activeIdx = Math.min(3, Math.floor(v * 4))

    const show = v > 0.02
    if (!group.current) return
    group.current.visible = show
    if (!show) return

    const reveal = smooth01(v * 1.25)
    group.current.scale.setScalar(0.72 + 0.28 * reveal)
    group.current.rotation.y += t * 0.24
    group.current.position.y = PING

    // crossfade sensor hologram ⇄ CAD wireframe by feature parity
    const sensorT = activeIdx % 2 === 0 ? 1 : 0
    const cadT = 1 - sensorT
    const smoothSensor = clamp01(sensorT)
    const smoothCad = clamp01(cadT)

    if (sensorMat.current) {
      sensorMat.current.opacity = 0.85 * smoothSensor * reveal
      sensorMat.current.size = 0.05 + 0.02 * (1 + Math.sin(time * 2))
    }
    if (halo.current) {
      halo.current.rotation.y += t * 0.6
      halo.current.rotation.x += t * 0.25
    }
    for (let i = 0; i < wireRefs.current.length; i++) {
      const w = wireRefs.current[i]
      if (!w) continue
      w.rotation.y += t * (0.3 + i * 0.12)
      const m = wireMats.current[i]
      if ((m as THREE.LineBasicMaterial).opacity !== undefined) {
        ;(m as THREE.LineBasicMaterial).opacity = 0.85 * smoothCad * reveal
      }
    }
    for (const g of glowMats.current) {
      if (!g) continue
      g.emissiveIntensity = 0.5 + 1.3 * smoothSensor * reveal + 0.25 * Math.sin(time * 3)
    }
  })

  const sensorGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const verts: number[] = []
    for (let i = 0; i < 220; i++) {
      const r = 0.32 + Math.random() * 0.42
      const th = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      verts.push(Math.sin(phi) * Math.cos(th) * r, Math.sin(phi) * Math.sin(th) * r, Math.cos(phi) * r)
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    return g
  }, [])

  const wireGeo = useMemo(() => {
    const ic = new THREE.IcosahedronGeometry(0.55, 1)
    const edges = new THREE.EdgesGeometry(ic)
    ic.dispose()
    return edges
  }, [])

  const wireGeo2 = useMemo(() => {
    const b = new THREE.BoxGeometry(0.8, 0.8, 0.8)
    const edges = new THREE.EdgesGeometry(b)
    b.dispose()
    return edges
  }, [])

  return (
    <group ref={group} position={[2.1, 0, 0]} visible={false}>
      {/* glass tube */}
      <mesh>
        <cylinderGeometry args={[1.1, 1.1, 4.6, 48, 1, true]} />
        <meshPhysicalMaterial
          color="#bae6fd"
          metalness={0}
          roughness={0.08}
          transmission={0.85}
          thickness={1.2}
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* tube caps */}
      <mesh position={[0, 2.35, 0]}>
        <torusGeometry args={[1.1, 0.08, 12, 36]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, -2.35, 0]}>
        <torusGeometry args={[1.1, 0.08, 12, 36]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* ── holographic sensor mode ── */}
      <points ref={halo} geometry={sensorGeo} frustumCulled={false}>
        <pointsMaterial ref={sensorMat} color="#67e8f9" size={0.06} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      <mesh>
        <icosahedronGeometry args={[0.34, 1]} />
        <meshStandardMaterial ref={(m) => { if (m && !glowMats.current.includes(m)) glowMats.current.push(m) }} color="#0e7490" emissive="#22d3ee" emissiveIntensity={1} metalness={0.2} roughness={0.3} />
      </mesh>

      {/* ── CAD wireframe mode ── */}
      <lineSegments
        ref={(l) => { if (l && !wireRefs.current.includes(l)) wireRefs.current.push(l) }}
        geometry={wireGeo}
      >
        <lineBasicMaterial ref={(m) => { if (m && !wireMats.current.includes(m)) wireMats.current.push(m) }} color="#93c5fd" transparent opacity={0} />
      </lineSegments>
      <lineSegments
        ref={(l) => { if (l && !wireRefs.current.includes(l)) wireRefs.current.push(l) }}
        geometry={wireGeo2}
        position={[0, 0.1, 0]}
      >
        <lineBasicMaterial ref={(m) => { if (m && !wireMats.current.includes(m)) wireMats.current.push(m) }} color="#e2e8f0" transparent opacity={0} />
      </lineSegments>

      {/* studio drama lights inside the vessel */}
      <pointLight color="#22d3ee" intensity={2.2} distance={6} position={[0, 0, 1.2]} />
      <pointLight color="#a855f7" intensity={1.4} distance={6} position={[0.8, -1.6, -0.6]} />
    </group>
  )
}