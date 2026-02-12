import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { AdaptiveDpr, Html, Line, OrbitControls, PerformanceMonitor, Sparkles, Stars } from '@react-three/drei'
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { easing } from 'maath'
import { BlendFunction } from 'postprocessing'
import {
  AdditiveBlending,
  BackSide,
  Color,
  DoubleSide,
  MathUtils,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  type Group,
  type Mesh,
  type Texture,
} from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import {
  BODY_MAP,
  computeBodyPositions,
  PLANETARY_ORBITS,
  SOLAR_BODIES,
  type BodyId,
  type RingDefinition,
  type SolarBodyDefinition,
} from '../data/solarBodies'

export interface SceneSettings {
  isPlaying: boolean
  speed: number
  showOrbits: boolean
  showLabels: boolean
  followSelection: boolean
  cinematicCamera: boolean
}

interface SolarSceneProps {
  settings: SceneSettings
  selectedBodyId: BodyId
  onSelectBody: (id: BodyId) => void
}

interface PlanetNodeProps {
  body: SolarBodyDefinition
  isSelected: boolean
  showLabel: boolean
  onSelect: (id: BodyId) => void
  setGroupRef: (group: Group | null) => void
  setMeshRef: (mesh: Mesh | null) => void
}

interface CameraRigProps {
  controlsRef: MutableRefObject<OrbitControlsImpl | null>
  selectedBodyId: BodyId
  followSelection: boolean
  cinematicCamera: boolean
  positionsRef: MutableRefObject<Record<BodyId, Vector3>>
  isUserInteractingRef: MutableRefObject<boolean>
  resumeAutoAtRef: MutableRefObject<number>
  manualCameraOverrideRef: MutableRefObject<boolean>
}

function useSafeTexture(url: string, repeat = false) {
  const [texture, setTexture] = useState<Texture | null>(null)

  useEffect(() => {
    let isMounted = true
    const loader = new TextureLoader()

    loader.load(
      url,
      (loadedTexture) => {
        if (!isMounted) {
          return
        }

        loadedTexture.colorSpace = SRGBColorSpace

        if (repeat) {
          loadedTexture.wrapS = RepeatWrapping
          loadedTexture.wrapT = RepeatWrapping
        }

        setTexture(loadedTexture)
      },
      undefined,
      () => {
        if (!isMounted) {
          return
        }

        setTexture(null)
      },
    )

    return () => {
      isMounted = false
    }
  }, [repeat, url])

  return texture
}

function OrbitPath({ radius, color }: { radius: number; color: string }) {
  const points = useMemo(() => {
    const segments = 220
    const orbitCurve: [number, number, number][] = []

    for (let index = 0; index <= segments; index += 1) {
      const angle = (index / segments) * Math.PI * 2
      orbitCurve.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius])
    }

    return orbitCurve
  }, [radius])

  return <Line points={points} color={color} lineWidth={0.6} transparent opacity={0.34} />
}

function PlanetRing({ ring }: { ring: RingDefinition }) {
  const ringMap = useSafeTexture(ring.textureUrl, true)

  const ringTilt = MathUtils.degToRad(ring.tilt)

  return (
    <mesh rotation={[Math.PI / 2 + ringTilt, 0, 0]}>
      <ringGeometry args={[ring.innerRadius, ring.outerRadius, 128]} />
      <meshStandardMaterial
        map={ringMap ?? undefined}
        color={ring.color}
        side={DoubleSide}
        transparent
        opacity={ring.opacity}
        roughness={0.88}
        metalness={0.05}
        alphaTest={0.08}
        depthWrite={false}
      />
    </mesh>
  )
}

