import { EPSILON } from "./matrix"
import VectorN, * as VectorFunc from "./vector";

test ('dot product on vector', () => {
  const u = VectorN.from(2, -5, -1)
  const v = VectorN.from(3, 2, -3)

  const uv = u.dot(v)
  const vu = v.dot(u)

  expect(uv).toBe(-1)
  expect(vu).toBe(uv)
})

test ('dot product determines basis vectors', () => {
  const u1 = VectorN.from(3, 1, 1)
  const u2 = VectorN.from(-1, 2, 1)
  const u3 = VectorN.from(-1/2, -2, 7/2)

  const u1u2 = u1.dot(u2)
  const u1u3 = u1.dot(u3)
  const u2u3 = u2.dot(u3)

  expect(u1u2).toBe(0.0)
  expect(u1u3).toBe(0.0)
  expect(u2u3).toBe(0.0)
})


test ('magnitude of vector', () => {
  const u = VectorN.from(1, -2, 2, 0)

  const magnitude = u.magnitude()

  expect(magnitude).toBe(3)
})

test ('normalize a vector', () => {
  const u = VectorN.from(1, -2, 2, 0)
  const expected = VectorN.from(1/3, -2/3, 2/3, 0)

  const magnitude = u.normalize().magnitude()
  const valuesEqual = u.valuesEqual(expected, EPSILON)

  expect(magnitude).toBeCloseTo(1.0, 6)
  expect(valuesEqual).toBe(true)
})

test ('distanceBetween a vector', () => {
  const u = VectorN.from(7, 1)
  const v = VectorN.from(3, 2)

  const distance = VectorFunc.distance(u, v)

  expect(distance).toBe(Math.sqrt(17))
})

test ('linearCombination and multiplyWeights of basis vectors', () => {
  const basis = [
    VectorN.from(3, 1, 1),
    VectorN.from(-1, 2, 1),
    VectorN.from(-1/2, -2, 7/2)
  ]
  const y = VectorN.from(6, 1, -8)

  const weights = VectorFunc.linearCombination(basis, y)
  const result = VectorFunc.multiplyWeights(basis, weights)

  expect(weights.get(0)).toBe(1)
  expect(weights.get(1)).toBe(-2)
  expect(weights.get(2)).toBe(-2)
  expect(result.valuesEqual(y, EPSILON)).toBe(true)
})

test ('project vector onto another vector', () => {
  const project = VectorFunc.project(
    VectorN.from(4.0, 2.0),
    VectorN.from(7.0, 6.0),
  )

  expect(project.get(0)).toBe(8)
  expect(project.get(1)).toBe(4)
})

test ('constructOrthogonalBasis for 3 vectors with 4 dimensions', () => {
  const basis = VectorFunc.constructOrthogonalBasis(
    VectorN.from(1.0, 1.0, 1.0, 1.0),
    VectorN.from(0.0, 1.0, 1.0, 1.0),
    VectorN.from(0.0, 0.0, 1.0, 1.0),
  )

  expect(basis[0].valuesEqual(VectorN.from(1.0, 1.0, 1.0, 1.0), 0.0)).toBe(true)
  expect(basis[1].valuesEqual(VectorN.from(-3/4, 1/4, 1/4, 1/4), 0.0)).toBe(true)
  expect(basis[2].valuesEqual(
    VectorN.from(0.0, -2.0/3.0, 1.0/3.0, 1.0/3.0),
    0.0000001)
  ).toBe(true)
})

test ('constructOrthogonalBasis will filter zero or undefined vectors', () => {
  const result: VectorN[] = VectorFunc.constructOrthogonalBasis(
    VectorN.from(1, 0),
    VectorN.from(2, 3),
    VectorN.from(5, 4),
    VectorN.from(3, 0),
  )

  expect(result.length).toBe(2)
  expect(result[0].valuesEqual(VectorN.from(1, 0))).toBe(true)
  expect(result[1].valuesEqual(VectorN.from(0, 3))).toBe(true)
})

test ('sampleMean for 4 vectors with 3 dimensions', () => {
  const result = VectorFunc.sampleMean(
    VectorN.from(1, 2, 1),
    VectorN.from(4, 2, 13),
    VectorN.from(7, 8, 1),
    VectorN.from(8, 4, 5),
  )

  expect(result.valuesEqual(VectorN.from(5, 4, 5))).toBe(true)
})

test ('sampleCovariance for 4 vectors with 3 dimensions', () => {
  const result = VectorFunc.sampleMean(
    VectorN.from(1, 2, 1),
    VectorN.from(4, 2, 13),
    VectorN.from(7, 8, 1),
    VectorN.from(8, 4, 5),
  )

  expect(result.valuesEqual(VectorN.from(5, 4, 5))).toBe(true)
})