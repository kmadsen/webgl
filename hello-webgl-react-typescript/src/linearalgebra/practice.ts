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

/**
 * The columns will be linearly dependent if every column is not
 * a pivot column. If so, then the vectors will also have affine dependence.
 *
 * @param vector input vectors with the same dimension
 * @returns matrix in echelon form
 */
export function affineDependence(...vector: VectorN[]): MatrixMxN {
  const firstVector = vector[0]
  const result = new MatrixMxN(firstVector.n, vector.length - 1)
  for (let column = 1; column < vector.length; column++) {
    VectorFunc.subtract(vector[column], firstVector)
      .forEach((value, row) => {
        result.setValue(row, column - 1, value)
      })
  }
  return result.echelon()
}

/**
 * With basis vectors v[i], there are weights that make up the point such that
 * p = c[i]+v[i]. Note that there exists faster algorithms for known vector dimensions.
 * This can be used for larger vectors with hundreds of dimensions.
 *
 * Note that also, the VectorN.linearCombination function can do the same thing.
 *
 * @param basis vectors with identical dimension
 * @param point point vector with dimension of the basis
 * @returns the barycentric coordinates for the point on the basis
 */
export function barycentricCoordinates(basis: VectorN[], point: VectorN): VectorN {
  // Create a matrix where point is in the right most column.
  const matrix = new MatrixMxN(point.n, basis.length + 1)
  for (let column = 0; column < basis.length; column++) {
    basis[column].forEach((value, row) => {
      matrix.setValue(row, column, value)
    })
  }
  matrix.mapColumn(basis.length, row => point.get(row))

  // Reduce into echelon form and return the right most column.
  matrix.echelon().echelonReduced()
  return new VectorN(basis.length).map((_, index) =>
    matrix.getValue(index, matrix.n - 1)
  )
}