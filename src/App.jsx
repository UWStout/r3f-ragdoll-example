import React from 'react'

import { Canvas } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import { Physics, usePlane } from '@react-three/cannon'

import { Cursor, cursor as cursorRef } from './helpers/Drag.jsx'
import { Guy } from './components/Guy.jsx'
import { Mug, Chair, Table, Lamp } from './components/Furniture.jsx'

// Limit the number of objects spawned from clicks
const CLICK_LIMIT = 30

export default function App() {
  // Track all the points clicked in the scene
  const [pointClickList, setPointClickList] = React.useState([[8, 3, 0]])
  const addPoint = () => {
    // Set a limit
    if (pointClickList.length >= CLICK_LIMIT) {
      return
    }

    // Create new point-click list and add new point to it
    const pos = cursorRef.current.position
    const newList = [...pointClickList, [pos.x, pos.y, 0]]

    // Update click list
    setPointClickList(newList)
  }

  // Listen for key presses
  const keyPressed = React.useCallback((e) => {
    if (e.key === "c") {
      // Clear the list of clicks back to default
      setPointClickList([[8, 3, 0]])
    }
  }, [])

  // Bind our key press listener
  React.useEffect(() => {
    document.addEventListener('keypress', keyPressed)
    return () => document.removeEventListener('keypress', keyPressed)
  }, [])

  return (
    <Canvas dpr={[1, 2]} shadows onPointerMissed={addPoint} camera={{ position: [-40, 40, 40], fov: 25, near: 1, far: 100 }}>
      <color attach="background" args={['#171720']} />
      <fog attach="fog" args={['#171720', 60, 90]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[-20, -5, -20]} color="red" />
      <Physics allowSleep={false} iterations={15} gravity={[0, -200, 0]}>
        <Cursor />
        <Guy rotation={[-Math.PI / 3, 0, 0]} />
        <Floor position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
        <Chair position={[0, 0, -2.52]} />
        <Table position={[8, 0, 0]} />
        {pointClickList.map((mugPos, i) => <Mug key={i} position={mugPos} />)}
        <Lamp position={[0, 15, 0]} />
      </Physics>
    </Canvas>
  )
}

function Floor(props) {
  const [ref] = usePlane(() => ({ type: 'Static', ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        color="#878790"
        blur={[400, 400]}
        resolution={1024}
        mixBlur={1}
        mixStrength={3}
        depthScale={1}
        minDepthThreshold={0.85}
        metalness={0}
        roughness={1}
      />
    </mesh>
  )
}
