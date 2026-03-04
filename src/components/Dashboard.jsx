import { modelMetrics, datasetStats, confusionMatrix, models } from '../data/sampleData'
import './Dashboard.css'

function MetricCard({ label, value, color, description }) {
  return (
    <div className="metric-card">
      <p className="metric-card__label">{label}</p>
      <p className="metric-card__value" style={{ color }}>
        {(value * 100).toFixed(1)}%
      </p>
      {description && <p className="metric-card__desc">{description}</p>}
    </div>
  )
}

function StatItem({ label, value }) {
  return (
    <div className="stat-item">
      <span className="stat-item__label">{label}</span>
      <span className="stat-item__value">{value.toLocaleString()}</span>
    </div>
  )
}

function Dashboard() {
  const total =
    confusionMatrix.truePositive +
    confusionMatrix.falsePositive +
    confusionMatrix.falseNegative +
    confusionMatrix.trueNegative

  const cmCells = [
    { label: 'TP', value: confusionMatrix.truePositive, type: 'true' },
    { label: 'FP', value: confusionMatrix.falsePositive, type: 'false' },
    { label: 'FN', value: confusionMatrix.falseNegative, type: 'false' },
    { label: 'TN', value: confusionMatrix.trueNegative, type: 'true' },
  ]

  return (
    <div className="dashboard">
      <section className="dashboard-section">
        <h2 className="section-title">Model Performance</h2>
        <div className="metrics-grid">
          <MetricCard
            label="Accuracy"
            value={modelMetrics.accuracy}
            color="#4ade80"
            description="Overall correct predictions"
          />
          <MetricCard
            label="Precision"
            value={modelMetrics.precision}
            color="#60a5fa"
            description="True positives / predicted positives"
          />
          <MetricCard
            label="Recall"
            value={modelMetrics.recall}
            color="#f472b6"
            description="True positives / actual positives"
          />
          <MetricCard
            label="F1 Score"
            value={modelMetrics.f1Score}
            color="#fb923c"
            description="Harmonic mean of precision & recall"
          />
          <MetricCard
            label="AUC-ROC"
            value={modelMetrics.auc}
            color="#a78bfa"
            description="Area under ROC curve"
          />
        </div>
      </section>

      <div className="dashboard-row">
        <section className="dashboard-section dashboard-section--half">
          <h2 className="section-title">Dataset Overview</h2>
          <div className="stats-list">
            <StatItem label="Total Samples" value={datasetStats.totalSamples} />
            <StatItem label="Training Samples" value={datasetStats.trainSamples} />
            <StatItem label="Test Samples" value={datasetStats.testSamples} />
            <StatItem label="Features" value={datasetStats.features} />
            <StatItem label="Classes" value={datasetStats.classes} />
          </div>
          <div className="class-dist">
            <p className="class-dist__title">Class Distribution</p>
            <div className="class-dist__bar">
              <div
                className="class-dist__positive"
                style={{
                  width: `${(datasetStats.classDistribution.positive / datasetStats.totalSamples) * 100}%`,
                }}
              >
                Positive ({((datasetStats.classDistribution.positive / datasetStats.totalSamples) * 100).toFixed(1)}%)
              </div>
              <div className="class-dist__negative">
                Negative
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-section dashboard-section--half">
          <h2 className="section-title">Confusion Matrix</h2>
          <div className="confusion-matrix">
            {cmCells.map((cell) => (
              <div
                key={cell.label}
                className={`cm-cell cm-cell--${cell.type}`}
              >
                <span className="cm-cell__label">{cell.label}</span>
                <span className="cm-cell__value">{cell.value.toLocaleString()}</span>
                <span className="cm-cell__pct">
                  {((cell.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="dashboard-section">
        <h2 className="section-title">Model Comparison</h2>
        <div className="models-table-wrapper">
          <table className="models-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Accuracy</th>
                <th>Training Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.name}>
                  <td>{model.name}</td>
                  <td>
                    <div className="accuracy-bar-wrapper">
                      <div
                        className="accuracy-bar"
                        style={{ width: `${model.accuracy * 100}%` }}
                      />
                      <span className="accuracy-label">
                        {(model.accuracy * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td>{model.trainTime}</td>
                  <td>
                    <span className={`status-badge status-badge--${model.status}`}>
                      {model.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
