import assert from "node:assert";

/**
 * The Number.EPSILON is too small. These matrix algorithms
 * use a larger EPSILON.
 */
const EPSILON = 1e-6;

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
    matrix.forEach((i, j, value) => {
      const index = (row + i) * this.n + column + j
      this.data[index] = value
    })
    return this
  }

  /**
   * Apply a function on each element of the matrix
   *
   * @param compute apply function on the value
   * @returns return this to chain operations
   */
  forEach(compute: (row: number, column: number, value: number) => void): MatrixMxN {
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        const index = i * this.n + j 
        compute(i, j, this.data[index])
      }
    }
    return this;
  }

  /**
   * Apply a function on each element of the matrix. Update each element with a new value.
   *
   * @param compute apply function on the value
   * @returns return this to chain operations
   */
  map(compute: (row: number, col: number, value: number) => number): MatrixMxN {
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        const index = i * this.n + j 
        this.data[index] = compute(i, j, this.data[index])
      }
    }
    return this;
  }

    /**
   * @param row index of the row vector
   * @param compute apply function on the value
   * @returns return this to chain operations 
   */
  mapRow(row: number, compute: (column: number, value: number) => number): MatrixMxN {
    for (let j = 0; j < this.n; j++) {
      const index = row * this.n + j 
      this.data[index] = compute(j, this.data[index])
    }
    return this;
  }

  /**
   * @param column index of the column vector 
   * @param compute apply function on the value
   * @returns return this to chain operations
   */
  mapColumn(column: number, compute: (row: number, value: number) => number): MatrixMxN {
    for (let i = 0; i < this.m; i++) {
      const index = i * this.n + column 
      this.data[index] = compute(i, this.data[index])
    }
    return this;
  }

  /**
   * @param matrix the matrix to add
   * @returns return this to chain operations
   */
  add(matrix: MatrixMxN): MatrixMxN {
    this.map((row, column, value) => value + matrix.getValue(row, column))
    return this
  }

  /**
   * @param matrix the matrix to subtract
   * @returns return this to chain operations
   */
  subtract(matrix: MatrixMxN): MatrixMxN {
    this.map((row, column, value) => value - matrix.getValue(row, column))
    return this
  }

    /**
   * @param matrix the matrix to subtract
   * @returns return this to chain operations
   */
  multiply(scalar: number): MatrixMxN {
    this.map((_row, _column, value) => value * scalar)
    return this
  }

  /**
   * @param row index of the row vector
   * @param compute apply function on the value
   * @returns return this to chain operations 
   */
  forRow(row: number, compute: (column: number, value: number) => void): MatrixMxN {
    for (let j = 0; j < this.n; j++) {
      const index = row * this.n + j 
      compute(j, this.data[index])
    }
    return this;
  }

  /**
   * @param column index of the column vector 
   * @param compute apply function on the value
   * @returns return this to chain operations
   */
  forColumn(column: number, compute: (row: number, value: number) => void): MatrixMxN {
    for (let i = 0; i < this.m; i++) {
      const index = i * this.n + column 
      compute(i, this.data[index])
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
    this.forRow(row1, (column, value) => {
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
      // Move non-non zero values to the bottom.
      this.forColumn(pivotColumn, (row, value) => {
        if (row >= pivotColumn && value != 0) {
          const valueAbove = this.getValue(row - 1, pivotColumn)
          if (valueAbove == 0) {
            this.swapRows(row, row - 1)
          }
        }
      })

      // Reduce the column to have non zero pivot values
      let foundPivot = false;
      const pivotValue = this.getValue(pivotRow, pivotColumn)
      this.forColumn(pivotColumn, (row, value) => {
        if (row > pivotRow && pivotValue != 0) {
          if (value != 0) {
            const multiple = -value / pivotValue
            this.mapRow(row, (column, rowValue) => {
              const pivotRowValue = this.getValue(pivotRow, column)
              const resultRowValue = rowValue + pivotRowValue * multiple
              return this.groom(resultRowValue)
            })
          }
          foundPivot = true
        }
      })

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
          this.mapRow(pivotRow, (_, rowValue) => {
            return this.groom(rowValue * multiple)
          })
          value = this.getValue(pivotRow, pivotColumn)
        }

        // Plug in our known pivot value into the rows above
        for (let i = pivotRow - 1; i >= 0; i--) {
          const rowValue = this.getValue(i, pivotColumn)
          const multiple = -rowValue * value
          const vector = new Float32Array(this.n)
          this.forRow(pivotRow, (column, value) => {
            vector[column] = value
          })
          this.mapRow(i, (column, value) => {
            return this.groom(value + vector[column] * multiple)
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
    assert(this.m == this.n)
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
      return this.groom(result)
    }
  }

  /**
   * To help with debugging, log the matrix to the console
   *
   * @returns return this to chain operations
   */
  log(): MatrixMxN {
    const rows = [...Array(this.m)]
      .map((_, i) => i * this.n)
      .flatMap(rowIndex => {
        return this.data.slice(rowIndex, rowIndex + this.n).join(", ")
      })
      .join("\n")
    console.log(`M:${this.m} N:${this.n}\n${rows}`)
    return this;
  }

  /**
   * To help with debugging, log the matrix to the console with fixed
   * decimal p
   *
   * @param fixed call toFixed on each element
   * @returns return this to chain operations
   */
  logFixed(fixed: number): MatrixMxN {
    const rows = [...Array(this.m)]
      .map((_, i) => i * this.n)
      .flatMap(rowIndex => {
        const display: Array<string> = []
        this.data.slice(rowIndex, rowIndex + this.n)
          .forEach((value, index) => display[index] = value.toFixed(fixed))
        return display.join(", ")
      })
      .join("\n")
    console.log(`M:${this.m} N:${this.n}\n${rows}`)
    return this;
  }

  private groom(value: number): number {
    return Math.abs(value) < EPSILON ? 0.0 : value
  }
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
  rM.forRow(r, (column: number, value: number) => {
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
  result.map((row, column) => {
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
    .map((row, column) => matrix.getValue(column, row))
}

/**
 * Given two matrices with column vectors. Find the change-of-coordiantes
 * matrix that allows you to convert points from one basis to another.
 *
 * @throws when from.m is not equal to to.m
 * @param from column vectors that exist within a basis
 * @param to column vectors that exist within another basis
 */
export function changeOfCoordiantes(from: MatrixMxN, to: MatrixMxN): MatrixMxN {
  assert(from.m == to.m)

  const augmented = new MatrixMxN(from.m, from.n + to.n)
  to.forEach((row, column, value) => augmented
    .setValue(row, column, value))
  from.forEach((row, column, value) => augmented
    .setValue(row, to.n + column, value))
  augmented.echelon().echelonReduced()

  return new MatrixMxN(from.m)
    .map((row, column) => augmented.getValue(row, to.n + column))
}

export default MatrixMxN