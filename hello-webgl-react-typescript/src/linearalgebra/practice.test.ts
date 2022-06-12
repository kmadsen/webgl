import VectorN, * as VectorFunc from "./vector";
import MatrixMxN from "./matrix";
import * as sut from "./practice";
import SurfaceMxN from "./surface";

test ('sampleCovariance for 4 vectors with 3 dimensions', () => {
  const result = sut.sampleCovariance(
    VectorN.from(1, 2, 1, -3),
    VectorN.from(4, 2, 13, -3),
    VectorN.from(7, 8, 1, -3),
    VectorN.from(8, 4, 5, -3),
  )

  expect(result).toEqual(new MatrixMxN(4).setValuesRowOrder(
    10, 6, 0, 0,
    6, 8, -8, 0,
    0, -8, 32, 0,
    0, 0, 0, 0,
  ))
})

test ('affineDependence for 4 vectors with 3 dimensions', () => {
  const result = sut.affineDependence(
    VectorN.from(1, 3, 7),
    VectorN.from(2, 7, 6.5),
    VectorN.from(0, 4, 7),
    VectorN.from(0, 14, 6),
  )

  expect(result).toEqual(new MatrixMxN(3).setValuesRowOrder(
    1, -1, -1,
    0, 5, 15,
    0, 0, 0,
  ))
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

  expect(combination.n).toEqual(barycentric.n)
  expect(combination).toEqual(barycentric)
})

test ('vectorRowMatrix coverts vectors into a matrix', () => {
  const vectors: VectorN[] = [
    VectorN.from(1, 2, 3),
    VectorN.from(3, 4, 5),
    VectorN.from(4, 2, 0),
    VectorN.from(1, -2, 1),
  ]

  const matrix = sut.vectorRowMatrix(...vectors)

  expect(matrix).toEqual(new MatrixMxN(4, 3).setValuesRowOrder(
    1, 2, 3,
    3, 4, 5,
    4, 2, 0,
    1, -2, 1,
  ))
})

test ('vectorColumnMatrix coverts vectors into a matrix', () => {
  const vectors: VectorN[] = [
    VectorN.from(1, 2, 3),
    VectorN.from(3, 4, 5),
    VectorN.from(4, 2, 0),
    VectorN.from(1, -2, 1),
  ]

  const matrix = sut.vectorColumnMatrix(...vectors)

  expect(matrix).toEqual(new MatrixMxN(3, 4).setValuesRowOrder(
    1, 3, 4, 1,
    2, 4, 2, -2,
    3, 5, 0, 1
  ))
})

test ('bezierCurve2 flat line', () => {
  const basis: VectorN[] = [
    VectorN.from(10.0, 10.0),
    VectorN.from(11.0, 11.0),
  ]

  const result = [0, 0.5, 1].map(value => {
    return sut.bezierCurve(basis, value)
  })

  expect(result[0]).toEqual(basis[0])
  expect(result[1]).toEqual(VectorN.from(10.5, 10.5))
  expect(result[2]).toEqual(basis[1])
})

test ('bezierCurve3 square edge', () => {
  const basis: VectorN[] = [
    VectorN.from(0.0, 0.0),
    VectorN.from(1.0, 0.0),
    VectorN.from(1.0, 1.0),
  ]

  const result = [0, 0.5, 1].map(value => {
    return sut.bezierCurve(basis, value)
  })

  expect(result[0]).toEqual(basis[0])
  expect(result[1]).toEqual(VectorN.from(0.75, 0.25))
  expect(result[2]).toEqual(basis[2])
})

test ('bezierCurve4 square edge', () => {
  const basis: VectorN[] = [
    VectorN.from(0.0, 0.0),
    VectorN.from(1.0, 0.0),
    VectorN.from(1.0, 1.0),
    VectorN.from(0.0, 1.0),
  ]

  const result = [0, 0.25, 0.5, 0.75, 1].map(value => {
    return sut.bezierCurve(basis, value)
  })

  expect(result[0]).toEqual((basis[0]))
  expect(result[1]).toEqual((VectorN.from(0.5625, 0.15625)))
  expect(result[2]).toEqual((VectorN.from(0.75, 0.5)))
  expect(result[3]).toEqual((VectorN.from(0.5625, 0.84375)))
  expect(result[4]).toEqual((basis[3]))
})

test ('bezierCurve4 square edge', () => {
  const basis: VectorN[] = [
    VectorN.from(0.0, 0.0),
    VectorN.from(1.0, 0.0),
    VectorN.from(1.0, 1.0),
    VectorN.from(0.0, 1.0),
  ]

  const result = [0, 0.25, 0.5, 0.75, 1].map(value => {
    return sut.bezierCurve(basis, value)
  })

  expect(result[0]).toEqual(VectorN.from(0.0, 0.0))
  expect(result[1]).toEqual(VectorN.from(0.5625, 0.15625))
  expect(result[2]).toEqual(VectorN.from(0.75, 0.5))
  expect(result[3]).toEqual(VectorN.from(0.5625, 0.84375))
  expect(result[4]).toEqual(VectorN.from(0.0, 1.0))
})

