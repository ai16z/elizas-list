import * as jStat from 'jstat';
import { Matrix } from 'ml-matrix';
import { logger } from '../monitoring/logger';

export class StatisticalTesting {
  async performTests(
    data: Record<string, any>[],
    hypotheses: TestHypothesis[]
  ): Promise<TestResults> {
    const results = await Promise.all(
      hypotheses.map(async hypothesis => {
        const testResult = await this.runTest(data, hypothesis);
        const adjustedPValue = await this.adjustForMultipleTesting(
          testResult.pValue,
          hypotheses.length
        );

        return {
          ...testResult,
          adjustedPValue,
          significant: adjustedPValue < hypothesis.alpha
        };
      })
    );

    return {
      results,
      summary: this.generateTestingSummary(results),
      recommendations: this.generateRecommendations(results)
    };
  }

  private async runTest(
    data: Record<string, any>[],
    hypothesis: TestHypothesis
  ): Promise<TestResult> {
    try {
      switch (hypothesis.type) {
        case 'ttest':
          return this.performTTest(data, hypothesis);
        case 'anova':
          return this.performANOVA(data, hypothesis);
        case 'chi_square':
          return this.performChiSquare(data, hypothesis);
        case 'mann_whitney':
          return this.performMannWhitney(data, hypothesis);
        case 'regression':
          return this.performRegression(data, hypothesis);
        default:
          throw new Error(`Unsupported test type: ${hypothesis.type}`);
      }
    } catch (error) {
      logger.error('Error in statistical test:', error);
      throw error;
    }
  }

  private async performTTest(
    data: Record<string, any>[],
    hypothesis: TestHypothesis
  ): Promise<TestResult> {
    const { group1, group2 } = this.splitDataIntoGroups(data, hypothesis);
    const ttest = new jStat.ttest(group1, group2, hypothesis.tails);

    return {
      testType: 'ttest',
      statistic: ttest.statistic,
      pValue: ttest.pValue,
      effectSize: this.calculateCohenD(group1, group2),
      confidence: this.calculateConfidenceInterval(group1, group2)
    };
  }

  private async performRegression(
    data: Record<string, any>[],
    hypothesis: TestHypothesis
  ): Promise<TestResult> {
    const X = new Matrix(data.map(d => hypothesis.predictors.map(p => d[p])));
    const y = Matrix.columnVector(data.map(d => d[hypothesis.outcome]));

    const regression = new MLR(X, y);
    const results = regression.predict();

    return {
      testType: 'regression',
      coefficients: results.coefficients,
      rSquared: results.rSquared,
      adjustedRSquared: results.adjustedRSquared,
      fStatistic: results.fStatistic,
      pValue: results.pValue,
      residualAnalysis: await this.analyzeResiduals(results.residuals)
    };
  }
} 