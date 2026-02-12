export type BodyId =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'moon'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto'

export type BodyKind = 'star' | 'planet' | 'moon'

export interface RingDefinition {
  innerRadius: number
  outerRadius: number
  tilt: number
  color: string
  opacity: number
  textureUrl: string
}

export interface SolarBodyDefinition {
  id: BodyId
  name: string
  kind: BodyKind
  radius: number
  distance: number
  orbitSpeed: number
  rotationSpeed: number
  axialTilt: number
  orbitOffset: number
  surfaceColor: string
  orbitColor: string
  textureUrl: string
  emissiveColor?: string
  atmosphereColor?: string
  parentId?: BodyId
  ring?: RingDefinition
  description: string
  facts: string[]
}

const TEXTURE_ROOT =
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets'

export const SOLAR_BODIES: SolarBodyDefinition[] = [
  {
    id: 'sun',
    name: 'Sun',
    kind: 'star',
    radius: 4.8,
    distance: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.08,
    axialTilt: 7.25,
    orbitOffset: 0,
    surfaceColor: '#f8b667',
    orbitColor: '#855635',
    textureUrl: `${TEXTURE_ROOT}/sun.jpg`,
    emissiveColor: '#ff9639',
    atmosphereColor: '#ffc475',
    description:
      'A glowing stellar heart with amplified bloom and cinematic radiance for dramatic scenes.',
    facts: [
      'Contains more than 99% of the solar system mass.',
      'Surface temperatures reach around 5,500 C.',
      'Powered by hydrogen fusion deep in the core.',
    ],
  },
  {
    id: 'mercury',
    name: 'Mercury',
    kind: 'planet',
    radius: 0.55,
    distance: 9,
    orbitSpeed: 1.6,
    rotationSpeed: 0.03,
    axialTilt: 0.03,
    orbitOffset: 0.6,
    surfaceColor: '#b7a28b',
    orbitColor: '#4d596e',
    textureUrl: `${TEXTURE_ROOT}/mercury.jpg`,
    description:
      'A scorched rocky world racing close to the Sun with sharp terminator contrast.',
    facts: [
      'Smallest planet in the solar system.',
      'A single year lasts only 88 Earth days.',
      'Almost no atmosphere to trap heat.',
    ],
  },
  {
    id: 'venus',
    name: 'Venus',
    kind: 'planet',
    radius: 0.95,
    distance: 12.2,
    orbitSpeed: 1.24,
    rotationSpeed: -0.014,
    axialTilt: 177,
    orbitOffset: 1.9,
    surfaceColor: '#e6ae67',
    orbitColor: '#5e6378',
    textureUrl: `${TEXTURE_ROOT}/venus.jpg`,
    atmosphereColor: '#ffc88d',
    description:
      'A dense amber world wrapped in reflective clouds and thick atmospheric haze.',
    facts: [
      'Rotates backward compared with most planets.',
      'Hottest planetary surface in the system.',
      'Cloud tops are rich in sulfuric acid.',
    ],
  },
  {
    id: 'earth',
    name: 'Earth',
    kind: 'planet',
    radius: 1,
    distance: 16,
    orbitSpeed: 1,
    rotationSpeed: 0.5,
    axialTilt: 23.4,
    orbitOffset: 3.2,
    surfaceColor: '#8ec2ff',
    orbitColor: '#6f88a4',
    textureUrl: `${TEXTURE_ROOT}/earth_atmos_2048.jpg`,
    atmosphereColor: '#72d9ff',
    description:
      'A vibrant blue world with a bright atmospheric rim and fast readable cloud motion.',
    facts: [
      'Only known planet with liquid surface oceans.',
      'Protected by a strong magnetic field.',
      'Its axial tilt drives familiar seasons.',
    ],
  },
  {
    id: 'moon',
    name: 'Moon',
    kind: 'moon',
    radius: 0.28,
    distance: 1.9,
    orbitSpeed: 5,
    rotationSpeed: 0.06,
    axialTilt: 6.7,
    orbitOffset: 2.4,
    surfaceColor: '#d2d2cf',
    orbitColor: '#7b8798',
    textureUrl: `${TEXTURE_ROOT}/moon_1024.jpg`,
    parentId: 'earth',
    description:
      'Earths companion rendered as a fast cinematic moon orbit for visual rhythm.',
    facts: [
      'Average distance is roughly 384,400 km.',
      'Keeps nearly the same face toward Earth.',
      'Lunar gravity shapes ocean tides.',
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    kind: 'planet',
    radius: 0.82,
    distance: 21,
    orbitSpeed: 0.8,
    rotationSpeed: 0.48,
    axialTilt: 25.2,
    orbitOffset: 4.7,
    surfaceColor: '#cd7251',
    orbitColor: '#84767a',
    textureUrl: `${TEXTURE_ROOT}/mars_1k_color.jpg`,
    atmosphereColor: '#ea9c7a',
    description:
      'A dusty red desert sphere with warm glow accents and dramatic shadowing.',
    facts: [
      'Home to Olympus Mons, a giant volcano.',
      'Shows evidence of ancient flowing water.',
      'Has thin carbon-dioxide atmosphere.',
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    kind: 'planet',
    radius: 2.9,
    distance: 30,
    orbitSpeed: 0.44,
    rotationSpeed: 1,
    axialTilt: 3.1,
    orbitOffset: 0.4,
    surfaceColor: '#d2b08e',
    orbitColor: '#8a7f91',
    textureUrl: `${TEXTURE_ROOT}/jupiter.jpg`,
    description:
      'A giant banded planet scaled for spectacle and deep gas-giant presence.',
    facts: [
      'Largest planet in the solar system.',
      'Great Red Spot is a long-lived storm.',
      'Likely has a rocky core under dense gases.',
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    kind: 'planet',
    radius: 2.45,
    distance: 40,
    orbitSpeed: 0.32,
    rotationSpeed: 0.92,
    axialTilt: 26.7,
    orbitOffset: 2.1,
    surfaceColor: '#e4c79e',
    orbitColor: '#8c8297',
    textureUrl: `${TEXTURE_ROOT}/saturn.jpg`,
    description:
      'A majestic gas giant framed by translucent rings for a strong silhouette.',
    facts: [
      'Rings are mostly ice and rock particles.',
      'Its density is lower than liquid water.',
      'Hosts dozens of intriguing moons.',
    ],
    ring: {
      innerRadius: 3,
      outerRadius: 4.6,
      tilt: 1.6,
      color: '#dec4a1',
      opacity: 0.82,
      textureUrl: `${TEXTURE_ROOT}/saturnringcolor.jpg`,
    },
  },
  {
    id: 'uranus',
    name: 'Uranus',
    kind: 'planet',
    radius: 1.8,
    distance: 49,
    orbitSpeed: 0.24,
    rotationSpeed: -0.65,
    axialTilt: 97.8,
    orbitOffset: 5,
    surfaceColor: '#84d2d9',
    orbitColor: '#6e7f94',
    textureUrl: `${TEXTURE_ROOT}/uranus.jpg`,
    atmosphereColor: '#95e6ef',
    description:
      'An ice giant tipped on its side, highlighted with cool luminous tones.',
    facts: [
      'Extreme axial tilt causes unusual seasons.',
      'Atmosphere contains methane haze.',
      'Faint rings encircle the planet.',
    ],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    kind: 'planet',
    radius: 1.75,
    distance: 58,
    orbitSpeed: 0.18,
    rotationSpeed: 0.72,
    axialTilt: 28.3,
    orbitOffset: 1.2,
    surfaceColor: '#5b89ff',
    orbitColor: '#627f9e',
    textureUrl: `${TEXTURE_ROOT}/neptune.jpg`,
    atmosphereColor: '#91acff',
    description:
      'A deep cobalt giant set near the edge of the stylized system horizon.',
    facts: [
      'Fast winds can exceed 2,000 km/h.',
      'One orbit takes about 165 Earth years.',
      'Radiates more heat than it receives.',
    ],
  },
  {
    id: 'pluto',
    name: 'Pluto',
    kind: 'planet',
    radius: 0.42,
    distance: 67,
    orbitSpeed: 0.14,
    rotationSpeed: -0.05,
    axialTilt: 122.5,
    orbitOffset: 2.8,
    surfaceColor: '#b99379',
    orbitColor: '#5b6f8a',
    textureUrl: `${TEXTURE_ROOT}/pluto.jpg`,
    description:
      'A distant icy dwarf world with a muted bronze tint near the outer system edge.',
    facts: [
      'Classified as a dwarf planet in 2006.',
      'Its largest moon Charon forms a binary-like pair.',
      'A year on Pluto lasts about 248 Earth years.',
    ],
  },
]

export const BODY_MAP = SOLAR_BODIES.reduce<Record<BodyId, SolarBodyDefinition>>(
  (lookup, body) => {
    lookup[body.id] = body
    return lookup
  },
  {} as Record<BodyId, SolarBodyDefinition>,
)

export const PRIMARY_BODY_ORDER: BodyId[] = [
  'sun',
  'mercury',
  'venus',
  'earth',
  'moon',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
]

export const PLANETARY_ORBITS = SOLAR_BODIES.filter(
  (body) => body.distance > 0 && !body.parentId,
)

export type BodyPosition = [number, number, number]
export type BodyPositions = Record<BodyId, BodyPosition>

export function computeBodyPositions(time: number): BodyPositions {
  const positions = {} as BodyPositions

  for (const body of SOLAR_BODIES) {
    if (body.distance === 0) {
      positions[body.id] = [0, 0, 0]
      continue
    }

    const orbitAngle = body.orbitOffset + time * body.orbitSpeed
    const localX = Math.cos(orbitAngle) * body.distance
    const localZ = Math.sin(orbitAngle) * body.distance
    const parent = body.parentId ? positions[body.parentId] : [0, 0, 0]

    positions[body.id] = [parent[0] + localX, parent[1], parent[2] + localZ]
  }

  return positions
}