test ('bezierCurveDerivative2 for line segment', () => {
  const basis: VectorN[] = [
    VectorN.from(10.0, 9.0),
    VectorN.from(11.0, 12.0),
  ]

  const derivative = sut.bezierCurveDerivative(basis)

  expect(derivative).toEqual([VectorN.from(1.0, 3.0)])
})

test ('bezierCurveDerivative3 square edge', () => {
  const basis: VectorN[] = [
    VectorN.from(10.0, 10.0),
    VectorN.from(11.0, 10.0),
    VectorN.from(11.0, 11.0),
  ]

  const derivative = sut.bezierCurveDerivative(basis)
  const result = [0, 0.5, 1].map(value => {
    return sut.bezierCurve(derivative, value)
  })

  expect(result[0]).toEqual(VectorN.from(2.0, 0.0))
  expect(result[1]).toEqual(VectorN.from(1.0, 1.0))
  expect(result[2]).toEqual(VectorN.from(0.0, 2.0))
})

test ('bezierCurveDerivative4 square edge', () => {
  const basis: VectorN[] = [
    VectorN.from(10.0, 10.0),
    VectorN.from(11.0, 10.0),
    VectorN.from(11.0, 11.0),
    VectorN.from(10.0, 11.0),
  ]

  const derivative = sut.bezierCurveDerivative(basis)
  const result = [0, 0.25, 0.5, 0.75, 1].map(value => {
    return sut.bezierCurve(derivative, value)
  })

  expect(result[0]).toEqual(VectorN.from(3.0, 0.0))
  expect(result[1]).toEqual(VectorN.from(1.5, 1.125))
  expect(result[2]).toEqual(VectorN.from(0.0, 1.5))
  expect(result[3]).toEqual(VectorN.from(-1.5, 1.125))
  expect(result[4]).toEqual(VectorN.from(-3.0, 0.0))
})

test ('bezierSurface2x2 square edge', () => {
  const control = new SurfaceMxN(2, 2).setValues(
    VectorN.from(10.0, 10.0), VectorN.from(11.0, 10.0),
    VectorN.from(10.0, 11.0), VectorN.from(11.0, 11.0),
  )

  const dimension = [0, 0.5, 1]
  const actual = new SurfaceMxN(dimension.length)
    .transform((_value, row, column) => {
      return sut.bezierSurface(control, dimension[row], dimension[column])
    })
  
  const expected = new SurfaceMxN(3, 3).setValues(
    VectorN.from(10.0, 10.0), VectorN.from(10.5, 10.0), VectorN.from(11.0, 10.0),
    VectorN.from(10.0, 10.5), VectorN.from(10.5, 10.5), VectorN.from(11.0, 10.5),
    VectorN.from(10.0, 11.0), VectorN.from(10.5, 11.0), VectorN.from(11.0, 11.0),
  )

  expect(actual).toEqual(expected)
})

test ('bezierSurfaceDerivative for a simple square', () => {
  const control = new SurfaceMxN(2).setValues(
    VectorN.from(0.0, 0.0), VectorN.from(1.0, 0.0),
    VectorN.from(0.0, 1.0), VectorN.from(1.0, 1.0),
  )

  const derivativeU = sut.bezierSurfaceDerivativeU(control)
  const derivativeV = sut.bezierSurfaceDerivativeV(control)

  expect(derivativeU).toEqual(new SurfaceMxN(1, 2).setValues(
    VectorN.from(0.0, 1.0), VectorN.from(0.0, 1.0),
  ))
  expect(derivativeV).toEqual(new SurfaceMxN(2, 1).setValues(
    VectorN.from(1.0, 0.0),
    VectorN.from(1.0, 0.0),
  ))
})

test ('bezierSurfaceDerivatives to find the normals', () => {
  // construct a block corner in 3 dimensions
  const control = new SurfaceMxN(3, 2).setValues(
    VectorN.from(0, 0, 0), VectorN.from(1, 0, 0),
    VectorN.from(0, 1, 0), VectorN.from(1, 1, 0),
    VectorN.from(0, 1, 1), VectorN.from(1, 1, 1),
  )

  const derivativeU = sut.bezierSurfaceDerivativeU(control)
  const derivativeV = sut.bezierSurfaceDerivativeV(control)
  const tu = sut.bezierSurface(derivativeU, 0.5, 0.5)
  const tv = sut.bezierSurface(derivativeV, 0.5, 0.5)
  const normal = VectorFunc.crossProduct(tu, tv)

  expect(normal).toEqual(VectorN.from(0, 1, -1))
})
