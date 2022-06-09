import VectorN, * as VectorFunc from "./vector";
import MatrixMxN from "./matrix";
import * as sut from "./practice";

test ('sampleCovariance for 4 vectors with 3 dimensions', () => {
  const result = sut.sampleCovariance(
    VectorN.from(1, 2, 1, -3),
    VectorN.from(4, 2, 13, -3),
    VectorN.from(7, 8, 1, -3),
    VectorN.from(8, 4, 5, -3),
  )

  new MatrixMxN(4).setValuesRowOrder(
    10, 6, 0, 0,
    6, 8, -8, 0,
    0, -8, 32, 0,
    0, 0, 0, 0,
  ).forEach((row, column, expected) => {
    expect(result.getValue(row, column)).toBe(expected)
  })
})

test ('affineDependence for 4 vectors with 3 dimensions', () => {
  const result = sut.affineDependence(
    VectorN.from(1, 3, 7),
    VectorN.from(2, 7, 6.5),
    VectorN.from(0, 4, 7),
    VectorN.from(0, 14, 6),
  )

  new MatrixMxN(3).setValuesRowOrder(
    1, -1, -1,
    0, 5, 15,
    0, 0, 0,
  ).forEach((row, column, expected) => {
    expect(result.getValue(row, column)).toBe(expected)
  })
})

test ('barycentricCoordinates for 4 vectors with 3 dimensions', () => {
  const result = sut.barycentricCoordinates(
    [
      VectorN.from(3, 1, 5),
      VectorN.from(4, 3, 4),
      VectorN.from(1, 5, 1),
    ],
    VectorN.from(3, 3, 3.5),
  )

  expect(result.valuesEqual(
    VectorN.from(0.25, 0.50, 0.25), 0.0000001)
  ).toBe(true)
})

test ('barycentricCoordinates for 3 vectors with 4 dimensions', () => {
  const result = sut.barycentricCoordinates(
    [
      VectorN.from(3, 0, 6, -3),
      VectorN.from(-6, 3, 3, 0),
      VectorN.from(3, 6, 0, 3),
    ],
    VectorN.from(0, 3, 3, 0)
  )

  expect(result.n).toBe(3)
  expect(result.valuesEqual(VectorN.from(1/3, 1/3, 1/3))).toBe(true)
})

test ('linearCombination will also calculate barycentricCoordinates', () => {
  const basis: VectorN[] = [
    VectorN.from(3, 0, 6, -3),
    VectorN.from(-6, 3, 3, 0),
    VectorN.from(3, 6, 0, 3),
  ]
  const point: VectorN = VectorN.from(0, 3, 3, 0)

  const combination = VectorFunc.linearCombination(basis, point)
  const barycentric = sut.barycentricCoordinates(basis, point)

  expect(combination.n).toBe(barycentric.n)
  expect(combination.valuesEqual(barycentric)).toBe(true)
})
