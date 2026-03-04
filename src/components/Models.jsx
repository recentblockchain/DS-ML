import { useState } from 'react'
import { models } from '../data/sampleData'
import './Models.css'

const hyperparams = {
  'Random Forest': {
    n_estimators: 200,
    max_depth: 12,
    min_samples_split: 4,
    max_features: 'sqrt',
  },
  'Gradient Boosting': {
    n_estimators: 150,
    learning_rate: 0.05,
    max_depth: 5,
    subsample: 0.8,
  },
  'Logistic Regression': {
    C: 1.0,
    solver: 'lbfgs',
    max_iter: 1000,
    penalty: 'l2',
  },
  'Neural Network': {
    layers: '128-64-32',
    dropout: 0.3,
    learning_rate: 0.001,
    optimizer: 'adam',
  },
  SVM: {
    C: 10.0,
    kernel: 'rbf',
    gamma: 'scale',
    probability: true,
  },
}

function Models() {
  const [selected, setSelected] = useState(null)

  const params = selected ? hyperparams[selected.name] : null

  return (
    <div className="models-view">
      <div className="models-list-panel">
        <h2 className="panel-title">Available Models</h2>
        <div className="models-cards">
          {models.map((model) => (
            <button
              key={model.name}
              className={`model-card ${selected?.name === model.name ? 'model-card--selected' : ''}`}
              onClick={() => setSelected(model)}
            >
              <div className="model-card__header">
                <span className="model-card__name">{model.name}</span>
                <span
                  className={`status-dot ${model.status === 'active' ? 'status-dot--active' : ''}`}
                />
              </div>
              <div className="model-card__stats">
                <span className="model-card__stat">
                  <span className="stat-label">Accuracy</span>
                  <span className="stat-val">{(model.accuracy * 100).toFixed(1)}%</span>
                </span>
                <span className="model-card__stat">
                  <span className="stat-label">Train Time</span>
                  <span className="stat-val">{model.trainTime}</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="model-detail-panel">
        {selected ? (
          <>
            <h2 className="panel-title">{selected.name}</h2>
            <div className="detail-accuracy">
              <div className="accuracy-circle">
                <span className="accuracy-circle__value">
                  {(selected.accuracy * 100).toFixed(1)}%
                </span>
                <span className="accuracy-circle__label">Accuracy</span>
              </div>
            </div>
            <div className="detail-section">
              <h3 className="detail-section__title">Hyperparameters</h3>
              <table className="params-table">
                <tbody>
                  {Object.entries(params).map(([key, value]) => (
                    <tr key={key}>
                      <td className="params-key">{key}</td>
                      <td className="params-value">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="detail-section">
              <h3 className="detail-section__title">Status</h3>
              <span
                className={`status-badge-lg ${
                  selected.status === 'active'
                    ? 'status-badge-lg--active'
                    : 'status-badge-lg--idle'
                }`}
              >
                {selected.status === 'active' ? '● Active' : '○ Idle'}
              </span>
            </div>
          </>
        ) : (
          <div className="detail-empty">
            <span className="detail-empty__icon">🤖</span>
            <p>Select a model to view its details</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Models
