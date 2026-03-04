export const modelMetrics = {
  accuracy: 0.924,
  precision: 0.911,
  recall: 0.938,
  f1Score: 0.924,
  auc: 0.967,
};

export const trainingHistory = [
  { epoch: 1, trainLoss: 0.82, valLoss: 0.85, trainAcc: 0.61, valAcc: 0.59 },
  { epoch: 2, trainLoss: 0.65, valLoss: 0.69, trainAcc: 0.73, valAcc: 0.71 },
  { epoch: 3, trainLoss: 0.51, valLoss: 0.55, trainAcc: 0.81, valAcc: 0.79 },
  { epoch: 4, trainLoss: 0.41, valLoss: 0.46, trainAcc: 0.86, valAcc: 0.84 },
  { epoch: 5, trainLoss: 0.34, valLoss: 0.40, trainAcc: 0.88, valAcc: 0.87 },
  { epoch: 6, trainLoss: 0.29, valLoss: 0.35, trainAcc: 0.90, valAcc: 0.89 },
  { epoch: 7, trainLoss: 0.25, valLoss: 0.31, trainAcc: 0.91, valAcc: 0.90 },
  { epoch: 8, trainLoss: 0.22, valLoss: 0.29, trainAcc: 0.92, valAcc: 0.91 },
  { epoch: 9, trainLoss: 0.20, valLoss: 0.27, trainAcc: 0.93, valAcc: 0.92 },
  { epoch: 10, trainLoss: 0.18, valLoss: 0.26, trainAcc: 0.94, valAcc: 0.92 },
];

export const featureImportance = [
  { feature: 'age', importance: 0.18 },
  { feature: 'income', importance: 0.24 },
  { feature: 'credit_score', importance: 0.31 },
  { feature: 'employment_years', importance: 0.12 },
  { feature: 'debt_ratio', importance: 0.15 },
];

export const datasetStats = {
  totalSamples: 12480,
  trainSamples: 9984,
  testSamples: 2496,
  features: 14,
  classes: 2,
  classDistribution: { positive: 4243, negative: 8237 },
};

export const confusionMatrix = {
  truePositive: 1182,
  falsePositive: 112,
  falseNegative: 77,
  trueNegative: 1125,
};

export const models = [
  { name: 'Random Forest', accuracy: 0.924, trainTime: '2.4s', status: 'active' },
  { name: 'Gradient Boosting', accuracy: 0.918, trainTime: '5.1s', status: 'idle' },
  { name: 'Logistic Regression', accuracy: 0.871, trainTime: '0.3s', status: 'idle' },
  { name: 'Neural Network', accuracy: 0.931, trainTime: '18.7s', status: 'idle' },
  { name: 'SVM', accuracy: 0.896, trainTime: '3.2s', status: 'idle' },
];
