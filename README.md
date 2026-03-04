# DS-ML Dashboard

A Data Science and Machine Learning dashboard built with React and Vite.

## Features

- **Dashboard** — Overview of model performance metrics (Accuracy, Precision, Recall, F1 Score, AUC-ROC), dataset statistics, confusion matrix, and model comparison table.
- **Model Metrics** — Line charts for training/validation loss and accuracy over epochs, and a feature importance bar chart.
- **Visualization** — Interactive charts including a model accuracy bar chart, loss convergence area chart, and a feature importance radar chart.
- **Models** — Browse available ML models with selectable cards showing hyperparameters and training details.

![DS-ML Dashboard](https://github.com/user-attachments/assets/96798af0-a56f-491d-8f32-07ce17f0ba02)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Main overview panel
│   ├── DataVisualization.jsx  # Interactive charts
│   ├── Header.jsx             # Navigation header
│   ├── ModelMetrics.jsx       # Training history charts
│   └── Models.jsx             # Model list and detail view
├── data/
│   └── sampleData.js          # Sample ML metrics and model data
├── App.jsx                    # Root component with tab navigation
└── main.jsx                   # React entry point
```

