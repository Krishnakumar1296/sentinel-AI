import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { landingStore, smooth01 } from '../../../lib/landingStore'

interface Part {
  mesh: THREE.Mesh
  home: THREE.Vector3
  homeRot: THREE.Euler
  scatter: THREE.Vector3
  explode: THREE.Vector3
  delay: number
}

// Deep-blue nanotech hero: particles lock together on load, then the whole
// machine shatters into dispersing fragments at ~50% hero scroll.
export default function MotorAssembly() {
  const group = useRef<THREE.Group>(null!)
  const points = useRef<THREE.Points>(null!)
  const partsRef = useRef<Part[]>([])

  const N = useMemo(() => 2400, [])
  const arrays = useMemo(() => {
    const targets = new Float32Array(N * 3)
    const scatter = new Float32Array(N * 3)
    const dirs = new Float32Array(N * 3)
    const delays = new Float32Array(N)
    const phases = new Float32Array(N)

    // Sample the motor silhouette (layers of cylinders, rings, tip sphere).
    const samples: [number, number, number][] = []
    for (let i = 0; i < N; i++) {
      const rnd = () => Math.random()
      const ax = rnd() * 2.4 - 1.2
      const a = rnd() * Math.PI * 2
      const kind = rnd()
      if (kind < 0.55) {
        // stator cylinder shell
        const r = 1.2 + rnd() * 0.28
        samples.push([ax, Math.sin(a) * r, Math.cos(a) * r])
      } else if (kind < 0.8) {
        // outer cooling ring torus
        const r = 1.85
        samples.push([Math.sin(a) * r * 0.35, Math.sin(a + 1) * r * 0.28, Math.cos(a) * r])
      } else {
        // rotor core sphere-ish center
        const r = 0.5 * Math.cbrt(rnd())
        const th = rnd() * Math.PI * 2
        const phi = Math.acos(2 * rnd() - 1)
        samples.push([ax * 0.3 + Math.sin(phi) * Math.cos(th) * r, Math.sin(phi) * Math.sin(th) * r, Math.cos(phi) * r])
      }
    }
    for (let i = 0; i < N; i++) {
      const [x, y, z] = samples[i]
      targets[i * 3] = x
      targets[i * 3 + 1] = y
      targets[i * 3 + 2] = z
      const r = 4.2 + Math.random() * 3.4
      const th = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      scatter[i * 3] = Math.sin(phi) * Math.cos(th) * r
      scatter[i * 3 + 1] = Math.abs(Math.sin(phi) * Math.sin(th)) * r - 0.4
      scatter[i * 3 + 2] = Math.cos(phi) * r
      const d = new THREE.Vector3(x, y, z).normalize()
      dirs[i * 3] = d.x
      dirs[i * 3 + 1] = d.y
      dirs[i * 3 + 2] = d.z
      delays[i] = Math.pow(Math.random(), 0.7) * 0.9
      phases[i] = Math.random() * Math.PI * 2
    }
    return { targets, scatter, dirs, delays, phases }
  }, [N])

  const mat = useMemo(() => new THREE.PointsMaterial({ size: 0.06, color: 0x7dd3fc, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }), [])

  // Build the motor out of individual parts so they can fly apart.
  const buildParts = useMemo(() => {
    const parts: Part[] = []
    const body = new THREE.MeshStandardMaterial({ color: 0xd7dde6, metalness: 0.75, roughness: 0.3 })
    const steel = new THREE.MeshStandardMaterial({ color: 0x9aa7b8, metalness: 0.9, roughness: 0.25 })
    const accent = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.4, roughness: 0.35, emissive: 0x0891b2, emissiveIntensity: 0.45 })

    const addPart = (mesh: THREE.Mesh, p: Partial<Part> = {}) => {
      parts.push({
        mesh,
        home: mesh.position.clone(),
        homeRot: mesh.rotation.clone(),
        scatter: p.scatter ?? new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, 6 + Math.random() * 4),
        explode: p.explode ?? new THREE.Vector3((Math.random() - 0.5) * 6, 1 + Math.random() * 5, (Math.random() - 0.5) * 6),
        delay: p.delay ?? Math.random(),
      })
      return mesh
    }

    const stator = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 1.5, 40), body)
    stator.rotation.z = Math.PI / 2
    addPart(stator, { delay: 0.15 })

    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.55, 36), steel)
    tail.rotation.z = Math.PI / 2
    tail.position.x = 1.02
    addPart(tail, { delay: 0.35 })

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 3.1, 20), steel)
    shaft.rotation.z = Math.PI / 2
    addPart(shaft, { delay: 0.45 })

    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.3 + i * 0.22, 0.05, 10, 40), accent)
      ring.rotation.x = Math.PI / 2
      ring.position.x = -0.85 + i * 0.85
      addPart(ring, { delay: 0.5 + i * 0.12 })
    }

    for (let i = 0; i < 8; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.14), steel)
      fin.rotation.z = Math.PI / 2
      const a = (i / 8) * Math.PI * 2
      fin.position.set(-0.75, Math.sin(a) * 1.28, Math.cos(a) * 1.28)
      fin.rotation.x = a
      addPart(fin, { delay: 0.55 + i * 0.05 })
    }

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32), body)
    cap.rotation.z = Math.PI / 2
    cap.position.x = -0.82
    addPart(cap, { delay: 0.4 })

    const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.14, 1.5), body)
    base.position.y = -1.42
    addPart(base, { delay: 0.3 })

    return parts
  }, [])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3))
    return g
  }, [N])

  useFrame((_, dt) => {
    if (!points.current || !group.current) return
    const t = Math.min(dt, 0.05)
    const time = performance.now() / 1000
    const { hero, shatter } = landingStore

    // ── particles ────────────────────────────────────────────
    const pos = points.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    for (let i = 0; i < N; i++) {
      const a = smooth01((hero - arrays.delays[i]) / 0.5)
      const d = smooth01((shatter - arrays.delays[i] * 0.8) / 0.45)
      const s3 = i * 3
      const bx = arrays.scatter[s3] + (arrays.targets[s3] - arrays.scatter[s3]) * a
      const by = arrays.scatter[s3 + 1] + (arrays.targets[s3 + 1] - arrays.scatter[s3 + 1]) * a
      const bz = arrays.scatter[s3 + 2] + (arrays.targets[s3 + 2] - arrays.scatter[s3 + 2]) * a
      const wob = 0.02 * Math.sin(time * 2 + arrays.phases[i])
      const e = d * d
      arr[s3] = bx + arrays.dirs[s3] * e * 3.6 + wob
      arr[s3 + 1] = by + arrays.dirs[s3 + 1] * e * 3.6 + wob
      arr[s3 + 2] = bz + arrays.dirs[s3 + 2] * e * 3.6 + wob
    }
    pos.needsUpdate = true
    points.current.visible = hero - shatter > -0.02
    mat.opacity = 0.95 * Math.max(0, Math.min(1, (hero - shatter + 0.15) * 1.6))
    mat.size = 0.055 + 0.03 * (1 - hero)

    // ── motor parts ──────────────────────────────────────────
    group.current.visible = (hero > 0.2 && shatter < 0.5) || shatter < 0.2
    group.current.rotation.y += t * 0.2 * (1 - shatter)
    for (const p of partsRef.current) {
      const a = smooth01((hero - p.delay) / 0.5)
      const d = smooth01((shatter - p.delay) / 0.4)
      const pop = Math.max(0.001, Math.min(1, a * 4))
      const scale = pop * Math.max(0.05, 1 - d)
      p.mesh.scale.setScalar(scale)
      p.mesh.position.lerpVectors(p.scatter, p.home, a)
      p.mesh.position.addScaledVector(p.explode, d)
      p.mesh.rotation.set(p.homeRot.x + (1 - a) * 1.4, p.homeRot.y + d * 1.2, p.homeRot.z + d * 0.8)
      p.mesh.visible = a > 0.02 && d < 0.98
    }
  })

  return (
    <>
      <points ref={points} geometry={geo} material={mat} visible={false} frustumCulled={false} />
      <group ref={group} visible={false}>
        {buildParts.map((p, i) => (
          <primitive key={i} object={p.mesh} />
        ))}
      </group>
    </>
  )
}