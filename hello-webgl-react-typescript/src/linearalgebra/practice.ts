import VectorN, * as VectorFunc from "./vector";
import MatrixMxN, * as MatrixFunc from "./matrix";
import SurfaceMxN, * as SurfaceFunc from "./surface";

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
    .transform((_value, row, column) => vector[column].get(row) - sampleMean.get(row))

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
  matrix.transformColumn(basis.length, (_value, row) => point.get(row))

  // Reduce into echelon form and return the right most column.
  matrix.echelon().echelonReduced()
  return new VectorN(basis.length).transform((_, index) =>
    matrix.getValue(index, matrix.n - 1)
  )
}

/**
 * Copies the vectors into a matrix where each row is a vector
 * 
 * @param vectors input vectors
 * @returns matrix with vectors in row form
 */
export function vectorRowMatrix(...vectors: VectorN[]): MatrixMxN {
  return new MatrixMxN(vectors.length, vectors[0].n)
    .transform((_value, row, column) => {
      return vectors[row].get(column)
    })
}

/**
 * Copies the vectors into a matrix where each row is a column
 * 
 * @param vectors input vectors
 * @returns matrix with vectors in column form
 */
 export function vectorColumnMatrix(...vectors: VectorN[]): MatrixMxN {
  return new MatrixMxN(vectors[0].n, vectors.length)
    .transform((_value, row, column) => {
      return vectors[column].get(row)
    })
}

/**
 * Calculates a bezier curve between N points.
 *
 * @param t Time parameter between an inclusive [0,1].
 * @param points control points for the curve
 * @returns The point at the specified time
 */
export function bezierCurve(points: VectorN[], t: number): VectorN {
  const result = new VectorN(points[0].n)
  points.forEach((value, pindex) => {
    const weight = bezierCoefficient(points.length - 1, pindex, t)
    result.transform((dimension, dindex) => dimension + weight * value.get(dindex))
  })
  return result
}

/**
 * Calculates a derivative curve between N points. The direction vector is
 * N times longer than the direction vector. Calcuating the bezierCurve of
 * the derivative will provide the tangent of the orignal curve.
 *
 * @param points control points for the curve.
 * @returns the derivative curve
 */
export function bezierCurveDerivative(points: VectorN[]): VectorN[] {
  return Array(...Array(points.length - 1)).map((_value, index) => {
    const multiple = points.length - 1
    const direction = VectorFunc.subtract(points[index + 1], points[index])
    return direction.transform(value => multiple * value)
  })
}

/**
 * Calculates a bezier curve surface for an MxN points.
 *
 * @param u parameter between an inclusive [0,1].
 * @param v parameter between an inclusive [0,1].
 * @returns The point at the specified location
 */
export function bezierSurface(surface: SurfaceMxN, u: number, v: number): VectorN {
  const coefficentSurface = surface.map((_value, row, col) => {
    return VectorN.from(
      bezierCoefficient(surface.m - 1, row, u),
      bezierCoefficient(surface.n - 1, col, v)
    )
  })
  return surface.reduce((previous, current, row, column) => {
    const coefficent = coefficentSurface.getValue(row, column)
    const weight = coefficent.get(0) * coefficent.get(1)
    return previous.transform((dimension, dIndex) =>
      dimension + weight * current.get(dIndex)
    )
  }, new VectorN(surface.getValue(0, 0).n))
}

export function bezierSurfaceDerivativeU(surface: SurfaceMxN): SurfaceMxN {
  const um = surface.m - 1
  return new SurfaceMxN(um, surface.n)
    .transform((_value, row, col) => {
      const direction = VectorFunc.subtract(
        surface.getValue(row + 1, col), surface.getValue(row, col)
      )
      return direction.transform(value => um * value)
    })
}

export function bezierSurfaceDerivativeV(surface: SurfaceMxN): SurfaceMxN {
  const un = surface.n - 1
  return new SurfaceMxN(surface.m, un)
    .transform((_value, row, col) => {
      const direction = VectorFunc.subtract(
        surface.getValue(row, col + 1), surface.getValue(row, col)
      )
      return direction.transform(value => un * value)
    })
}

export function bezierCoefficient(n: number, i: number, u: number): number {
  const lhs = factorial(n) / (factorial(i) * factorial(n - i))
  const rhs = Math.pow(u, i) * Math.pow(1.0 - u, n - i)
  return lhs * rhs
}

const factorialMemoize: Record<number, number> = {
  0:1, 1:1, 2:2, 3:6, 4:24, 5:120, 6:720, 7:5040, 8:40320
}
function factorial(n: number): number {
  if (factorialMemoize[n]) {
    return factorialMemoize[n]
  } else {
    return factorialMemoize[n] = n * factorial(n - 1)
  }
}