function PlanetNode({
  body,
  isSelected,
  showLabel,
  onSelect,
  setGroupRef,
  setMeshRef,
}: PlanetNodeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const surfaceMap = useSafeTexture(body.textureUrl)

  useEffect(() => {
    if (!isHovered) {
      return
    }

    document.body.style.cursor = 'pointer'

    return () => {
      document.body.style.cursor = 'default'
    }
  }, [isHovered])

  const handleSelect = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelect(body.id)
  }

  return (
    <group ref={setGroupRef}>
      <mesh
        ref={setMeshRef}
        onClick={handleSelect}
        onPointerOver={(event) => {
          event.stopPropagation()
          setIsHovered(true)
        }}
        onPointerOut={() => setIsHovered(false)}
        castShadow={body.kind !== 'star'}
        receiveShadow={body.kind !== 'star'}
      >
        <sphereGeometry args={[body.radius, 64, 64]} />
        <meshStandardMaterial
          map={surfaceMap ?? undefined}
          color={body.surfaceColor}
          emissive={body.emissiveColor ?? '#000000'}
          emissiveIntensity={body.kind === 'star' ? 2.8 : 0.2}
          roughness={body.kind === 'star' ? 0.62 : 0.92}
          metalness={body.kind === 'star' ? 0.12 : 0.04}
          toneMapped={body.kind !== 'star'}
        />
      </mesh>

      {body.atmosphereColor ? (
        <mesh scale={1.12}>
          <sphereGeometry args={[body.radius, 42, 42]} />
          <meshBasicMaterial
            color={body.atmosphereColor}
            transparent
            opacity={0.22}
            side={BackSide}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ) : null}

      {body.kind === 'star' ? (
        <>
          <mesh scale={1.18}>
            <sphereGeometry args={[body.radius, 42, 42]} />
            <meshBasicMaterial
              color="#ffc87a"
              transparent
              opacity={0.24}
              blending={AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          <mesh scale={1.38}>
            <sphereGeometry args={[body.radius, 36, 36]} />
            <meshBasicMaterial
              color="#ff8f3a"
              transparent
              opacity={0.12}
              blending={AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </>
      ) : null}

      {isSelected ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[body.radius * 1.32, body.radius * 1.45, 72]} />
          <meshBasicMaterial
            color="#ffe1ab"
            transparent
            opacity={0.55}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ) : null}

      {body.ring ? <PlanetRing ring={body.ring} /> : null}

      {showLabel ? (
        <Html position={[0, body.radius + 1.15, 0]} center distanceFactor={16}>
          <div className={`planet-label${isSelected ? ' selected' : ''}`}>{body.name}</div>
        </Html>
      ) : null}
    </group>
  )
}

function DeepSpaceBackdrop() {
  return (
    <group>
      <mesh scale={240}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#01030a" side={BackSide} />
      </mesh>

      <mesh position={[-64, 18, -118]} rotation={[0.18, 0.42, 0]} scale={[1.7, 0.8, 1.25]}>
        <sphereGeometry args={[30, 40, 40]} />
        <meshBasicMaterial
          color="#2f558f"
          transparent
          opacity={0.1}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[66, -6, -112]} rotation={[-0.14, -0.36, 0]} scale={[1.55, 0.75, 1.2]}>
        <sphereGeometry args={[28, 40, 40]} />
        <meshBasicMaterial
          color="#a94d22"
          transparent
          opacity={0.085}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return value - Math.floor(value)
}

