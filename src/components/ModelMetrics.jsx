import { trainingHistory, featureImportance } from '../data/sampleData'
import './ModelMetrics.css'

const CHART_WIDTH = 500
const CHART_HEIGHT = 200
const PADDING = { top: 20, right: 20, bottom: 40, left: 50 }

function scaleX(epoch, total) {
  return (
    PADDING.left +
    ((epoch - 1) / (total - 1)) *
      (CHART_WIDTH - PADDING.left - PADDING.right)
  )
}

function scaleY(value, min, max) {
  return (
    CHART_HEIGHT -
    PADDING.bottom -
    ((value - min) / (max - min)) *
      (CHART_HEIGHT - PADDING.top - PADDING.bottom)
  )
}

function polyline(data, xKey, yKey, min, max) {
  return data
    .map((d) => `${scaleX(d[xKey], data.length)},${scaleY(d[yKey], min, max)}`)
    .join(' ')
}

function LossChart({ data }) {
  const allValues = data.flatMap((d) => [d.trainLoss, d.valLoss])
  const min = Math.floor(Math.min(...allValues) * 10) / 10
  const max = Math.ceil(Math.max(...allValues) * 10) / 10

  const yTicks = [min, (min + max) / 2, max]
  const xTicks = data.filter((_, i) => i % 2 === 0 || i === data.length - 1)

  return (
    <div className="chart-container">
      <h3 className="chart-title">Training &amp; Validation Loss</h3>
      <div className="chart-legend">
        <span className="legend-item legend-item--train">Train Loss</span>
        <span className="legend-item legend-item--val">Val Loss</span>
      </div>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="chart-svg"
        aria-label="Training and validation loss over epochs"
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING.left}
              y1={scaleY(tick, min, max)}
              x2={CHART_WIDTH - PADDING.right}
              y2={scaleY(tick, min, max)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <text
              x={PADDING.left - 6}
              y={scaleY(tick, min, max) + 4}
              fill="#64748b"
              fontSize="11"
              textAnchor="end"
            >
              {tick.toFixed(1)}
            </text>
          </g>
        ))}
        {xTicks.map((d) => (
          <text
            key={d.epoch}
            x={scaleX(d.epoch, data.length)}
            y={CHART_HEIGHT - PADDING.bottom + 16}
            fill="#64748b"
            fontSize="11"
            textAnchor="middle"
          >
            {d.epoch}
          </text>
        ))}
        <text
          x={CHART_WIDTH / 2}
          y={CHART_HEIGHT - 4}
          fill="#64748b"
          fontSize="11"
          textAnchor="middle"
        >
          Epoch
        </text>
        <polyline
          points={polyline(data, 'epoch', 'trainLoss', min, max)}
          fill="none"
          stroke="#e94560"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polyline
          points={polyline(data, 'epoch', 'valLoss', min, max)}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeDasharray="6 3"
        />
        {data.map((d) => (
          <circle
            key={`train-${d.epoch}`}
            cx={scaleX(d.epoch, data.length)}
            cy={scaleY(d.trainLoss, min, max)}
            r="3.5"
            fill="#e94560"
          >
            <title>Epoch {d.epoch}: {d.trainLoss}</title>
          </circle>
        ))}
        {data.map((d) => (
          <circle
            key={`val-${d.epoch}`}
            cx={scaleX(d.epoch, data.length)}
            cy={scaleY(d.valLoss, min, max)}
            r="3.5"
            fill="#60a5fa"
          >
            <title>Epoch {d.epoch}: {d.valLoss}</title>
          </circle>
        ))}
      </svg>
    </div>
  )
}

function AccuracyChart({ data }) {
  const allValues = data.flatMap((d) => [d.trainAcc, d.valAcc])
  const min = Math.floor(Math.min(...allValues) * 10) / 10
  const max = 1.0

  const yTicks = [min, (min + max) / 2, max]
  const xTicks = data.filter((_, i) => i % 2 === 0 || i === data.length - 1)

  return (
    <div className="chart-container">
      <h3 className="chart-title">Training &amp; Validation Accuracy</h3>
      <div className="chart-legend">
        <span className="legend-item legend-item--train">Train Acc</span>
        <span className="legend-item legend-item--val">Val Acc</span>
      </div>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="chart-svg"
        aria-label="Training and validation accuracy over epochs"
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING.left}
              y1={scaleY(tick, min, max)}
              x2={CHART_WIDTH - PADDING.right}
              y2={scaleY(tick, min, max)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <text
              x={PADDING.left - 6}
              y={scaleY(tick, min, max) + 4}
              fill="#64748b"
              fontSize="11"
              textAnchor="end"
            >
              {(tick * 100).toFixed(0)}%
            </text>
          </g>
        ))}
        {xTicks.map((d) => (
          <text
            key={d.epoch}
            x={scaleX(d.epoch, data.length)}
            y={CHART_HEIGHT - PADDING.bottom + 16}
            fill="#64748b"
            fontSize="11"
            textAnchor="middle"
          >
            {d.epoch}
          </text>
        ))}
        <text
          x={CHART_WIDTH / 2}
          y={CHART_HEIGHT - 4}
          fill="#64748b"
          fontSize="11"
          textAnchor="middle"
        >
          Epoch
        </text>
        <polyline
          points={polyline(data, 'epoch', 'trainAcc', min, max)}
          fill="none"
          stroke="#4ade80"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polyline
          points={polyline(data, 'epoch', 'valAcc', min, max)}
          fill="none"
          stroke="#fb923c"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeDasharray="6 3"
        />
        {data.map((d) => (
          <circle
            key={`train-acc-${d.epoch}`}
            cx={scaleX(d.epoch, data.length)}
            cy={scaleY(d.trainAcc, min, max)}
            r="3.5"
            fill="#4ade80"
          >
            <title>Epoch {d.epoch}: {(d.trainAcc * 100).toFixed(1)}%</title>
          </circle>
        ))}
        {data.map((d) => (
          <circle
            key={`val-acc-${d.epoch}`}
            cx={scaleX(d.epoch, data.length)}
            cy={scaleY(d.valAcc, min, max)}
            r="3.5"
            fill="#fb923c"
          >
            <title>Epoch {d.epoch}: {(d.valAcc * 100).toFixed(1)}%</title>
          </circle>
        ))}
      </svg>
    </div>
  )
}

function FeatureImportanceChart({ features }) {
  const maxImportance = Math.max(...features.map((f) => f.importance))

  return (
    <div className="chart-container">
      <h3 className="chart-title">Feature Importance</h3>
      <div className="feature-bars">
        {[...features]
          .sort((a, b) => b.importance - a.importance)
          .map((feat) => (
            <div key={feat.feature} className="feature-bar-row">
              <span className="feature-bar-label">{feat.feature}</span>
              <div className="feature-bar-track">
                <div
                  className="feature-bar-fill"
                  style={{ width: `${(feat.importance / maxImportance) * 100}%` }}
                />
              </div>
              <span className="feature-bar-value">
                {(feat.importance * 100).toFixed(1)}%
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}

function ModelMetrics() {
  return (
    <div className="model-metrics">
      <div className="charts-row">
        <LossChart data={trainingHistory} />
        <AccuracyChart data={trainingHistory} />
      </div>
      <FeatureImportanceChart features={featureImportance} />
    </div>
  )
}

export default ModelMetrics
