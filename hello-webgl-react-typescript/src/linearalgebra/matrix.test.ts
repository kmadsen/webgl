import MatrixMxN, * as MatrixFunc from "./matrix";

test ('create m by n matrix', () => {
  const matrix = new MatrixMxN(3, 4)
  
  expect(matrix.m).toBe(3)
  expect(matrix.n).toBe(4)
})

test ('create identity matrix', () => {
  const matrix = new MatrixMxN(3, 3).identity()
  
  expect(matrix.getValue(0, 0)).toBe(1.0)
  expect(matrix.getValue(0, 1)).toBe(0.0)
  expect(matrix.getValue(0, 2)).toBe(0.0)
  expect(matrix.getValue(1, 0)).toBe(0.0)
  expect(matrix.getValue(1, 1)).toBe(1.0)
  expect(matrix.getValue(1, 2)).toBe(0.0)
  expect(matrix.getValue(2, 0)).toBe(0.0)
  expect(matrix.getValue(2, 1)).toBe(0.0)
  expect(matrix.getValue(2, 2)).toBe(1.0)
})

test ('transform to values', () => {
  const matrix = new MatrixMxN(3, 3).identity()

  matrix
    .transform((_value, row, col) => row + col)
    .transform(value => value + 2)
  
  expect(matrix.getValue(0, 0)).toBe(2.0)
  expect(matrix.getValue(0, 1)).toBe(3.0)
  expect(matrix.getValue(0, 2)).toBe(4.0)
  expect(matrix.getValue(1, 0)).toBe(3.0)
  expect(matrix.getValue(1, 1)).toBe(4.0)
  expect(matrix.getValue(1, 2)).toBe(5.0)
  expect(matrix.getValue(2, 0)).toBe(4.0)
  expect(matrix.getValue(2, 1)).toBe(5.0)
  expect(matrix.getValue(2, 2)).toBe(6.0)
})

test ('multiply matrices', () => {
  const lhs = new MatrixMxN(2, 3)
  const rhs = new MatrixMxN(3, 2)
  lhs.setValue(0, 0, 1)
  lhs.setValue(0, 1, 2)
  lhs.setValue(0, 2, 3)
  lhs.setValue(1, 0, 4)
  lhs.setValue(1, 1, 5)
  lhs.setValue(1, 2, 6)
  rhs.setValue(0, 0, 7)
  rhs.setValue(0, 1, 8)
  rhs.setValue(1, 0, 9)
  rhs.setValue(1, 1, 10)
  rhs.setValue(2, 0, 11)
  rhs.setValue(2, 1, 12)

  const result = MatrixFunc.multiply(lhs, rhs)

  expect(result.m).toBe(2)
  expect(result.n).toBe(2)
  expect(result.getValue(0, 0)).toBe(58)
  expect(result.getValue(0, 1)).toBe(64)
  expect(result.getValue(1, 0)).toBe(139)
  expect(result.getValue(1, 1)).toBe(154)
})

test ('setting rows and columns', () => {
  const lhs = new MatrixMxN(3, 5)
    .setRow(0, 2, -3,  1, 0, -4)
    .setRow(1, 1,  5, -2, 3, -1)
    .setRow(2, 0, -4, -2, 7, -1)
  const rhs = new MatrixMxN(5, 2)
    .setColumn(0, 6, -2, -3, -1, 5)
    .setColumn(1, 4,  1,  7,  3, 2)

  const result = MatrixFunc.multiply(lhs, rhs)

  expect(result.m).toBe(3)
  expect(result.n).toBe(2)
  expect(result.getValue(0, 0)).toBe(-5)
  expect(result.getValue(0, 1)).toBe(4)
  expect(result.getValue(1, 0)).toBe(-6)
  expect(result.getValue(1, 1)).toBe(2)
  expect(result.getValue(2, 0)).toBe(2)
  expect(result.getValue(2, 1)).toBe(1)
})

test ('forDiagonal should iterate the diagonal values', () => {
  const matrix = new MatrixMxN(3).setValuesRowOrder(
    -1, 1, 2,
    3, -2, 4,
    5, 6, -3
  )

  const computefn = jest.fn()
  matrix.forDiagonal(computefn)

  expect(computefn).toBeCalledWith(-1, 0)
  expect(computefn).toBeCalledWith(-2, 1)
  expect(computefn).toBeCalledWith(-3, 2)
})

