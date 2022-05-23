import VectorN, * as VectorFunc from "./vector";
import MatrixMxN, * as MatrixFunc from "./matrix";

/**
 * VectorN and MatrixMxN are calculating overlapping solutions.
 * This file is used to bring the two files together.
 *
 * Satisfies operations that work best with vectors and then
 * produce matrices. Or matrices that produces vectors.
 */

/**
 * B = V[i] - sampleMean(V[i])
 * S = 1/(N-1)BB^T
 * 
 * The resulting vector will be an NxN matrix where
 *   N is equal to the input vector.n
 * The diagonal values, result.getValue(i, i), represent the
 *   variance input vector[*].get(i).
 * The non diagonal values, result.getValue(i, j), represent
 *   the covariance. Positive shows correlation, negative shows
 *   inverse correlation, zero shows no correlation.
 * 
 * @param vector Column vectors for a matrix
 * @returns (sample) covariance matrix
 */
export function sampleCovariance(...vector: VectorN[]): MatrixMxN {
  // Find the mean vector
  const sampleMean: VectorN = VectorFunc.sampleMean(...vector);
  
  // Insert the difference between the vector and mean into a matrix
  const B: MatrixMxN = new MatrixMxN(vector[0].n, vector.length)
    .map((row, column) => vector[column].get(row) - sampleMean.get(row))
    
  // Calculate the (sample) covariance matrix
  return MatrixFunc.multiply(B, MatrixFunc.transpose(B))
    .multiply(1 / (vector.length - 1))
}