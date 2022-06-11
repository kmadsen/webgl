import { EPSILON } from "./matrix"

class VectorN {
  n: number // values

  private data: Float32Array

  constructor(n: number) {
    this.n = n
    this.data = new Float32Array(n)
  }

  static from(...values: number[]): VectorN {
    return new VectorN(values.length).set(...values)
  }

  clone(): VectorN {
    const result = new VectorN(this.n)
    result.data.set(this.data)
    return result
  }

  copy(other: VectorN): VectorN {
    this.data.set(other.data)
    return this
  }

  set(...values: number[]): VectorN {
    this.data.set(values)
    return this
  }

  setValue(index: number, value: number): VectorN {
    this.data[index] = value
    return this
  }

  setData(data: Float32Array): VectorN {
    this.data = data
    return this
  }

  getData(): Float32Array {
    return this.data
  }

  get(index: number): number {
    return this.data[index]
  }

  forEach(compute: (value: number, index: number) => void): VectorN {
    for (let i = 0; i < this.n; i++) {
      compute(this.data[i], i)
    }
    return this;
  }

  valuesEqual(other: VectorN, error = 0.0) {
    const equalDimension = this.n == other.n
    if (!equalDimension) {
      return false
    }
    for (let i = 0; i < this.n; i++) {
      const actualError = Math.abs(this.data[i] - other.data[i])
      if (Number.isNaN(actualError) || actualError > error) {
        return false
      }
    }
    return true;
  }

  map(compute: (value: number, index: number) => number): VectorN {
    this.data.forEach((value, index) => {
      this.data[index] = compute(value, index)
    })
    return this;
  }

  zip(other: VectorN, compute: (lhs: number, rhs: number, index: number) => number): VectorN {
    return this.clone().map((zipValue, zipIndex) => {
      return compute(zipValue, other.data[zipIndex], zipIndex)
    })
  }

  dot(other: VectorN): number {
    return this.data.reduce((previous, current, index) => {
      return previous + current * other.data[index]
    }, 0.0)
  }

  magnitude(): number {
    return Math.sqrt(this.dot(this))
  }

  normalize(): VectorN {
    const magnitude = this.magnitude()
    return this.map(value => value / magnitude)
  }

  /**
   * To help with debugging, get a string for the vector
   *
   * @returns a string
   */
  valuesString(): string {
    return this.data.join(", ")
  }

  /**
   * To help with debugging, get a string for the vector
   * with fixed decimal p
   *
   * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
   * @returns a string
   */
  valuesStringFixed(fractionDigits: number): string {
    const display: Array<string> = []
    this.data.forEach((value, index) =>
      display[index] = value.toFixed(fractionDigits)
    )
    return display.join(", ")
  }

  /**
   * To help with debugging, log the matrix to the console
   *
   * @returns return this to chain operations
   */
  log(): VectorN {
    console.log(`N:${this.n}\n${this.valuesString()}`)
    return this;
  }

  /**
   * To help with debugging, log the matrix to the console with fixed
   * decimal p
   *
   * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
   * @returns return this to chain operations
   */
  logFixed(fractionDigits: number): VectorN {
    const valuesString = this.valuesStringFixed(fractionDigits)
    console.log(`N:${this.n}\n${valuesString}`)
    return this;
  }
}

export function add(...vector: VectorN[]): VectorN {
  const result = new VectorN(vector[0].n)
  vector.forEach((currentVector) =>
    result.map((value, index) => value + currentVector.get(index))
  )
  return result
}

/**
 * @param u left hand side vector
 * @param v right hand side vector
 * @returns a vector where result[i] = u[i] - v[i]
 */
export function subtract(u: VectorN, v: VectorN): VectorN {
  return u.zip(v, (lhs, rhs) => lhs - rhs)
}

/**
 * Limited to 3 dimensional vectors. The handy cross product.
 */
 export function crossProduct(lhs: VectorN, rhs: VectorN): VectorN {
  if (lhs.n == 3 && rhs.n == 3) {
    const a = lhs.getData()
    const b = rhs.getData()
    return VectorN.from(
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    )
  } else {
    throw Error(`crossProduct for 3-d only: ${lhs.n}, ${rhs.n}`)
  }
}

export function distance(u: VectorN, v: VectorN): number {
  return subtract(u, v).magnitude()
}

/**
 * Given a set of basis vectors, and a vector within the basis. Return
 * the linear combination. That is, the resulting vector describes how
 * the input vector can be described by the basis.
 *
 * You can use multiplyWeights to get the vector back.
 *  const weights = linearCombination(basis, vector)
 *  vector == multiplyWeights(basis, weights).
 *
 * It is assumed that basis.length == vector.n
 *
 * @param basis set of basis vectors
 * @param vector a vector within the basis
 * @returns vector of constant weights
 */
export function linearCombination(basis: VectorN[], vector: VectorN): VectorN {
  const weights = basis.map(u => vector.dot(u) / u.dot(u))
  return VectorN.from(...weights)
}

/**
 * Given a set of vectors, and a vector of weights. Return the
 * result of multiplying each vector by its corresponding weight.
 *
 * It is assumed that vectors.length == weights.n
 *
 * @param vectors set of vectors
 * @param weights a vector representing weights for each vector
 * @returns resulting vector of input vectors multiplied by their weights
 */
export function multiplyWeights(vectors: VectorN[], weights: VectorN): VectorN {
  const result = vectors.map((value, index) => {
    return value.clone().map(value => weights.get(index) * value)
  })
  return add(...result)
}

/**
 * Project a vector onto another vector. The resulting vector will
 * be in the same direction as the `to` vector, with a magnitude
 * that makes it perpendicular to the `from` vector.
 *
 * @param basis the vector to project onto
 * @param vector the vector being projected
 * @returns vector projected onto the basis
 */
export function project(basis: VectorN, vector: VectorN): VectorN {
  const denominator = basis.dot(basis)
  if (denominator < EPSILON){
    return new VectorN(basis.n).map(() => 0.0)
  }
  const scale = vector.dot(basis) / denominator
  return basis.clone().map(value => scale * value)
}

/**
 * Using the Gram-Schmidt Process, project each vector to create
 * an orthogonal basis.
 *
 * @param vectors input vectors
 * @returns reconstructed vectors representing orthogonal basis
 */
export function constructOrthogonalBasis(...vectors: VectorN[]): VectorN[] {
  const orthogonalBasis: VectorN[] = []
  for (let i = 0; i < vectors.length; i++) {
    orthogonalBasis[i] = vectors[i].clone()
    for (let j = 0; j < i; j++) {
      const projected = project(orthogonalBasis[j], vectors[i])
      orthogonalBasis[i] = subtract(orthogonalBasis[i], projected)
    }
  }
  return orthogonalBasis.filter(vector => {
    let foundNonZero = false
    vector.forEach(value => foundNonZero = foundNonZero || value != 0.0)
    return foundNonZero
  })
}

/**
 * Sample mean is an average of all the vectors, result is a single
 * vector with the same dimension.
 *
 * @param vector list of vectors with the same dimension
 * @returns input vectors added together and divided by the length
 */
export function sampleMean(...vector: VectorN[]): VectorN {
  const fraction = 1.0 / vector.length
  return add(...vector).map(value => value * fraction)
}

export default VectorN