test ('combine partitioned matrices', () => {
  const lhs00 = new MatrixMxN(2, 3)
    .setRow(0, 2, -3,  1)
    .setRow(1, 1,  5, -2)
  const lhs01 = new MatrixMxN(2, 2)
    .setRow(0, 0, -4)
    .setRow(1, 3, -1)
  const lhs10 = new MatrixMxN(1, 3)
    .setRow(0, 0, -4, -2)
  const lhs11 = new MatrixMxN(1, 2)
    .setRow(0, 7, -1)
  const rhs00 = new MatrixMxN(3, 2)
    .setColumn(0, 6, -2, -3)
    .setColumn(1, 4,  1,  7)
  const rhs10 = new MatrixMxN(2, 2)
    .setColumn(0, -1, 5)
    .setColumn(1,  3, 2)

  const result00 = MatrixFunc.multiply(lhs00, rhs00).add(MatrixFunc.multiply(lhs01, rhs10))
  const result10 = MatrixFunc.multiply(lhs10, rhs00).add(MatrixFunc.multiply(lhs11, rhs10))
  const result = new MatrixMxN(3, 2)
    .setPartition(0, 0, result00)
    .setPartition(2, 0, result10)

  expect(result).toEqual(new MatrixMxN(3, 2).setValuesRowOrder(
    -5, 4,
    -6, 2,
    2, 1,
  ))
})

test ('transpose matrix', () => {
  const matrix = new MatrixMxN(3, 2).setValuesRowOrder(
    -5, 2,
    1, -3,
    0, 4
  )

  const matrixT = MatrixFunc.transpose(matrix)

  expect(matrixT).toEqual(new MatrixMxN(2, 3).setValuesRowOrder(
    -5, 1, 0,
    2, -3, 4
  ))
})

test ('echelon example', () => {
  const matrix = new MatrixMxN(3, 6)
    .setValuesRowOrder(
      0, 3, -6, 6, 4, -5,
      3, -9, 12, -9, 6, 15,
      3, -7, 8, -5, 8, 9,
    )
  
  matrix.echelon()

  expect(matrix).toEqual(new MatrixMxN(3, 6).setValuesRowOrder(
    3, -9, 12, -9, 6, 15,
    0, 2, -4, 4, 2, -6,
    0, 0,  0, 0, 1, 4
  ))
})

test ('echelon reduced example', () => {
  const matrix = new MatrixMxN(3, 6)
    .setValuesRowOrder(
      3, -9, 12, -9, 6, 15,
      0, 2, -4, 4, 2, -6,
      0, 0,  0, 0, 1, 4
    )

  matrix.echelonReduced()

  expect(matrix).toEqual(new MatrixMxN(3, 6).setValuesRowOrder(
    1, 0, -2, 3, 0, -24,
    0, 1, -2, 2, 0, -7,
    0, 0,  0, 0, 1, 4
  ))
})

test ('echelon example to prepare for LU decomposition', () => {
  const matrix = new MatrixMxN(4, 5).setValuesRowOrder(
    2, 4, -1, 5, -2,
    -4, -5, 3, -8, 1,
    2, -5, -4, 1, 8,
    -6, 0, 7, -3, 1
  )

  matrix.echelon()

  expect(matrix).toEqual(new MatrixMxN(4, 5).setValuesRowOrder(
    2, 4, -1, 5, -2,
    0, 3, 1, 2, -3,
    0, 0, 0, 2, 1,
    0, 0, 0, 0, 5
  ))
})

test ('echelon and echelonReduced example when last row becomes zero', () => {
  const matrix = new MatrixMxN(4, 5).setValuesRowOrder(
    -2, -5, 8, 0, -17,
    1, 3, -5, 1, 5,
    3, 11, -19, 7, 1,
    1, 7, -13, 5, -3
  )

  matrix.echelon().echelonReduced()

  expect(matrix).toEqual(new MatrixMxN(4, 5).setValuesRowOrder(
    1, 0, 1, 0, 1,
    0, 1, -2, 0, 3,
    0, 0, 0, 1, -5,
    0, 0, 0, 0, 0,
  ))
})

test ('echelon and echelonReduced example when top rob becomes zero', () => {
  const matrix = new MatrixMxN(3, 5).setValuesRowOrder(
    4, 0, 5, 2, 1,
    0, 4, 2, 0, 2,
    3, 2, 4, 0, 2,
  )

  matrix.echelon().echelonReduced()

  new MatrixMxN(3, 5).setValuesRowOrder(
    1, 0, 0, -2, 2/3,
    0, 1, 0, -1, 2/3,
    0, 0, 1, 2, -1/3,
  ).forEach((expected, row, column) => {
    const actual = matrix.getValue(row, column)
    const error = Math.abs(actual - expected)
    expect(error).toBeLessThanOrEqual(MatrixFunc.EPSILON)
  })
})


