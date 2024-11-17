import * as tf from '@tensorflow/tfjs-node';
import { Matrix } from 'ml-matrix';
import { logger } from '../monitoring/logger';

export class CollaborativeFilter {
  private userFactors: tf.Tensor2D | null = null;
  private projectFactors: tf.Tensor2D | null = null;
  private readonly numFactors: number = 50;

  async trainModel(interactions: UserProjectInteraction[]) {
    try {
      // Create sparse interaction matrix
      const { matrix, userIndex, projectIndex } = this.createInteractionMatrix(interactions);
      
      // Matrix factorization using SVD
      const svd = new Matrix(matrix).svd();
      
      this.userFactors = tf.tensor2d(svd.U.slice(0, this.numFactors));
      this.projectFactors = tf.tensor2d(svd.V.slice(0, this.numFactors));

      return {
        userIndex,
        projectIndex,
        error: this.calculateRMSE(matrix, this.userFactors, this.projectFactors)
      };
    } catch (error) {
      logger.error('Error training collaborative filter:', error);
      throw error;
    }
  }

  async getRecommendations(userId: string, n: number = 10): Promise<RecommendedProject[]> {
    if (!this.userFactors || !this.projectFactors) {
      throw new Error('Model not trained');
    }

    const userVector = await this.getUserVector(userId);
    const predictions = tf.matMul(userVector, this.projectFactors.transpose());
    
    const scores = await predictions.array();
    const topIndices = this.getTopK(scores[0], n);

    return this.getProjectDetails(topIndices);
  }

  async getSimilarProjects(projectId: string, n: number = 5): Promise<RecommendedProject[]> {
    const projectVector = await this.getProjectVector(projectId);
    const similarities = this.calculateCosineSimilarity(projectVector, this.projectFactors);
    
    const scores = await similarities.array();
    const topIndices = this.getTopK(scores, n + 1).slice(1); // Exclude self

    return this.getProjectDetails(topIndices);
  }

  private calculateCosineSimilarity(vector: tf.Tensor2D, matrix: tf.Tensor2D): tf.Tensor1D {
    const normVector = tf.norm(vector);
    const normMatrix = tf.norm(matrix, 2, 1);
    const dot = tf.matMul(vector, matrix.transpose());
    return tf.div(dot.squeeze(), tf.mul(normVector, normMatrix));
  }
} 