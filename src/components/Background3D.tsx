import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { useTheme } from '../context/ThemeContext'
import { landingStore, DARK, LIGHT } from '../lib/landingStore'
import { CameraRig, SceneLights } from './landing/three/SceneRig'
import MotorAssembly from './landing/three/MotorAssembly'
import ContainmentVessel from './landing/three/ContainmentVessel'
import ChromeRibbons from './landing/three/ChromeRibbons'

export default function Background3D() {
  const location = useLocation()
  const { theme } = useTheme()
  const isLanding = location.pathname === '/'

  useEffect(() => {
    if (isLanding) return
    gsap.set(landingStore.camera, { x: 0, y: 1.8, z: 15, tx: 0, ty: 1.4, tz: 0 })
    gsap.set(landingStore, { hero: 1, shatter: 0, vessel: 0, ribbons: 0, theme: theme === 'dark' ? 0 : 1 })
    gsap.to('#bgLayer', { backgroundColor: theme === 'dark' ? DARK : LIGHT, duration: 0.6, ease: 'power2.out' })
  }, [isLanding, theme])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div id="bgLayer" className="absolute inset-0" style={{ backgroundColor: DARK }} />
      <Canvas
        camera={{ position: [0, 1.8, 15], fov: 42, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor('#000000', 0)}
      >
        <CameraRig />
        <SceneLights />
        <MotorAssembly />
        <ContainmentVessel />
        <ChromeRibbons />
      </Canvas>
    </div>
  )
}