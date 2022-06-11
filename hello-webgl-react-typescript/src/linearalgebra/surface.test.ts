import SurfaceMxN from "./surface";
import VectorN from "./vector";

test ('constructor initializes undefined values', () => {
  const result = new SurfaceMxN(2, 3)

  expect(result.getValue(0, 0)).toBe(undefined)
  expect(result.m).toBe(2)
  expect(result.n).toBe(3)
})


test ('transform with zero vectors will update surface', () => {
  const initial = new SurfaceMxN(2)
  const result = initial.transform(() => new VectorN(2))

  expect(result).toBe(initial)
  expect(initial.getValue(0, 0)).toEqual(new VectorN(2))
  expect(initial.getValue(1, 0)).toEqual(new VectorN(2))
  expect(initial.getValue(0, 1)).toEqual(new VectorN(2))
  expect(initial.getValue(1, 1)).toEqual(new VectorN(2))
})

test ('map will only change the returned vector', () => {
  const initial = new SurfaceMxN(2)
  const result = initial.map(() => new VectorN(2))

  expect(result).not.toBe(initial)
  expect(result.getValue(0, 0)).toEqual(new VectorN(2))
  expect(result.getValue(1, 0)).toEqual(new VectorN(2))
  expect(result.getValue(0, 1)).toEqual(new VectorN(2))
  expect(result.getValue(1, 1)).toEqual(new VectorN(2))
})