test ('echelon and echelonReduced simple example', () => {
  const matrix = new MatrixMxN(3, 3).setValuesRowOrder(
    3, -1, 3,
    6,  0, 12,
    2,  1, 7,
  )

  matrix.echelon().echelonReduced()

  expect(matrix).toEqual(new MatrixMxN(3, 3).setValuesRowOrder(
    1, 0, 2,
    0, 1, 3,
    0, 0, 0,
  ))
})

test ('echelonReduced example with decimal values', () => {
  const costs = new MatrixMxN(3, 4).setValuesRowOrder(
    0.5, 0.4, 0.2, 0.0,
    0.2, 0.3, 0.1, 0.0,
    0.1, 0.1, 0.3, 0.0,
  )

  const IminusC = new MatrixMxN(3, 4)
    .identity()
    .subtract(costs)
    .setColumn(3, 50, 30, 20)
    .echelon()
    .echelonReduced()
    .transformColumn(3, value => Math.round(value))

  expect(IminusC).toEqual(new MatrixMxN(3, 4).setValuesRowOrder(
    1, 0, 0, 226,
    0, 1, 0, 119,
    0, 0, 1, 78
  ))
})

test ('echelonReduced stress test', () => {
  const matrix = new MatrixMxN(7, 8).setValuesRowOrder(
    0.1588, 0.0064, 0.0025, 0.0304, 0.0014, 0.0083, 0.1594, 0.0,
    0.0057, 0.2645, 0.0436, 0.0099, 0.0083, 0.0201, 0.3413, 0.0,
    0.0264, 0.1506, 0.3557, 0.0139, 0.0142, 0.0070, 0.0236, 0.0,
    0.3299, 0.0565, 0.0495, 0.3636, 0.0204, 0.0483, 0.0649, 0.0,
    0.0089, 0.0081, 0.0333, 0.0295, 0.3412, 0.0237, 0.0020, 0.0,
    0.1190, 0.0901, 0.0996, 0.1260, 0.1722, 0.2368, 0.3369, 0.0,
    0.0063, 0.0126, 0.0196, 0.0098, 0.0064, 0.0132, 0.0012, 0.0,
  )

  const result = new MatrixMxN(7, 8)
    .identity()
    .subtract(matrix)
    .setColumn(7, 74000, 56000, 10500, 25000, 17500, 196000, 5000)
    .echelon()
    .echelonReduced()

  new MatrixMxN(7, 8).setValuesRowOrder(
    1, 0, 0, 0, 0, 0, 0, 99575.656,
    0, 1, 0, 0, 0, 0, 0, 97703.039,
    0, 0, 1, 0, 0, 0, 0, 51230.523,
    0, 0, 0, 1, 0, 0, 0, 131569.93,
    0, 0, 0, 0, 1, 0, 0, 49488.492,
    0, 0, 0, 0, 0, 1, 0, 329554.43,
    0, 0, 0, 0, 0, 0, 1, 13835.3378,

  ).forEach((expected, row, column) => {
    const actual = Math.fround(result.getValue(row, column))
    expect(actual).toBe(expected)
  })
})

test ('echelonReduced ignores empty rows', () => {
  const matrix = new MatrixMxN(3, 4).setValuesRowOrder(
    1, 2, 1, 0,
    0, 1, 3, 0,
    0, 0, 0, 0,
  )

  matrix.echelonReduced()

  expect(matrix).toEqual(new MatrixMxN(3, 4).setValuesRowOrder(
    1, 0, -5, 0,
    0, 1, 3, 0,
    0, 0, 0, 0
  ))
})

test ('determinant of 2x2 matrix', () => {
  const matrix = new MatrixMxN(2).setValuesRowOrder(
    1.25, -2,
    4, -5.5,
  )

  expect(matrix.determinant()).toBe(1.125)
})

test ('determinant of 3x3 matrix', () => {
  const matrix = new MatrixMxN(3).setValuesRowOrder(
    1, 5, 0,
    2, 4, -1,
    0, -2, 0,
  )

  expect(matrix.determinant()).toBe(-2)
})

