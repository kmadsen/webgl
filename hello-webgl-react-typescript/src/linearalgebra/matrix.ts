/**
 * The Number.EPSILON is too small. These matrix algorithms
 * use a larger EPSILON.
 */
export const EPSILON = 1e-6;

class MatrixMxN {
  m: number // rows
  n: number // columns

  private data: Float32Array
  
  constructor(m: number, n: number = m) {
    this.m = m
    this.n = n
    this.data = new Float32Array(m * n)
  }

  clone(): MatrixMxN {
    const result = new MatrixMxN(this.m, this.n)
    result.data.set(this.data)
    return result
  }

  /**
   * Update this matrix to be the identity matrix
   */
  identity(): MatrixMxN {
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        const index = i * this.n + j 
        this.data[index] = i == j ? 1.0 : 0.0
      }
    }
    return this
  }

  /**
   * 
   * @param row index of the row
   * @param column index of the column
   * @returns the value from the matrix
   */
  getValue(row: number, column: number): number {
    return this.data[row * this.n + column]
  }

  /**
   * 
   * @param row index of the row
   * @param column index of the column
   * @param value the value to set
   * @returns return this to chain operations 
   */
  setValue(row: number, column: number, value: number): MatrixMxN {
    this.data[row * this.n + column] = value
    return this
  }

  /**
   * @param data
   * @returns return this to chain operations 
   */
  setValuesRowOrder(...values: number[]): MatrixMxN {
    this.data.set(values)
    return this
  }

  /**
   * @param row index of the row
   * @param values values for the row
   * @returns return this to chain operations 
   */
  setRow(row: number, ...values: number[]): MatrixMxN {
    values.forEach((value, index) => {
      this.data[row * this.n + index] = value
    })
    return this
  }

  /**
   * @param column index of the column
   * @param values values for the row
   * @returns return this to chain operations 
   */
  setColumn(column: number, ...values: number[]): MatrixMxN {
    values.forEach((value, index) => {
      this.data[index * this.n + column] = value
    })
    return this
  }

  setPartition(row: number, column: number, matrix: MatrixMxN): MatrixMxN {
    matrix.forEach((value, i, j) => {
      const index = (row + i) * this.n + column + j
      this.data[index] = value
    })
    return this
  }

  /**
   * Apply a function on each element of the matrix
   *
   * @param computefn apply function on the value
   * @returns return this to chain operations
   */
  forEach(computefn: (value: number, row: number, column: number) => void): MatrixMxN {
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        const index = i * this.n + j
        computefn(this.data[index], i, j)
      }
    }
    return this;
  }

  /**
   * Apply a function on each diagonal element of the matrix
   *
   * @param computefn apply function on the value
   * @returns return this to chain operations
   */
  forDiagonal(computefn: (value: number, index: number) => void): MatrixMxN {
    const dimension = Math.min(this.m, this.n);
    for (let i = 0; i < dimension; i++) {
      const index = i * this.n + i;
      computefn(this.data[index], i)
    }
    return this;
  }

  /**
   * Apply a function on each element of the matrix.
   * Update each element with a new value.
   *
   * @param computefn apply function on the value
   * @returns return this to chain operations
   */
  transform(computefn: (value: number, row: number, col: number) => number): MatrixMxN {
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        const index = i * this.n + j 
        this.data[index] = computefn(this.data[index], i, j)
      }
    }
    return this;
  }

    /**
   * @param row index of the row vector
   * @param computefn apply function on the value
   * @returns return this to chain operations 
   */
  transformRow(row: number, computefn: (value: number, column: number) => number): MatrixMxN {
    for (let j = 0; j < this.n; j++) {
      const index = row * this.n + j 
      this.data[index] = computefn(this.data[index], j)
    }
    return this;
  }

  /**
   * @param column index of the column vector 
   * @param computefn apply function on the value
   * @returns return this to chain operations
   */
  transformColumn(column: number, computefn: (value: number, row: number) => number): MatrixMxN {
    for (let i = 0; i < this.m; i++) {
      const index = i * this.n + column 
      this.data[index] = computefn(this.data[index], i)
    }
    return this;
  }

  /**
   * Apply a function on each diagonal element of the matrix.
   * This to help compute operations with the identity.
   *
   * @param computefn apply function on the value
   * @returns return this to chain operations
   */
  transformDiagonal(computefn: (value: number, index: number) => number): MatrixMxN {
    const dimension = Math.min(this.m, this.n);
    for (let i = 0; i < dimension; i++) {
      const index = i * this.n + i;
      this.data[index] = computefn(this.data[index], i)
    }
    return this;
  }

  /**
   * @param matrix the matrix to add
   * @returns return this to chain operations
   */
  add(matrix: MatrixMxN): MatrixMxN {
    this.transform((value, row, column) => value + matrix.getValue(row, column))
    return this
  }

  /**
   * @param matrix the matrix to subtract
   * @returns return this to chain operations
   */
  subtract(matrix: MatrixMxN): MatrixMxN {
    this.transform((value, row, column) => value - matrix.getValue(row, column))
    return this
  }

  /**
   * @param scalar multiply every value by a number
   * @returns return this to chain operations
   */
  multiply(scalar: number): MatrixMxN {
    this.transform(value => value * scalar)
    return this
  }

  /**
   * @param row index of the row vector
   * @param computefn apply function on the value
   * @returns return this to chain operations 
   */
  forRow(row: number, computefn: (value: number, column: number) => void): MatrixMxN {
    for (let j = 0; j < this.n; j++) {
      const index = row * this.n + j 
      computefn(this.data[index], j)
    }
    return this;
  }

  /**
   * @param column index of the column vector 
   * @param computefn apply function on the value
   * @returns return this to chain operations
   */
  forColumn(column: number, computefn: (value: number, row: number) => void): MatrixMxN {
    for (let i = 0; i < this.m; i++) {
      const index = i * this.n + column 
      computefn(this.data[index], i)
    }
    return this;
  }

  /**
   * Swaps the values between the two rows
   * 
   * @param row1 row index to swap 
   * @param row2 row index to swap
   */
  swapRows(row1: number, row2: number) {
    this.forRow(row1, (value, column) => {
      this.setValue(row1, column, this.getValue(row2, column))
      this.setValue(row2, column, value)
    })
  }

  /**
   * The row reduction algorithm to put this matrix into
   * echelon form. Note that it is expected that this matrix is
   * an augmented matrix.
   * 
   * @returns return this to chain operations
   */
  echelon(): MatrixMxN {
    // Step 1: Put the matrix into echelon form
    let pivotRow = 0
    for (let pivotColumn = 0; pivotColumn < this.n; pivotColumn++) {
      // Move zero values to the bottom.
      for (let row = pivotRow; row < this.m - 1; row++) {
        const value = this.getValue(row, pivotColumn)
        const valueBelow = this.getValue(row + 1, pivotColumn)
        if (value == 0 && valueBelow != 0) {
          this.swapRows(row, row + 1)
        }
      }

      // Reduce the column to have non zero pivot values
      let foundPivot = false;
      const pivotValue = this.getValue(pivotRow, pivotColumn)
      for (let row = pivotRow + 1; row < this.m; row++) {
        const value = this.getValue(row, pivotColumn)
        if (pivotValue != 0) {
          if (value != 0) {
            const multiple = -value / pivotValue
            this.transformRow(row, (rowValue, column) => {
              const pivotRowValue = this.getValue(pivotRow, column)
              const resultRowValue = rowValue + pivotRowValue * multiple
              return groom(resultRowValue)
            })
          }
          foundPivot = true
        }
      }

      if (foundPivot) pivotRow++
    }
    return this
  }

  /**
   * Reduces an echelon matrix
   *
   * @returns return this to chain operations
   */
  echelonReduced(): MatrixMxN {
    let pivotRow = this.m - 1
    for (let i = this.m - 1; i >= 0; i--) {
      const pivotColumn = this.data
        .slice(
          pivotRow * this.n,
          (pivotRow + 1) * this.n)
        .findIndex(value => value != 0.0)
      if (pivotColumn == -1) {
        pivotRow--
      } else {
        // We found a pivot, now reduce the row
        let value = this.getValue(pivotRow, pivotColumn)
        if (value != 1.0) {
          const multiple = 1 / value
          this.transformRow(pivotRow, rowValue => {
            return groom(rowValue * multiple)
          })
          value = this.getValue(pivotRow, pivotColumn)
        }

        // Plug in our known pivot value into the rows above
        for (let i = pivotRow - 1; i >= 0; i--) {
          const rowValue = this.getValue(i, pivotColumn)
          const multiple = -rowValue * value
          const vector = new Float32Array(this.n)
          this.forRow(pivotRow, (value, column) => {
            vector[column] = value
          })
          this.transformRow(i, (value, column) => {
            return groom(value + vector[column] * multiple)
          })
        }
        pivotRow--
      }
    }
    return this
  }

  /**
   * Assumed to be a square matrix or the result is undefined
   */
  determinant(): number {
    if (this.n == 2) {
      const a = this.data
      return a[0] * a[3] - a[1] * a[2]
    } else if (this.n == 3) {
      const a = this.data
      const b01 =  a[8] * a[4] - a[5] * a[7]
      const b11 = -a[8] * a[3] + a[5] * a[6]
      const b21 =  a[7] * a[3] - a[4] * a[6]
      return a[0] * b01 + a[1] * b11 + a[2] * b21;
    } else {
      const echelon = this.clone().echelon()
      let result = echelon.getValue(0, 0)
      for (let i = 1; i < this.n; i++) {
        result *= echelon.getValue(i, i)
      }
      return groom(result)
    }
  }

  /**
   * An iterative solution to find eigen values for a matrix provided
   * an eigen vector. This will return the results from each iteration.
   *
   * @param iteratons number of iterations to approximate the eigen vectors
   * @param eigenVector rough estimate for an initial eigen vector
   * @returns eigen vectors for each iteration of the powerMethod
   */
  powerMethod(iteratons: number, eigenVector: Float32Array): Array<Float32Array> {
    const nextVector = Float32Array.from(eigenVector)
    const tempVector = new Float32Array(eigenVector.length)
    return Array(...Array(iteratons)).map(() => {
      this.forColumn(0, (_value, row) => {
        let sum = 0.0
        nextVector.forEach((vectorValue, vectorIndex) => {
          sum += vectorValue * this.getValue(row, vectorIndex)
        })
        tempVector[row] = sum
      })
      const eigenValue = Math.max(...nextVector)
      nextVector.set(tempVector.map((value) => value / eigenValue))
      return Float32Array.from(nextVector)
    })
  }

  /**
   * An iterative solution to find more precise estimates for eigen values.
   * Each iteration will result in a more precise eigen vector.
   *
   * @param iterations number of iterations to approximate the eigen vectors
   * @param eigenValue initial rough estimate for a specific eigen value
   * @returns eigen vectors for each iteration of the powerMethod
   */
  inversePowerMethod(
    iterations: number,
    eigenValue: number
  ): Array<Float32Array> {
    const nextVector = new MatrixMxN(this.m, 1).transform(() => 1.0)
    return Array(...Array(iterations)).map(() => {
      const maximum = Math.max(...nextVector.data)
      nextVector.transform(value => value / maximum)
      const inversed = inverse(
        this.clone().transformDiagonal(value => {
          return value - eigenValue
        })
      )
      const yk = multiply(inversed, nextVector)
      nextVector.data.set(yk.data)
      return yk.data
    });
  }

  /**
   * To help with debugging, get a string for the matrix
   *
   * @returns a string
   */
  valuesString(): string {
    return [...Array(this.m)]
      .map((_, i) => i * this.n)
      .flatMap(rowIndex => {
        return this.data.slice(rowIndex, rowIndex + this.n).join(", ")
      })
      .join("\n")
  }

  /**
   * To help with debugging, get a string for the matrix
   * with fixed decimal p
   *
   * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
   * @returns a string
   */
  valuesStringFixed(fractionDigits: number): string {
    const rows = [...Array(this.m)]
      .map((_, i) => i * this.n)
      .flatMap(rowIndex => {
        const display: Array<string> = []
        this.data.slice(rowIndex, rowIndex + this.n)
          .forEach((value, index) => display[index] = value.toFixed(fractionDigits))
        return display.join(", ")
      })
      .join("\n")
    return `M:${this.m} N:${this.n}\n${rows}`
  }

  /**
   * To help with debugging, log the matrix to the console
   *
   * @returns return this to chain operations
   */
  log(): MatrixMxN {
    console.log(`M:${this.m} N:${this.n}\n${this.valuesString()}`)
    return this;
  }

  /**
   * To help with debugging, log the matrix to the console
   * with fixed decimal p
   *
   * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
   * @returns return this to chain operations
   */
  logFixed(fractionDigits: number): MatrixMxN {
    const valuesString = this.valuesStringFixed(fractionDigits)
    console.log(`M:${this.m} N:${this.n}\n${valuesString}`)
    return this;
  }
}

