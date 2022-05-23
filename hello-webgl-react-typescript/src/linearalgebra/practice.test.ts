import VectorN from "./vector";
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