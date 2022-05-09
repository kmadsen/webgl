import MatrixMxN, { changeOfCoordiantes, EPSILON, multiply, steadState, transpose } from "./matrix";

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

test ('map to values', () => {
  const matrix = new MatrixMxN(3, 3).identity()

  matrix
    .map((row, col) => row + col)
    .map((_row, _col, value) => value + 2)
  
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

  const result = multiply(lhs, rhs)

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

  const result = multiply(lhs, rhs)

  expect(result.m).toBe(3)
  expect(result.n).toBe(2)
  expect(result.getValue(0, 0)).toBe(-5)
  expect(result.getValue(0, 1)).toBe(4)
  expect(result.getValue(1, 0)).toBe(-6)
  expect(result.getValue(1, 1)).toBe(2)
  expect(result.getValue(2, 0)).toBe(2)
  expect(result.getValue(2, 1)).toBe(1)
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

  const result00 = multiply(lhs00, rhs00).add(multiply(lhs01, rhs10))
  const result10 = multiply(lhs10, rhs00).add(multiply(lhs11, rhs10))
  const result = new MatrixMxN(3, 2)
    .setPartition(0, 0, result00)
    .setPartition(2, 0, result10)

  new MatrixMxN(3, 2).setValuesRowOrder(
    -5, 4,
    -6, 2,
    2, 1,
  ).forEach((row, column, expected) => {
    expect(result.getValue(row, column)).toBe(expected)
  })
})

test ('transpose matrix', () => {
  const matrix = new MatrixMxN(3, 2).setValuesRowOrder(
    -5, 2,
    1, -3,
    0, 4
  )

  const matrixT = transpose(matrix)

  new MatrixMxN(2, 3).setValuesRowOrder(
    -5, 1, 0,
    2, -3, 4
  ).forEach((row, column, expected) => {
    expect(matrixT.getValue(row, column)).toBe(expected)
  })
})

test ('echelon example', () => {
  const matrix = new MatrixMxN(3, 6)
    .setValuesRowOrder(
      0, 3, -6, 6, 4, -5,
      3, -9, 12, -9, 6, 15,
      3, -7, 8, -5, 8, 9,
    )
  
  matrix.echelon()

  new MatrixMxN(3, 6).setValuesRowOrder(
    3, -9, 12, -9, 6, 15,
    0, 2, -4, 4, 2, -6,
    0, 0,  0, 0, 1, 4
  ).forEach((row, column, expected) => {
    expect(matrix.getValue(row, column)).toBe(expected)
  })
})

test ('echelon reduced example', () => {
  const matrix = new MatrixMxN(3, 6)
    .setValuesRowOrder(
      3, -9, 12, -9, 6, 15,
      0, 2, -4, 4, 2, -6,
      0, 0,  0, 0, 1, 4
    )

  matrix.echelonReduced()

  new MatrixMxN(3, 6).setValuesRowOrder(
    1, 0, -2, 3, 0, -24,
    0, 1, -2, 2, 0, -7,
    0, 0,  0, 0, 1, 4
  ).forEach((row, column, expected) => {
    expect(matrix.getValue(row, column)).toBe(expected)
  })
})

test ('echelon example to prepare for LU decomposition', () => {
  const matrix = new MatrixMxN(4, 5).setValuesRowOrder(
    2, 4, -1, 5, -2,
    -4, -5, 3, -8, 1,
    2, -5, -4, 1, 8,
    -6, 0, 7, -3, 1
  )

  matrix.echelon()

  new MatrixMxN(4, 5).setValuesRowOrder(
    2, 4, -1, 5, -2,
    0, 3, 1, 2, -3,
    0, 0, 0, 2, 1,
    0, 0, 0, 0, 5
  ).forEach((row, column, expected) => {
    expect(matrix.getValue(row, column)).toBe(expected)
  })
})

