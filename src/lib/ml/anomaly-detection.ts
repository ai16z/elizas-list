import * as tf from '@tensorflow/tfjs-node';
import { IsolationForest } from 'isolation-forest';
import { DBSCAN } from 'density-clustering';
import { logger } from '../monitoring/logger';

export class AnomalyDetector {
  private autoencoder: tf.LayersModel;
  private isolationForest: IsolationForest;
  private dbscan: DBSCAN;
  private readonly threshold: number = 0.95;

  constructor() {
    this.isolationForest = new IsolationForest({
      numberOfTrees: 100,
      maxSamples: 256,
      contamination: 0.1
    });

    this.dbscan = new DBSCAN();
  }

  async initialize() {
    await this.buildAutoencoder();
  }

  private async buildAutoencoder() {
    const encoder = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [50], units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'relu' })
      ]
    });

    const decoder = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 50, activation: 'sigmoid' })
      ]
    });

    this.autoencoder = tf.sequential({
      layers: [...encoder.layers, ...decoder.layers]
    });

    this.autoencoder.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError'
    });
  }

  async detectAnomalies(data: number[][]): Promise<AnomalyResult[]> {
    const results = await Promise.all([
      this.detectWithAutoencoder(data),
      this.detectWithIsolationForest(data),
      this.detectWithDBSCAN(data)
    ]);

    return this.ensembleResults(results);
  }

  private async detectWithAutoencoder(data: number[][]): Promise<number[]> {
    const tensor = tf.tensor2d(data);
    const reconstructed = this.autoencoder.predict(tensor) as tf.Tensor;
    const losses = tf.losses.meanSquaredError(tensor, reconstructed);
    return await losses.array();
  }

  private async detectWithIsolationForest(data: number[][]): Promise<number[]> {
    this.isolationForest.fit(data);
    return data.map(point => this.isolationForest.predict([point])[0]);
  }

  private detectWithDBSCAN(data: number[][]): number[] {
    const clusters = this.dbscan.run(data, 0.5, 3);
    const outliers = new Set(this.dbscan.noise);
    return data.map((_, index) => outliers.has(index) ? 1 : 0);
  }

  private ensembleResults(results: number[][]): AnomalyResult[] {
    return results[0].map((_, i) => {
      const score = (results[0][i] + results[1][i] + results[2][i]) / 3;
      return {
        index: i,
        score,
        isAnomaly: score > this.threshold,
        confidence: this.calculateConfidence(results.map(r => r[i]))
      };
    });
  }
} 