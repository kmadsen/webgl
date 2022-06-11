import VectorN from "./vector"

/**
 * This represents a geometric surface. The dimensions
 * are similar to MatrixMxN so that it can be mapped.
 *
 * This structure is not optimized for memory access,
 * it is optimized for simple interfaces.
 *
 * Example of 2x2 surface indices
 * (0,0), (0,1)
 * (1,0), (1,1)
 */
class SurfaceMxN {
  m: number // rows
  n: number // columns

  private data: VectorN[]
  
  /**
   * Contruct a surface
   *
   * @param m number of rows 
   * @param n number of columns
   */
  constructor(m: number, n: number = m) {
    this.m = m
    this.n = n
    this.data = new Array<VectorN>(m * n)
  }

  /**
   * @param row index of the row
   * @param column index of the column
   * @returns the value from the matrix
   */
  getValue(row: number, column: number): VectorN {
    return this.data[row * this.n + column]
  }

  /**
   * @param row index of the row
   * @param column index of the column
   * @param value the value to set
   * @returns return this to chain operations 
   */
  setValue(row: number, column: number, value: VectorN): SurfaceMxN {
    this.data[row * this.n + column] = value
    return this
  }
 
  /**
   *
   * @param values the value to set
   * @returns return this to chain operations 
   */
  setValues(...values: VectorN[]): SurfaceMxN {
    values.forEach((value, index) => {
      this.data[index] = value
    })
    return this
  }

  /**
   * Apply a function on each element of the surface.
   * Transform each element with a new value.
   *
   * @param computefn apply function on the value
   * @returns return this to chain operations
   */
  transform(computefn: (value: VectorN, row: number, col: number) => VectorN): SurfaceMxN {
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        const index = i * this.n + j 
        this.data[index] = computefn(this.data[index], i, j)
      }
    }
    return this;
  }

  /**
   * Apply a function on each element of the surface.
   * Return a new surface with mapped elements.
   *
   * @param computefn apply function on the value
   * @returns return this to chain operations
   */
  map(computefn: (value: VectorN, row: number, col: number) => VectorN): SurfaceMxN {
    const result = new SurfaceMxN(this.m, this.n)
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        const index = i * this.n + j 
        result.data[index] = computefn(this.data[index], i, j)
      }
    }
    return result;
  }

  /**
   * Apply a function on each element of the surface.
   *
   * @param computefn apply function on the value
   * @returns return this to chain operations
   */
  forEach(computefn: (value: VectorN, row: number, col: number) => void): SurfaceMxN {
    const result = new SurfaceMxN(this.m, this.n)
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        const index = i * this.n + j 
        computefn(this.data[index], i, j)
      }
    }
    return result;
  }

  /**
   * Accumulate a value for the surface.
   *
   * @param callbackfn apply function on a value
   * @param initialValue the initial value for the reduce
   * @returns 
   */
  reduce<T>(
    callbackfn: (
      previousValue: T,
      currentValue: VectorN,
      currentRow: number,
      currentColumn: number
    ) => T, 
    initialValue: T
  ): T {
    let accumulated: T = initialValue
    this.forEach((value, row, column) => {
      accumulated = callbackfn(accumulated, value, row, column)
    })
    return accumulated;
  }

  /**
   * To help with debugging, get a string for the vector
   *
   * @returns a string
   */
  valuesString(): string {
    return [...Array(this.m)]
      .map((_, i) => i * this.n)
      .flatMap(rowIndex => {
        return this.data.slice(rowIndex, rowIndex + this.n)
          .map((value) => value.valuesString())
          .join("; ")
      })
      .join("\n")
  }

  /**
   * To help with debugging, get a string for the vector
   * with fixed decimal p
   *
   * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
   * @returns a string
   */
  valuesStringFixed(fractionDigits: number): string {
    return [...Array(this.m)]
      .map((_, i) => i * this.n)
      .flatMap(rowIndex => {
        return this.data.slice(rowIndex, rowIndex + this.n)
          .map((value) => value.valuesStringFixed(fractionDigits))
          .join("; ")
      })
      .join("\n")
  }
  

  /**
   * To help with debugging, log the surface to the console
   *
   * @returns return this to chain operations
   */
  log(): SurfaceMxN {
    console.log(`M:${this.m} N:${this.n}\n${this.valuesString()}`)
    return this
  }

  /**
   * To help with debugging, log the surface to the console with fixed
   * decimal p
   *
   * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
   * @returns return this to chain operations
   */
  logFixed(fractionDigits: number): SurfaceMxN {
    const valuesString = this.valuesStringFixed(fractionDigits)
    console.log(`M:${this.m} N:${this.n}\n${valuesString}`)
    return this
  }
}

export default SurfaceMxN