/**
 * Removes residual floating point error if a value is close to zero.
 *
 * @param value floating point value
 * @returns zero when the values is close to zero
 */
function groom(value: number): number {
  return Math.abs(value) < EPSILON ? 0.0 : value
}

/**
 * The row-column rule is to take the row of this matrix, and do a dot product
 * on the column of another matrix
 * 
 * @param rM matrix with vector on row r
 * @param r index into the rM matrix row
 * @param cM matrix with vector on column c
 * @param c index into the cM matrix column
 */
export function dot(rM: MatrixMxN, r: number, cM: MatrixMxN, c: number) {
  let sum = 0.0
  rM.forRow(r, (value, column) => {
    sum += value * cM.getValue(column, c)
  })
  return sum
}

/**
 * @param lhs left hand side matrix
 * @param rhs right hand side matrix
 * @returns new matrix result from multiplication
 */
export function multiply(lhs: MatrixMxN, rhs: MatrixMxN): MatrixMxN {
  const result = new MatrixMxN(lhs.m, rhs.n)
  result.transform((_value, row, column) => {
    return dot(lhs, row, rhs, column)
  })
  return result
}

/**
 * Transpose a matrix.
 * 
 * This is not an in-place transpose because that can be complicated.
 * https://en.wikipedia.org/wiki/In-place_matrix_transposition
 *
 * @param matrix to transpose
 * @returns the transposed matrix   
 */
