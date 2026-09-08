import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { landingStore } from '../../../lib/landingStore'

const smoothI = (t: number, a: number, b: number) => a + (b - a) * t

// Photographic daylight environment (studio strips) via PMREM — enables the
// crisp reflections on the chrome ribbons without any external HDR fetch.
export function SceneEnvironment() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const rt = pmrem.fromScene(new RoomEnvironment(), 0.04)
    scene.environment = rt.texture
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.15
    return () => {
      rt.dispose()
      pmrem.dispose()
      scene.environment = null
    }
  }, [gl, scene])
  return null
}

// Camera follows scroll-scrubbed waypoints (LANDINGSTORE.camera) with damped motion.
export function CameraRig({ damping = 2.6 }: { damping?: number }) {
  const { camera } = useThree()
  const goal = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  useFrame((_, dt) => {
    const c = landingStore.camera
    goal.set(c.x, c.y, c.z)
    look.set(c.tx, c.ty, c.tz)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, goal.x, damping, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, goal.y, damping, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, goal.z, damping, dt)
    camera.lookAt(look)
  })
  return null
}

// Crossfading studio rig: dark navy mood ⇄ bright daylight UI.
export function SceneLights() {
  const hemi = useRef<THREE.HemisphereLight>(null!)
  const key = useRef<THREE.DirectionalLight>(null!)
  const fill = useRef<THREE.DirectionalLight>(null!)
  const rim = useRef<THREE.PointLight>(null!)
  const darkAccent = useRef<THREE.PointLight>(null!)

  useFrame(() => {
    const t = landingStore.theme
    if (!hemi.current || !key.current || !fill.current || !rim.current || !darkAccent.current) return
    hemi.current.intensity = smoothI(t, 0.35, 1.05)
    key.current.intensity = smoothI(t, 0.7, 2.0)
    fill.current.intensity = smoothI(t, 0.25, 0.75)
    rim.current.intensity = smoothI(t, 0.9, 0.15)
    rim.current.color.set(t > 0.5 ? '#ffffff' : '#38bdf8')
    darkAccent.current.intensity = smoothI(t, 1.2, 0)
  })

  return (
    <>
      <hemisphereLight ref={hemi} args={['#ffffff', '#0f172a', 1]} />
      <directionalLight ref={key} position={[4, 7, 6]} intensity={1.4} />
      <directionalLight ref={fill} position={[-4, 2, -3]} intensity={0.5} />
      <pointLight ref={rim} position={[-5, -1, 4]} intensity={0.9} color="#38bdf8" />
      <pointLight ref={darkAccent} position={[5, -2, -4]} intensity={1.2} color="#a855f7" distance={18} />
      <ambientLight intensity={0.25} />
      <SceneEnvironment />
    </>
  )
}