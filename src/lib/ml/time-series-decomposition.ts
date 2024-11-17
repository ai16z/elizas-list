import * as tf from '@tensorflow/tfjs-node';
import { STL } from 'time-series-decomposition';
import { WaveletTransform } from 'wavelets';
import { logger } from '../monitoring/logger';

export class TimeSeriesDecomposer {
  private readonly stl: STL;
  private readonly wavelet: WaveletTransform;

  constructor() {
    this.stl = new STL({
      periodicity: 24 * 7, // Weekly seasonality
      robustness: true,
      numberOfInnerLoops: 2,
      numberOfOuterLoops: 1,
      seasonalDegree: 1,
      trendDegree: 1,
      lowpassDegree: 1
    });
    
    this.wavelet = new WaveletTransform('db4'); // Daubechies 4 wavelet
  }

  async decompose(
    timeSeries: number[],
    config: DecompositionConfig
  ): Promise<DecompositionResult> {
    try {
      // Multiple decomposition methods for ensemble analysis
      const [
        stlResult,
        waveletResult,
        empiricalResult
      ] = await Promise.all([
        this.performSTLDecomposition(timeSeries, config),
        this.performWaveletDecomposition(timeSeries, config),
        this.performEMD(timeSeries)
      ]);

      // Combine results and analyze components
      const components = this.combineDecompositions(
        stlResult,
        waveletResult,
        empiricalResult
      );

      return {
        components,
        analysis: await this.analyzeComponents(components),
        seasonality: this.detectSeasonality(components),
        changepoints: await this.detectChangepoints(timeSeries, components),
        forecast: await this.generateComponentForecasts(components, config)
      };
    } catch (error) {
      logger.error('Error in time series decomposition:', error);
      throw error;
    }
  }

  private async performSTLDecomposition(
    timeSeries: number[],
    config: DecompositionConfig
  ): Promise<STLResult> {
    const result = await this.stl.fit(timeSeries);
    
    return {
      trend: result.trend,
      seasonal: result.seasonal,
      residual: result.residual,
      robustness: result.weights,
      diagnostics: this.calculateSTLDiagnostics(result)
    };
  }

  private async performWaveletDecomposition(
    timeSeries: number[],
    config: DecompositionConfig
  ): Promise<WaveletResult> {
    const levels = Math.min(
      Math.floor(Math.log2(timeSeries.length)),
      config.maxWaveletLevel || 5
    );

    const coefficients = this.wavelet.transform(timeSeries, levels);
    const components = this.reconstructWaveletComponents(coefficients, levels);

    return {
      components,
      coefficients,
      energyDistribution: this.calculateWaveletEnergy(coefficients),
      significance: await this.testWaveletSignificance(components)
    };
  }

  private async performEMD(timeSeries: number[]): Promise<EMDResult> {
    const imfs = await this.empiricalModeDecomposition(timeSeries);
    
    return {
      imfs,
      instantaneousFrequency: this.calculateInstantaneousFrequency(imfs),
      hilbertSpectrum: await this.computeHilbertSpectrum(imfs)
    };
  }

  private async detectChangepoints(
    timeSeries: number[],
    components: DecompositionComponents
  ): Promise<Changepoint[]> {
    // Multiple changepoint detection methods
    const [
      trendChangepoints,
      seasonalChangepoints,
      structuralBreaks
    ] = await Promise.all([
      this.detectTrendChangepoints(components.trend),
      this.detectSeasonalChangepoints(components.seasonal),
      this.detectStructuralBreaks(timeSeries)
    ]);

    return this.mergeChangepoints(
      trendChangepoints,
      seasonalChangepoints,
      structuralBreaks
    );
  }

  private async generateComponentForecasts(
    components: DecompositionComponents,
    config: DecompositionConfig
  ): Promise<ComponentForecasts> {
    const horizon = config.forecastHorizon || 30;

    return {
      trend: await this.forecastTrend(components.trend, horizon),
      seasonal: await this.forecastSeasonal(components.seasonal, horizon),
      combined: await this.generateCombinedForecast(components, horizon)
    };
  }
} 