test ('determinant of 4x4 matrix', () => {
  const matrix = new MatrixMxN(4).setValuesRowOrder(
    1, -1, -3, 0,
    0, 1, 5, 4,
    -1, 2, 8, 5,
    3, -1, -2, 3,
  )

  expect(matrix.determinant()).toBe(3)
})

test ('determinant of 4x4 matrix', () => {
  const matrix = new MatrixMxN(4).setValuesRowOrder(
    1, 3, 3, -4,
    0, 1, 2, -5,
    2, 5, 4, -3,
    -3, -7, -5, 2
  )

  expect(matrix.determinant()).toBe(0)
})

test ('adjoint of a 3x3 matrix', () => {
  const matrix = new MatrixMxN(3).setValuesRowOrder(
    2, 1, 3,
    1, -1, 1,
    1, 4, -2,
  )

  const adjointMatrix = MatrixFunc.adjoint(matrix)

  new MatrixMxN(3).setValuesRowOrder(
    -2, 14, 4,
    3, -7, 1,
    5, -7, -3,
  ).forEach((expected, row, column) => {
    const actual = adjointMatrix.getValue(row, column)
    const error = Math.abs(actual - expected)
    expect(error).toBeLessThanOrEqual(MatrixFunc.EPSILON)
  })
})

test ('inverse of a 3x3 matrix', () => {
  const matrix = new MatrixMxN(3).setValuesRowOrder(
    2, 1, 3,
    1, -1, 1,
    1, 4, -2,
  )

  const matrixInversed = MatrixFunc.inverse(matrix)

  new MatrixMxN(3).setValuesRowOrder(
    -1/7,    1,   2/7,
    3/14, -1/2,  1/14,
    5/14, -1/2, -3/14,
  ).forEach((expected, row, column) => {
    const actual = matrixInversed.getValue(row, column)
    const error = Math.abs(actual - expected)
    expect(error).toBeLessThanOrEqual(MatrixFunc.EPSILON)
  })
})

test ('changeOfCoordiantes with 2x2 matrices', () => {
  const from = new MatrixMxN(2).setValuesRowOrder(
    -9, -5,
    1, -1,
  )
  const to = new MatrixMxN(2).setValuesRowOrder(
    1, 3,
    -4, -5,
  )

  const matrix = MatrixFunc.changeOfCoordiantes(from, to)

  // Verify we can multiply the matrix and get the "from"
  // matrix back.
  MatrixFunc.multiply(to, matrix).forEach((expected, row, column) => {
    expect(from.getValue(row, column)).toBe(expected)
  })
})

test ('steadyState vector', () => {
  const matrix = new MatrixMxN(2).setValuesRowOrder(
    0.6, 0.3,
    0.4, 0.7,
  )

  const steadyStateVector = MatrixFunc.steadyState(matrix)

  new MatrixMxN(2, 1).setValuesRowOrder(
    3 / 7,
    4 / 7,
  ).forEach((expected, row, column) => {
    const actual = steadyStateVector.getValue(row, column)
    const error = Math.abs(actual - expected)
    expect(error).toBeLessThanOrEqual(MatrixFunc.EPSILON)
  })
})

test ('steadyState vector', () => {
  const matrix = new MatrixMxN(3).setValuesRowOrder(
    0.7, 0.1, 0.3,
    0.2, 0.8, 0.3,
    0.1, 0.1, 0.4,
  )

  const steadyStateVector = MatrixFunc.steadyState(matrix)

  new MatrixMxN(3, 1).setValuesRowOrder(
    9 / 28,
    15 / 28,
    4 / 28
  ).forEach((expected, row, column) => {
    const actual = steadyStateVector.getValue(row, column)
    const error = Math.abs(actual - expected)
    expect(error).toBeLessThanOrEqual(MatrixFunc.EPSILON)
  })
})


test ('steadyState vector multplies from original', () => {
  const matrix = new MatrixMxN(3).setValuesRowOrder(
    0.7, 0.1, 0.3,
    0.2, 0.8, 0.3,
    0.1, 0.1, 0.4,
  )

  const steadyStateVector = MatrixFunc.steadyState(matrix)
  const nextStateVector = MatrixFunc.multiply(matrix, steadyStateVector)

  steadyStateVector.forEach((expected, row, column) => {
    const actual = nextStateVector.getValue(row, column)
    const error = Math.abs(actual - expected)
    expect(error).toBeLessThanOrEqual(MatrixFunc.EPSILON)
  })
})