export function transpose(matrix: MatrixMxN): MatrixMxN {
  return new MatrixMxN(matrix.n, matrix.m)
    .transform((_value, row, column) => matrix.getValue(column, row))
}

/**
 * Calculate the adjoint matrix. Expecting a square matrix, this
 * function will return the conjugate transpose which can be used
 * to determine the intervse of the matrix.
 *
 * @param matrix square matrix
 * @returns the conjugate transpose of the matrix
 */
export function adjoint(matrix: MatrixMxN): MatrixMxN {
  const result = matrix.clone()
  return result.forEach((_value, row, column) => {
    const cellMatrix = new MatrixMxN(matrix.m - 1)
      .transform((_value, cellRow, cellColumn) => matrix.getValue(
        cellRow >= row ? cellRow + 1 : cellRow,
        cellColumn >= column ? cellColumn + 1 : cellColumn
      ))
    const cellValue = Math.pow(-1, row + column) * cellMatrix.determinant()
    result.setValue(column, row, cellValue)
  })
}

/**
 * Find the inverse of a square matrix. If the determinant
 * of the matrix is zero, this function is undefined.
 *
 * @param matrix square matrix
 * @returns the inverse of the matrix
 */
export function inverse(matrix: MatrixMxN): MatrixMxN {
  const determinant = matrix.determinant()
  return adjoint(matrix).multiply(1.0 / determinant)
}