test ('echelon and echelonReduced example when last row becomes zero', () => {
  const matrix = new MatrixMxN(4, 5).setValuesRowOrder(
    -2, -5, 8, 0, -17,
    1, 3, -5, 1, 5,
    3, 11, -19, 7, 1,
    1, 7, -13, 5, -3
  )

  matrix.echelon().echelonReduced()

  new MatrixMxN(4, 5).setValuesRowOrder(
    1, 0, 1, 0, 1,
    0, 1, -2, 0, 3,
    0, 0, 0, 1, -5,
    0, 0, 0, 0, 0,
  ).forEach((row, column, expected) => {
    expect(matrix.getValue(row, column)).toBe(expected)
  })
})

test ('echelon and echelonReduced simple example', () => {
  const matrix = new MatrixMxN(3, 3).setValuesRowOrder(
    3, -1, 3,
    6,  0, 12,
    2,  1, 7,
  )

  matrix.echelon().echelonReduced()

  new MatrixMxN(3, 3).setValuesRowOrder(
    1, 0, 2,
    0, 1, 3,
    0, 0, 0,
  ).forEach((row, column, expected) => {
    expect(matrix.getValue(row, column)).toBe(expected)
  })
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
    .mapColumn(3, (row, value) => Math.round(value))

  new MatrixMxN(3, 4).setValuesRowOrder(
    1, 0, 0, 226,
    0, 1, 0, 119,
    0, 0, 1, 78
  ).forEach((row, column, expected) => {
    expect(IminusC.getValue(row, column)).toBe(expected)
  })
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

  ).forEach((row, column, expected) => {
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

  new MatrixMxN(3, 4).setValuesRowOrder(
    1, 0, -5, 0,
    0, 1, 3, 0,
    0, 0, 0, 0
  ).forEach((row, column, expected) => {
    expect(matrix.getValue(row, column)).toBe(expected)
  })
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

test ('changeOfCoordiantes with 2x2 matrices', () => {
  const from = new MatrixMxN(2).setValuesRowOrder(
    -9, -5,
    1, -1,
  )
  const to = new MatrixMxN(2).setValuesRowOrder(
    1, 3,
    -4, -5,
  )

  const matrix = changeOfCoordiantes(from, to)

  // Verify we can multiply the matrix and get the "from"
  // matrix back.
  multiply(to, matrix).forEach((row, column, expected) => {
    expect(from.getValue(row, column)).toBe(expected)
  })
})

test ('steadyState vector', () => {
  const matrix = new MatrixMxN(2).setValuesRowOrder(
    0.6, 0.3,
    0.4, 0.7,
  )

  const steadStateVector = steadState(matrix)

  new MatrixMxN(2, 1).setValuesRowOrder(
    3 / 7,
    4 / 7,
  ).forEach((row, column, expected) => {
    const actual = steadStateVector.getValue(row, column)
    const error = Math.abs(actual - expected)
    expect(error).toBeLessThanOrEqual(EPSILON)
  })
})

test ('steadyState vector', () => {
  const matrix = new MatrixMxN(3).setValuesRowOrder(
    0.7, 0.1, 0.3,
    0.2, 0.8, 0.3,
    0.1, 0.1, 0.4,
  )

  const steadStateVector = steadState(matrix)

  new MatrixMxN(3, 1).setValuesRowOrder(
    9 / 28,
    15 / 28,
    4 / 28
  ).forEach((row, column, expected) => {
    const actual = steadStateVector.getValue(row, column)
    const error = Math.abs(actual - expected)
    expect(error).toBeLessThanOrEqual(EPSILON)
  })
})


test ('steadyState vector multplies from original', () => {
  const matrix = new MatrixMxN(3).setValuesRowOrder(
    0.7, 0.1, 0.3,
    0.2, 0.8, 0.3,
    0.1, 0.1, 0.4,
  )

  const steadStateVector = steadState(matrix)
  const nextStateVector = multiply(matrix, steadStateVector)

  steadStateVector.forEach((row, column, expected) => {
    const actual = nextStateVector.getValue(row, column)
    const error = Math.abs(actual - expected)
    expect(error).toBeLessThanOrEqual(EPSILON)
  })
})
