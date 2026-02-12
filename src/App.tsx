import { useState } from 'react'
import { SolarScene, type SceneSettings } from './components/SolarScene'
import { BODY_MAP, PRIMARY_BODY_ORDER, type BodyId } from './data/solarBodies'
import './App.css'

const INITIAL_SETTINGS: SceneSettings = {
  isPlaying: true,
  speed: 1.4,
  showOrbits: true,
  showLabels: true,
  followSelection: true,
  cinematicCamera: true,
  highQualityShadows: false,
}

function App() {
  const [selectedBodyId, setSelectedBodyId] = useState<BodyId>('earth')
  const [settings, setSettings] = useState<SceneSettings>(INITIAL_SETTINGS)
  const [isUiHidden, setIsUiHidden] = useState(false)

  const selectedBody = BODY_MAP[selectedBodyId]

  return (
    <div className="app-shell">
      <div className="scene-wrap">
        <SolarScene
          settings={settings}
          selectedBodyId={selectedBodyId}
          onSelectBody={setSelectedBodyId}
        />
      </div>

      <div className="hud-layer">
        <button
          type="button"
          className="hud-toggle"
          onClick={() => setIsUiHidden((current) => !current)}
        >
          {isUiHidden ? 'Show UI' : 'Hide UI'}
        </button>

        {!isUiHidden ? (
          <>
            <header className="hud-panel hud-top">
              <p className="eyebrow">Stylized Interactive Observatory</p>
              <h1>Solar System Spectacle</h1>
              <p className="subtitle">
                Drag to orbit, scroll to zoom, and click any world to lock focus.
              </p>
            </header>

            <aside className="hud-panel hud-info">
              <p className="info-kicker">
                {selectedBody.kind === 'star'
                  ? 'Star'
                  : selectedBody.kind === 'moon'
                    ? 'Moon'
                    : 'Planet'}
              </p>
              <h2>{selectedBody.name}</h2>
              <p>{selectedBody.description}</p>
              <div className="fact-list">
                {selectedBody.facts.map((fact) => (
                  <p key={fact}>- {fact}</p>
                ))}
              </div>
            </aside>

            <section className="hud-panel hud-selector">
              {PRIMARY_BODY_ORDER.map((bodyId) => {
                const body = BODY_MAP[bodyId]

                return (
                  <button
                    key={bodyId}
                    type="button"
                    className={`pill-button${selectedBodyId === bodyId ? ' active' : ''}`}
                    onClick={() => setSelectedBodyId(bodyId)}
                  >
                    {body.name}
                  </button>
                )
              })}
            </section>

            <section className="hud-panel hud-controls">
              <div className="button-row">
                <button
                  type="button"
                  className={`surface-button${settings.isPlaying ? ' active' : ''}`}
                  onClick={() =>
                    setSettings((current) => ({
                      ...current,
                      isPlaying: !current.isPlaying,
                    }))
                  }
                >
                  {settings.isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  type="button"
                  className={`surface-button${settings.followSelection ? ' active' : ''}`}
                  onClick={() =>
                    setSettings((current) => ({
                      ...current,
                      followSelection: !current.followSelection,
                    }))
                  }
                >
                  Follow
                </button>
                <button
                  type="button"
                  className={`surface-button${settings.cinematicCamera ? ' active' : ''}`}
                  onClick={() =>
                    setSettings((current) => ({
                      ...current,
                      cinematicCamera: !current.cinematicCamera,
                    }))
                  }
                >
                  Cinematic
                </button>
              </div>

              <div className="button-row">
                <button
                  type="button"
                  className={`surface-button${settings.showOrbits ? ' active' : ''}`}
                  onClick={() =>
                    setSettings((current) => ({
                      ...current,
                      showOrbits: !current.showOrbits,
                    }))
                  }
                >
                  Orbits
                </button>
                <button
                  type="button"
                  className={`surface-button${settings.showLabels ? ' active' : ''}`}
                  onClick={() =>
                    setSettings((current) => ({
                      ...current,
                      showLabels: !current.showLabels,
                    }))
                  }
                >
                  Labels
                </button>
                <button
                  type="button"
                  className={`surface-button${settings.highQualityShadows ? ' active' : ''}`}
                  onClick={() =>
                    setSettings((current) => ({
                      ...current,
                      highQualityShadows: !current.highQualityShadows,
                    }))
                  }
                >
                  Shadows
                </button>
              </div>

              <label className="speed-label" htmlFor="simulation-speed">
                <span>Time Warp</span>
                <strong>{settings.speed.toFixed(2)}x</strong>
              </label>
              <input
                id="simulation-speed"
                type="range"
                min={0.2}
                max={4.2}
                step={0.01}
                value={settings.speed}
                onChange={(event) => {
                  const nextSpeed = Number(event.target.value)
                  setSettings((current) => ({
                    ...current,
                    speed: nextSpeed,
                  }))
                }}
              />
            </section>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default App
