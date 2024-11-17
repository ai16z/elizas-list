import * as tf from '@tensorflow/tfjs-node';
import { Prophet } from 'prophet-js';
import { arima } from 'statistics.js';
import { logger } from '../monitoring/logger';

export class TimeSeriesAnalyzer {
  private prophet: Prophet;
  private lstmModel: tf.LayersModel;

  constructor() {
    this.prophet = new Prophet({
      growth: 'linear',
      changepoints: null,
      n_changepoints: 25,
      yearly_seasonality: 'auto',
      weekly_seasonality: 'auto',
      daily_seasonality: 'auto'
    });
  }

  async forecast(
    historicalData: { timestamp: Date; value: number }[],
    horizon: number = 30
  ): Promise<{
    predictions: number[];
    confidence: { upper: number[]; lower: number[] };
    seasonality: any;
    changepoints: Date[];
  }> {
    try {
      // Prepare data for Prophet
      const df = historicalData.map(d => ({
        ds: d.timestamp,
        y: d.value
      }));

      // Fit Prophet model
      await this.prophet.fit(df);
      const forecast = await this.prophet.predict(horizon);

      // LSTM predictions
      const lstmPredictions = await this.getLSTMPredictions(historicalData, horizon);

      // ARIMA predictions
      const arimaPredictions = await this.getARIMAPredictions(historicalData, horizon);

      // Ensemble the predictions
      const ensemblePredictions = this.ensemblePredictions(
        forecast.yhat,
        lstmPredictions,
        arimaPredictions
      );

      return {
        predictions: ensemblePredictions,
        confidence: {
          upper: forecast.yhat_upper,
          lower: forecast.yhat_lower
        },
        seasonality: await this.prophet.get_seasonality(),
        changepoints: forecast.changepoints
      };
    } catch (error) {
      logger.error('Error in time series forecasting:', error);
      throw error;
    }
  }

  private async getLSTMPredictions(
    historicalData: { timestamp: Date; value: number }[],
    horizon: number
  ): Promise<number[]> {
    if (!this.lstmModel) {
      await this.trainLSTM(historicalData);
    }

    const sequence = this.prepareSequence(historicalData);
    const predictions = [];

    for (let i = 0; i < horizon; i++) {
      const prediction = this.lstmModel.predict(sequence) as tf.Tensor;
      predictions.push(await prediction.data());
      // Update sequence for next prediction
      sequence.shift();
      sequence.push(predictions[predictions.length - 1]);
    }

    return predictions;
  }

  private async trainLSTM(historicalData: { timestamp: Date; value: number }[]) {
    const sequences = this.prepareTrainingData(historicalData);
    
    this.lstmModel = tf.sequential({
      layers: [
        tf.layers.lstm({
          units: 50,
          returnSequences: true,
          inputShape: [30, 1]
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.lstm({ units: 50 }),
        tf.layers.dense({ units: 1 })
      ]
    });

    this.lstmModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });

    await this.lstmModel.fit(sequences.inputs, sequences.outputs, {
      epochs: 100,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          logger.info(`LSTM Epoch ${epoch}: loss = ${logs?.loss}`);
        }
      }
    });
  }

  private async getARIMAPredictions(
    historicalData: { timestamp: Date; value: number }[],
    horizon: number
  ): Promise<number[]> {
    const values = historicalData.map(d => d.value);
    const model = new arima({
      p: 2,
      d: 1,
      q: 2,
      verbose: false
    });

    await model.fit(values);
    return model.predict(horizon);
  }

  private ensemblePredictions(
    prophetPreds: number[],
    lstmPreds: number[],
    arimaPreds: number[]
  ): number[] {
    // Weighted average of all predictions
    const weights = [0.4, 0.4, 0.2]; // Prophet, LSTM, ARIMA
    return prophetPreds.map((_, i) => 
      prophetPreds[i] * weights[0] +
      lstmPreds[i] * weights[1] +
      arimaPreds[i] * weights[2]
    );
  }
} 