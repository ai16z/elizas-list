import * as tf from '@tensorflow/tfjs-node';
import { EvolutionaryOptimizer } from './evolutionary-optimizer';
import { logger } from '../monitoring/logger';

export class NeuralArchitectureSearch {
  private optimizer: EvolutionaryOptimizer;
  private readonly searchSpace: SearchSpace;
  private readonly maxTrials: number;

  constructor(config: NASConfig) {
    this.searchSpace = this.defineSearchSpace(config);
    this.maxTrials = config.maxTrials || 100;
    this.optimizer = new EvolutionaryOptimizer(this.searchSpace);
  }

  async search(
    data: { x: tf.Tensor; y: tf.Tensor },
    validationData: { x: tf.Tensor; y: tf.Tensor }
  ): Promise<NASResult> {
    try {
      const population = await this.initializePopulation();
      let bestArchitecture = null;
      let bestPerformance = -Infinity;

      for (let trial = 0; trial < this.maxTrials; trial++) {
        const architectures = this.optimizer.evolvePopulation(population);
        
        const results = await Promise.all(
          architectures.map(arch => this.evaluateArchitecture(
            arch,
            data,
            validationData
          ))
        );

        // Update population and best architecture
        this.optimizer.updatePopulation(results);
        const currentBest = this.findBestArchitecture(results);
        
        if (currentBest.performance > bestPerformance) {
          bestArchitecture = currentBest.architecture;
          bestPerformance = currentBest.performance;
        }

        await this.logSearchProgress(trial, results);
      }

      return {
        bestArchitecture,
        performance: bestPerformance,
        searchHistory: this.optimizer.getSearchHistory(),
        analysis: await this.analyzeSearchResults()
      };
    } catch (error) {
      logger.error('Error in neural architecture search:', error);
      throw error;
    }
  }

  private defineSearchSpace(config: NASConfig): SearchSpace {
    return {
      numLayers: { min: 1, max: 10 },
      layerSizes: { min: 32, max: 512, step: 32 },
      activations: ['relu', 'elu', 'selu', 'tanh'],
      dropoutRates: { min: 0, max: 0.5, step: 0.1 },
      optimizers: ['adam', 'rmsprop', 'sgd'],
      learningRates: { min: 1e-4, max: 1e-1, log: true },
      batchNorm: [true, false],
      skipConnections: [true, false],
      attentionLayers: [true, false]
    };
  }

  private async evaluateArchitecture(
    architecture: NeuralArchitecture,
    data: { x: tf.Tensor; y: tf.Tensor },
    validationData: { x: tf.Tensor; y: tf.Tensor }
  ): Promise<ArchitectureEvaluation> {
    const model = this.buildModel(architecture);
    
    // Train with early stopping and learning rate scheduling
    const history = await model.fit(data.x, data.y, {
      epochs: 50,
      validationData: [validationData.x, validationData.y],
      callbacks: this.createTrainingCallbacks()
    });

    const evaluation = await model.evaluate(
      validationData.x,
      validationData.y
    );

    return {
      architecture,
      performance: this.calculatePerformanceMetric(evaluation, history),
      complexity: this.calculateArchitectureComplexity(architecture),
      trainingTime: history.totalTime,
      memory: await this.estimateMemoryUsage(model)
    };
  }

  private createTrainingCallbacks(): tf.Callback[] {
    return [
      tf.callbacks.earlyStopping({
        monitor: 'val_loss',
        patience: 5
      }),
      tf.callbacks.learningRateScheduler((epoch, lr) => {
        return lr * (0.95 ** epoch);
      })
    ];
  }
} 