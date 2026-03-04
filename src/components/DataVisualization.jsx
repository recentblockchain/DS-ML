import { useState } from 'react'
import { trainingHistory, featureImportance, models } from '../data/sampleData'
import './DataVisualization.css'

const BAR_CHART_WIDTH = 480
const BAR_CHART_HEIGHT = 220
const BP = { top: 20, right: 20, bottom: 50, left: 60 }

const SCATTER_WIDTH = 480
const SCATTER_HEIGHT = 220
const SP = { top: 20, right: 20, bottom: 50, left: 60 }

function ModelAccuracyBarChart({ data }) {
  const barCount = data.length
  const barAreaWidth = BAR_CHART_WIDTH - BP.left - BP.right
  const barWidth = (barAreaWidth / barCount) * 0.6
  const barSpacing = barAreaWidth / barCount
  const maxVal = 1.0
  const minVal = 0.82

  function barHeight(accuracy) {
    return ((accuracy - minVal) / (maxVal - minVal)) * (BAR_CHART_HEIGHT - BP.top - BP.bottom)
  }

  function barY(accuracy) {
    return BAR_CHART_HEIGHT - BP.bottom - barHeight(accuracy)
  }

  function barX(index) {
    return BP.left + index * barSpacing + (barSpacing - barWidth) / 2
  }

  const yTicks = [0.85, 0.90, 0.95, 1.0]

  return (
    <div className="chart-container">
      <h3 className="chart-title">Model Accuracy Comparison</h3>
      <svg
        viewBox={`0 0 ${BAR_CHART_WIDTH} ${BAR_CHART_HEIGHT}`}
        className="chart-svg"
        aria-label="Model accuracy comparison bar chart"
      >
        {yTicks.map((tick) => {
          const y = BAR_CHART_HEIGHT - BP.bottom - ((tick - minVal) / (maxVal - minVal)) * (BAR_CHART_HEIGHT - BP.top - BP.bottom)
          return (
            <g key={tick}>
              <line
                x1={BP.left}
                y1={y}
                x2={BAR_CHART_WIDTH - BP.right}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <text x={BP.left - 6} y={y + 4} fill="#64748b" fontSize="10" textAnchor="end">
                {(tick * 100).toFixed(0)}%
              </text>
            </g>
          )
        })}

        {data.map((model, i) => (
          <g key={model.name}>
            <rect
              x={barX(i)}
              y={barY(model.accuracy)}
              width={barWidth}
              height={barHeight(model.accuracy)}
              fill={model.status === 'active' ? '#e94560' : '#3b4d6b'}
              rx="4"
            >
              <title>{model.name}: {(model.accuracy * 100).toFixed(1)}%</title>
            </rect>
            <text
              x={barX(i) + barWidth / 2}
              y={BAR_CHART_HEIGHT - BP.bottom + 14}
              fill="#64748b"
              fontSize="9"
              textAnchor="middle"
            >
              {model.name.split(' ')[0]}
            </text>
          </g>
        ))}

        <line
          x1={BP.left}
          y1={BAR_CHART_HEIGHT - BP.bottom}
          x2={BAR_CHART_WIDTH - BP.right}
          y2={BAR_CHART_HEIGHT - BP.bottom}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}

function LossByEpochAreaChart({ data }) {
  const n = data.length
  const allLoss = data.flatMap((d) => [d.trainLoss, d.valLoss])
  const minL = 0
  const maxL = Math.ceil(Math.max(...allLoss) * 10) / 10

  function xp(epoch) {
    return SP.left + ((epoch - 1) / (n - 1)) * (SCATTER_WIDTH - SP.left - SP.right)
  }

  function yp(val) {
    return SCATTER_HEIGHT - SP.bottom - ((val - minL) / (maxL - minL)) * (SCATTER_HEIGHT - SP.top - SP.bottom)
  }

  const trainPath = data.map((d) => `${xp(d.epoch)},${yp(d.trainLoss)}`).join(' L ')
  const valPath = data.map((d) => `${xp(d.epoch)},${yp(d.valLoss)}`).join(' L ')

  const trainAreaBottom = `${xp(data[data.length - 1].epoch)},${yp(0)} ${xp(data[0].epoch)},${yp(0)}`
  const valAreaBottom = `${xp(data[data.length - 1].epoch)},${yp(0)} ${xp(data[0].epoch)},${yp(0)}`

  const yTicks = [0, maxL / 2, maxL]
  const xTicks = data.filter((_, i) => i % 3 === 0 || i === n - 1)

  return (
    <div className="chart-container">
      <h3 className="chart-title">Loss Convergence</h3>
      <div className="chart-legend">
        <span className="legend-item legend-item--train">Train</span>
        <span className="legend-item legend-item--val">Validation</span>
      </div>
      <svg
        viewBox={`0 0 ${SCATTER_WIDTH} ${SCATTER_HEIGHT}`}
        className="chart-svg"
        aria-label="Loss convergence area chart"
      >
        <defs>
          <linearGradient id="trainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e94560" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e94560" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={SP.left}
              y1={yp(tick)}
              x2={SCATTER_WIDTH - SP.right}
              y2={yp(tick)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <text x={SP.left - 6} y={yp(tick) + 4} fill="#64748b" fontSize="10" textAnchor="end">
              {tick.toFixed(2)}
            </text>
          </g>
        ))}

        {xTicks.map((d) => (
          <text
            key={d.epoch}
            x={xp(d.epoch)}
            y={SCATTER_HEIGHT - SP.bottom + 14}
            fill="#64748b"
            fontSize="10"
            textAnchor="middle"
          >
            {d.epoch}
          </text>
        ))}

        <text
          x={SCATTER_WIDTH / 2}
          y={SCATTER_HEIGHT - 4}
          fill="#64748b"
          fontSize="10"
          textAnchor="middle"
        >
          Epoch
        </text>

        <polygon
          points={`${xp(data[0].epoch)},${yp(data[0].trainLoss)} L ${trainPath} ${trainAreaBottom}`}
          fill="url(#trainGrad)"
        />
        <polygon
          points={`${xp(data[0].epoch)},${yp(data[0].valLoss)} L ${valPath} ${valAreaBottom}`}
          fill="url(#valGrad)"
        />
        <polyline
          points={data.map((d) => `${xp(d.epoch)},${yp(d.trainLoss)}`).join(' ')}
          fill="none"
          stroke="#e94560"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <polyline
          points={data.map((d) => `${xp(d.epoch)},${yp(d.valLoss)}`).join(' ')}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function RadarChart({ features }) {
  const n = features.length
  const cx = 180
  const cy = 130
  const r = 90
  const levels = 4

  function angle(i) {
    return (Math.PI * 2 * i) / n - Math.PI / 2
  }

  function point(i, val) {
    const a = angle(i)
    return { x: cx + val * r * Math.cos(a), y: cy + val * r * Math.sin(a) }
  }

  const maxImportance = Math.max(...features.map((f) => f.importance))

  const dataPoints = features.map((f, i) => point(i, f.importance / maxImportance))
  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div className="chart-container">
      <h3 className="chart-title">Feature Radar Chart</h3>
      <svg viewBox="0 0 360 260" className="chart-svg" aria-label="Feature importance radar chart">
        {Array.from({ length: levels }, (_, l) => {
          const levelR = ((l + 1) / levels) * r
          const pts = features.map((_, i) => {
            const a = angle(i)
            return `${cx + levelR * Math.cos(a)},${cy + levelR * Math.sin(a)}`
          })
          return (
            <polygon
              key={l}
              points={pts.join(' ')}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          )
        })}

        {features.map((f, i) => {
          const a = angle(i)
          const end = { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
          const labelPt = { x: cx + (r + 22) * Math.cos(a), y: cy + (r + 18) * Math.sin(a) }
          return (
            <g key={f.feature}>
              <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <text
                x={labelPt.x}
                y={labelPt.y}
                fill="#94a3b8"
                fontSize="10"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {f.feature}
              </text>
            </g>
          )
        })}

        <polygon
          points={polygonPoints}
          fill="rgba(233,69,96,0.2)"
          stroke="#e94560"
          strokeWidth="2"
        />

        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#e94560">
            <title>{features[i].feature}: {(features[i].importance * 100).toFixed(1)}%</title>
          </circle>
        ))}
      </svg>
    </div>
  )
}

function DataVisualization() {
  const [activeChart, setActiveChart] = useState('accuracy')

  return (
    <div className="data-viz">
      <div className="viz-toolbar">
        <button
          className={`viz-btn ${activeChart === 'accuracy' ? 'viz-btn--active' : ''}`}
          onClick={() => setActiveChart('accuracy')}
        >
          Accuracy Comparison
        </button>
        <button
          className={`viz-btn ${activeChart === 'loss' ? 'viz-btn--active' : ''}`}
          onClick={() => setActiveChart('loss')}
        >
          Loss Convergence
        </button>
        <button
          className={`viz-btn ${activeChart === 'radar' ? 'viz-btn--active' : ''}`}
          onClick={() => setActiveChart('radar')}
        >
          Feature Radar
        </button>
      </div>

      {activeChart === 'accuracy' && (
        <ModelAccuracyBarChart data={models} />
      )}
      {activeChart === 'loss' && (
        <LossByEpochAreaChart data={trainingHistory} />
      )}
      {activeChart === 'radar' && (
        <RadarChart features={featureImportance} />
      )}
    </div>
  )
}

export default DataVisualization