test ('quadratic formula', () => {
  const result = MatrixFunc.quadratic(1.0, -1.92, 0.92)

  expect(result[0]).toBe(1.0)
  expect(result[1]).toBeCloseTo(0.92, 7)
})

test ('powerMethod on 2x2 matrix to find eigen vector', () => {
  const matrix = new MatrixMxN(2).setValuesRowOrder(
    6.0, 5.0,
    1.0, 2.0,
  )

  const vector = Float32Array.of(0.0, 1.0)
  const eigenValues = matrix.powerMethod(6, vector)

  expect(eigenValues[0]).toEqual(Float32Array.of(5, 2))
  expect(eigenValues[1]).toEqual(Float32Array.of(8, 1.8))
  expect(eigenValues[2]).toEqual(Float32Array.of(7.125, 1.450))
  expect(eigenValues[3][0]).toBeCloseTo(7.0175, 4)
  expect(eigenValues[3][1]).toBeCloseTo(1.407, 4)
  expect(eigenValues[4][0]).toBeCloseTo(7.0025, 4)
  expect(eigenValues[4][1]).toBeCloseTo(1.4010, 4)
  expect(eigenValues[5][0]).toBeCloseTo(7.00036, 5)
  expect(eigenValues[5][1]).toBeCloseTo(1.40014, 5)
})

test ('powerMethod on 4x4 matrix to find eigen vector', () => {
  const matrix = new MatrixMxN(4).setValuesRowOrder(
    10.0, 7.0, 8.0, 7.0,
    7.0, 5.0, 6.0, 5.0,
    8.0, 6.0, 10.0, 9.0,
    7.0, 5.0, 9.0, 10.0,
  )

  const vector = Float32Array.of(1.0, 0.0, 0.0, 0.0)
  const eigenValues = matrix.powerMethod(6, vector)

  expect(eigenValues[0]).toEqual(Float32Array.of(10, 7, 8, 7))
  expect(eigenValues[1][0]).toBeCloseTo(26.2, 2)
  expect(eigenValues[1][1]).toBeCloseTo(18.8, 2)
  expect(eigenValues[1][2]).toBeCloseTo(26.5, 2)
  expect(eigenValues[1][3]).toBeCloseTo(24.7, 2)
  expect(eigenValues[5][0]).toBeCloseTo(29.0060, 3)
  expect(eigenValues[5][1]).toBeCloseTo(20.8675, 3)
  expect(eigenValues[5][2]).toBeCloseTo(30.2891, 3)
  expect(eigenValues[5][3]).toBeCloseTo(28.5862, 3)
})


test ('inversePowerMethod on 3x3 matrix to find eigen value', () => {
  const matrix = new MatrixMxN(3).setValuesRowOrder(
    10, -8, -4,
    -8, 13, 4,
    -4, 5, 4
  )

  const eigenValues = matrix.inversePowerMethod(6, 1.9)

  expect(eigenValues[0][0]).toBeCloseTo(4.45, 2)
  expect(eigenValues[0][1]).toBeCloseTo(0.50, 2)
  expect(eigenValues[0][2]).toBeCloseTo(7.76, 2)
  expect(eigenValues[1][0]).toBeCloseTo(5.0131, 4)
  expect(eigenValues[1][1]).toBeCloseTo(0.0442, 4)
  expect(eigenValues[1][2]).toBeCloseTo(9.9197, 4)
  expect(eigenValues[2][0]).toBeCloseTo(5.0012, 4)
  expect(eigenValues[2][1]).toBeCloseTo(0.0031, 4)
  expect(eigenValues[2][2]).toBeCloseTo(9.9949, 4)
  expect(eigenValues[3][0]).toBeCloseTo(5.0001, 4)
  expect(eigenValues[3][1]).toBeCloseTo(0.0002, 4)
  expect(eigenValues[3][2]).toBeCloseTo(9.99965, 5)
  expect(eigenValues[4][0]).toBeCloseTo(5.000006, 5)
  expect(eigenValues[4][1]).toBeCloseTo(0.000015, 5)
  expect(eigenValues[4][2]).toBeCloseTo(9.99998, 5)
  expect(eigenValues[5][0]).toBeCloseTo(5.000002, 6)
  expect(eigenValues[5][1]).toBeCloseTo(0.0000003, 6)
  expect(eigenValues[5][2]).toBeCloseTo(10.000004, 6)
})