/**
 * Given two matrices with column vectors. Find the change-of-coordiantes
 * matrix that allows you to convert points from one basis to another.
 *
 * @param from column vectors that exist within a basis
 * @param to column vectors that exist within another basis
 */
export function changeOfCoordiantes(from: MatrixMxN, to: MatrixMxN): MatrixMxN {
  const augmented = new MatrixMxN(from.m, from.n + to.n)
  to.forEach((value, row, column) => augmented
    .setValue(row, column, value))
  from.forEach((value, row, column) => augmented
    .setValue(row, to.n + column, value))
  augmented.echelon().echelonReduced()

  return new MatrixMxN(from.m)
    .transform((_value, row, column) => augmented.getValue(row, to.n + column))
}

/**
 * Given a square stochastic matrix used for Markov Chains. This function
 * will give the steady-state vector. Solving for x where (P - I)x = 0
 *
 * @param matrix M * M probability matrix
 * @returns M * 1 steady state probability vector
 */
export function steadyState(matrix: MatrixMxN): MatrixMxN {
  const intermediate = new MatrixMxN(matrix.m, matrix.n + 1)
    .identity()
  matrix.forEach((value, row, column) => {
    const delta = value - intermediate.getValue(row, column)
    intermediate.setValue(row, column, delta)
  })
  intermediate.echelon().echelonReduced()

  let sum = 0.0
  return new MatrixMxN(matrix.m, 1)
    .transformColumn(0, (_value, index) => {
      const value = intermediate.getValue(index, matrix.n - 1)
      return value == 0 ? 1.0 : -value
    })
    .forColumn(0, value => sum += value)
    .transformColumn(0, value => value / sum)
}

export function quadratic(a: number, b: number, c: number): number[] {
  const discriminant = (b * b) - (4.0 * a * c)
  const rooted = Math.sqrt(discriminant)
  return [
    Math.fround((-b + rooted) / (2 * a)),
    Math.fround((-b - rooted) / (2 * a)),
  ]
}

export function vectorDot(lhs: Float32Array, rhs: Float32Array): number {
  let sum = 0.0
  lhs.forEach((value, index) => {
    sum += value * rhs[index].valueOf()
  })
  return sum
}

export default MatrixMxN