function AsteroidBelt({
  isPlaying,
  speed,
}: {
  isPlaying: boolean
  speed: number
}) {
  const beltRef = useRef<Group | null>(null)
  const [positions, colors] = useMemo(() => {
    const count = 2400
    const positionArray = new Float32Array(count * 3)
    const colorArray = new Float32Array(count * 3)
    const tint = new Color()

    for (let index = 0; index < count; index += 1) {
      const seed = index + 1
      const angle = pseudoRandom(seed * 0.73) * Math.PI * 2
      const radius = 34 + pseudoRandom(seed * 1.91) * 5.2
      const elevation = (pseudoRandom(seed * 2.63) - 0.5) * 0.85

      const baseIndex = index * 3
      positionArray[baseIndex] =
        Math.cos(angle) * radius + (pseudoRandom(seed * 3.11) - 0.5) * 1.2
      positionArray[baseIndex + 1] = elevation
      positionArray[baseIndex + 2] =
        Math.sin(angle) * radius + (pseudoRandom(seed * 3.89) - 0.5) * 1.2

      tint.setHSL(
        0.08 + pseudoRandom(seed * 4.03) * 0.05,
        0.22,
        0.45 + pseudoRandom(seed * 5.17) * 0.2,
      )
      colorArray[baseIndex] = tint.r
      colorArray[baseIndex + 1] = tint.g
      colorArray[baseIndex + 2] = tint.b
    }

    return [positionArray, colorArray]
  }, [])

  useFrame((_, delta) => {
    if (!beltRef.current || !isPlaying) {
      return
    }

    beltRef.current.rotation.y += delta * 0.08 * speed
  })

  return (
    <group ref={beltRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
}

function CameraRig({
  controlsRef,
  selectedBodyId,
  followSelection,
  cinematicCamera,
  positionsRef,
  isUserInteractingRef,
  resumeAutoAtRef,
  manualCameraOverrideRef,
}: CameraRigProps) {
  const { camera } = useThree()
  const desiredPosition = useRef(new Vector3())
  const desiredTarget = useRef(new Vector3())
  const orbitOffset = useRef(new Vector3())
  const origin = useRef(new Vector3(0, 0, 0))
  const spin = useRef(0)
  const sway = useRef(0)

  useFrame((_, delta) => {
    const controls = controlsRef.current

    if (!controls) {
      return
    }

    const now = performance.now()
    const shouldAutoAnimate =
      !manualCameraOverrideRef.current &&
      !isUserInteractingRef.current &&
      now >= resumeAutoAtRef.current

    const selectedBody = BODY_MAP[selectedBodyId]
    const selectedPosition = positionsRef.current[selectedBodyId]

    if (followSelection && selectedPosition) {
      if (!isUserInteractingRef.current) {
        desiredTarget.current.copy(selectedPosition)
        easing.damp3(controls.target, desiredTarget.current, 0.2, delta)
      }

      if (!cinematicCamera || !shouldAutoAnimate) {
        return
      }

      const followDistance = Math.max(8, selectedBody.radius * 8 + 6)

      spin.current += delta * 0.16
      sway.current += delta * 0.85

      orbitOffset.current.set(
        Math.cos(spin.current) * followDistance,
        followDistance * 0.38 + Math.sin(sway.current) * 1.1,
        Math.sin(spin.current) * followDistance,
      )

      desiredPosition.current.copy(selectedPosition).add(orbitOffset.current)

      easing.damp3(camera.position, desiredPosition.current, 0.18, delta)
      return
    }

    if (cinematicCamera && shouldAutoAnimate) {
      spin.current += delta * 0.04

      desiredPosition.current.set(
        Math.cos(spin.current) * 90,
        28 + Math.sin(spin.current * 1.6) * 6,
        Math.sin(spin.current) * 90,
      )

      easing.damp3(camera.position, desiredPosition.current, 0.07, delta)
      easing.damp3(controls.target, origin.current, 0.09, delta)
    }
  })

  return null
}

function SceneContent({ settings, selectedBodyId, onSelectBody }: SolarSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const groupRefs = useRef<Partial<Record<BodyId, Group | null>>>({})
  const meshRefs = useRef<Partial<Record<BodyId, Mesh | null>>>({})
  const [isReducedEffects, setIsReducedEffects] = useState(false)
  const elapsedSimulation = useRef(0)
  const smoothedSpeed = useRef(settings.speed)
  const isUserInteractingRef = useRef(false)
  const resumeAutoAtRef = useRef(0)
  const manualCameraOverrideRef = useRef(false)
  const chromaticOffset = useMemo(() => new Vector2(0.0009, 0.0011), [])
  const tiltByBody = useMemo(() => {
    return SOLAR_BODIES.reduce<Record<BodyId, number>>((lookup, body) => {
      lookup[body.id] = MathUtils.degToRad(body.axialTilt)
      return lookup
    }, {} as Record<BodyId, number>)
  }, [])
  const spinPhaseByBody = useMemo(() => {
    return SOLAR_BODIES.reduce<Record<BodyId, number>>((lookup, body) => {
      lookup[body.id] = body.orbitOffset * 0.7
      return lookup
    }, {} as Record<BodyId, number>)
  }, [])

  const initialPositions = useMemo(() => {
    const zeroTimePositions = computeBodyPositions(0)

    return (Object.entries(zeroTimePositions) as [BodyId, [number, number, number]][]).reduce<
      Record<BodyId, Vector3>
    >((lookup, [id, position]) => {
      lookup[id] = new Vector3(position[0], position[1], position[2])
      return lookup
    }, {} as Record<BodyId, Vector3>)
  }, [])

  const positionsRef = useRef<Record<BodyId, Vector3>>(initialPositions)

  useEffect(() => {
    manualCameraOverrideRef.current = false
  }, [selectedBodyId, settings.followSelection, settings.cinematicCamera])

  useFrame((_, delta) => {
    const frameDelta = Math.min(delta, 0.1)
    const targetSpeed = settings.isPlaying ? settings.speed : 0

    smoothedSpeed.current = MathUtils.damp(smoothedSpeed.current, targetSpeed, 5.2, frameDelta)

    if (Math.abs(smoothedSpeed.current) < 0.0005) {
      smoothedSpeed.current = 0
    }

    elapsedSimulation.current += frameDelta * smoothedSpeed.current

    const worldPositions = computeBodyPositions(elapsedSimulation.current)

    for (const body of SOLAR_BODIES) {
      const position = worldPositions[body.id]
      const group = groupRefs.current[body.id]
      const mesh = meshRefs.current[body.id]

      if (group) {
        group.position.set(position[0], position[1], position[2])
        const targetScale = selectedBodyId === body.id ? 1.09 : 1
        const easedScale = MathUtils.damp(group.scale.x, targetScale, 8, frameDelta)
        group.scale.setScalar(easedScale)
      }

      if (mesh) {
        mesh.rotation.z = tiltByBody[body.id]
        const targetSpin = elapsedSimulation.current * body.rotationSpeed + spinPhaseByBody[body.id]
        mesh.rotation.y = targetSpin
      }

      positionsRef.current[body.id].set(position[0], position[1], position[2])
    }
  })

  return (
    <>
      <color attach="background" args={['#020611']} />
      <fogExp2 attach="fog" args={['#040a17', 0.0055]} />

      <AdaptiveDpr />
      <PerformanceMonitor
        factor={0.8}
        onChange={({ factor }) => {
          setIsReducedEffects((current) => {
            if (factor < 0.45) {
              return true
            }

            if (factor > 0.62) {
              return false
            }

            return current
          })
        }}
      />

      <ambientLight intensity={0.15} color="#88a3ff" />
      <hemisphereLight intensity={0.14} color="#8bb4ff" groundColor="#10131d" />
      <pointLight
        position={[0, 0, 0]}
        intensity={170}
        decay={2}
        distance={260}
        color="#ffd2a8"
        castShadow
      />
      <pointLight
        position={[0, 22, 0]}
        intensity={14}
        decay={2.4}
        distance={160}
        color="#74a8ff"
      />

      <DeepSpaceBackdrop />
      <Stars
        radius={210}
        depth={90}
        count={isReducedEffects ? 4600 : 7500}
        factor={4.6}
        saturation={0}
        fade
        speed={0.45}
      />
      {!isReducedEffects ? (
        <Stars
          radius={120}
          depth={50}
          count={1600}
          factor={3.2}
          saturation={0.5}
          fade
          speed={0.28}
        />
      ) : null}
      <Sparkles
        count={isReducedEffects ? 140 : 250}
        scale={150}
        size={4.4}
        speed={0.38}
        opacity={0.42}
        color="#ffd8a3"
      />

      {settings.showOrbits
        ? PLANETARY_ORBITS.map((body) => (
            <OrbitPath key={`orbit-${body.id}`} radius={body.distance} color={body.orbitColor} />
          ))
        : null}

      <AsteroidBelt isPlaying={settings.isPlaying} speed={settings.speed} />

      {SOLAR_BODIES.map((body) => (
        <PlanetNode
          key={body.id}
          body={body}
          isSelected={selectedBodyId === body.id}
          showLabel={settings.showLabels}
          onSelect={onSelectBody}
          setGroupRef={(group) => {
            groupRefs.current[body.id] = group
          }}
          setMeshRef={(mesh) => {
            meshRefs.current[body.id] = mesh
          }}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        regress
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.92}
        zoomSpeed={0.75}
        minDistance={8}
        maxDistance={200}
        enablePan={false}
        onStart={() => {
          isUserInteractingRef.current = true
          manualCameraOverrideRef.current = true
          resumeAutoAtRef.current = performance.now() + 900
        }}
        onChange={() => {
          if (isUserInteractingRef.current) {
            resumeAutoAtRef.current = performance.now() + 900
          }
        }}
        onEnd={() => {
          isUserInteractingRef.current = false
          resumeAutoAtRef.current = performance.now() + 1200
        }}
      />

      <CameraRig
        controlsRef={controlsRef}
        selectedBodyId={selectedBodyId}
        followSelection={settings.followSelection}
        cinematicCamera={settings.cinematicCamera}
        positionsRef={positionsRef}
        isUserInteractingRef={isUserInteractingRef}
        resumeAutoAtRef={resumeAutoAtRef}
        manualCameraOverrideRef={manualCameraOverrideRef}
      />

      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.12} luminanceSmoothing={0.28} />
        <Vignette offset={0.2} darkness={0.68} eskil={false} />
        {!isReducedEffects ? (
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={chromaticOffset}
            radialModulation
            modulationOffset={0.27}
          />
        ) : (
          <></>
        )}
        {!isReducedEffects ? (
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.08} />
        ) : (
          <></>
        )}
      </EffectComposer>
    </>
  )
}

export function SolarScene(props: SolarSceneProps) {
  return (
    <Canvas
      className="solar-canvas"
      dpr={[1, 1.45]}
      performance={{ min: 0.68, max: 1, debounce: 300 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 24, 86], fov: 46, near: 0.1, far: 520 }}
    >
      <SceneContent {...props} />
    </Canvas>
  )
}
