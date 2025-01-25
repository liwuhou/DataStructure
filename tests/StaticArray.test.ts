import { StaticArray } from '@/Array/StaticArray'
import { beforeEach, describe, expect, test, vi } from 'vitest'

describe('StaticArray', () => {
  let arr: StaticArray<number>
  const MAX_CAPACITY = 10
  beforeEach(() => {
    arr = new StaticArray<number>(MAX_CAPACITY)
  })

  test('Should have initial length of 0', () => {
    expect(arr.length).toBe(0)
  })

  test('Set elements and get elements correctly', () => {
    arr.set(0, 1)
    expect(arr.length).toBe(1)
    expect(arr.get(0)).toBe(1)
  })

  test('Set and get Edge case', () => {
    arr.set(10, 0)
    expect(arr.length).toBe(0)
    expect(arr.get(1000)).toBeUndefined()
  })

  test('Push some element', () => {
    arr.push(0)
    expect(arr.get(0)).toBe(0)
    expect(arr.length).toBe(1)

    expect(arr.push(1, 2, 3, 4)).toBe(5)
    // overflow capacity
    expect(arr.push(5, 6, 7, 8, 9, 10)).toBe(MAX_CAPACITY)
    expect(arr.push(10)).toBe(MAX_CAPACITY)
  })

  test('Pop some element', () => {
    arr.push(0)
    expect(arr.pop()).toBe(0)
    expect(arr.length).toBe(0)

    expect(arr.pop()).toBeUndefined()
  })

  test("Should return the array's length when unshift a element to array", () => {
    expect(arr.unshift(0)).toBe(1)
    expect(arr.unshift(1)).toBe(arr.length)

    expect(arr.unshift(...[2, 3, 4, 5])).toBe(6)
    expect(arr.unshift(6, 7, 8, 9, 10)).toBe(MAX_CAPACITY)
    expect(arr.unshift(1000)).toBe(MAX_CAPACITY)
  })

  test('Shoule return the first element when shift a element from array', () => {
    arr.push(1, 0)
    expect(arr.shift()).toBe(1)
    expect(arr.length).toBe(1)
    expect(arr.shift()).toBe(0)
    expect(arr.shift()).toBeUndefined()
  })

  test("Shoule find any element's index of the array", () => {
    arr.push(0, 1, 2, 3, 1)
    expect(arr.indexOf(1)).toBe(1)
    expect(arr.indexOf(0)).toBe(0)
    expect(arr.indexOf(3)).toBe(3)
    arr.shift()
    expect(arr.indexOf(0)).toBe(-1)
    expect(arr.indexOf(1)).toBe(0)

    arr.clear()
    expect(arr.length).toBe(0)
    expect(arr.indexOf(1000)).toBe(-1)
  })

  test("Shoule find any element's indx of the array with last order", () => {
    arr.push(0, 1, 2, 3, 1)
    expect(arr.indexOf(1)).toBe(1)
    expect(arr.lastIndexOf(1)).toBe(4)
    expect(arr.lastIndexOf(4)).toBe(-1)
    arr.clear()
    expect(arr.lastIndexOf(1000)).toBe(-1)
  })

  test('Shoule return the element that be found in the array', () => {
    const arr = new StaticArray<{ id: number; name: string }>(3)
    arr.push({ id: 0, name: 'Skye' }, { id: 1, name: 'William' })
    expect(arr.find((item) => item.name === 'William')).toEqual({
      id: 1,
      name: 'William',
    })

    expect(arr.find((item) => item.name === 'nobody')).toBeUndefined()
    arr.clear()
    expect(arr.find((item) => item.name === 'William')).toBeUndefined()
  })

  test('Find the element in the array with last order', () => {
    const arr = new StaticArray<{ id: number; name: string }>(3)
    arr.push(
      { id: 0, name: 'Skye' },
      { id: 1, name: 'William' },
      { id: 3, name: 'Skye' },
    )
    expect(arr.findLast((item) => item.name === 'Skye')).toEqual({
      id: 3,
      name: 'Skye',
    })
    expect(arr.findLast((item) => item.name === 'nobody')).toBeUndefined()
    arr.clear()
    expect(arr.findLast((item) => item.name === 'Skye')).toBeUndefined()
  })

  test('Should map the array correctly, do not change origin array', () => {
    arr.push(...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    const cloneArr = arr.clone()
    const doubleArray = new StaticArray<number>(10)
    doubleArray.push(...[0, 2, 4, 6, 8, 10, 12, 14, 16, 18])
    expect(arr.map((item) => item * 2)).toEqual(doubleArray)
    expect(arr).toEqual(cloneArr)
  })

  test('Should call callback for eatch item in the array', () => {
    const callback = vi.fn()
    const originSourceList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    arr.push(...originSourceList)

    arr.forEach(callback)

    expect(callback.mock.calls.length).toBe(arr.length)
    for (let i = 0; i < arr.length; i++) {
      expect(callback.mock.calls[i]).toEqual([originSourceList[i], i, arr])
    }
  })

  test('Should return a whole new array from clone', () => {
    const arr = new StaticArray<number[]>(2)
    arr.push([1], [2, 3])
    const deepClonedArr = arr.clone(true)

    expect(arr).toEqual(deepClonedArr)
    expect(arr === deepClonedArr).toBeFalsy()
    expect(arr.get(0)).toEqual(deepClonedArr.get(0))
    expect(arr.get(0) === deepClonedArr.get(0)).toBeFalsy()
  })

  test('Filter should return a new StaticArray with filtered items', () => {
    const originSourceList = [0, 1, 2, 3, 4, 5]
    arr.push(...originSourceList)

    const filteredArr = arr.filter((item) => item % 2)
    expect(filteredArr.length).toBe(3)
    expect(filteredArr.get(0)).toBe(1)
    expect(filteredArr.get(1)).toBe(3)
    expect(filteredArr.get(2)).toBe(5)
    expect(arr.length).toBe(originSourceList.length)

    expect(arr.filter((item) => item > 5).length).toBe(0)
  })

  test('Should return a new reduced array from origin array', () => {
    const originList = [1, 2, 3, 4, 5]
    arr.push(...originList)
    const res = originList.reduce((pre, curr) => pre + curr)
    const res1 = originList.reduce((pre, curr) => {
      pre.push(String(curr))
      return pre
    }, new Array<string>())

    expect(arr.reduce((pre, curr) => pre + curr)).toBe(res)
    expect(arr.reduce((pre, curr) => pre + curr, 0)).toBe(res)
    expect(
      arr.reduce((pre: StaticArray<number>, curr: number) => {
        if (curr % 2 === 0) {
          pre.push(curr + 1)
        }
        return pre
      }, new StaticArray<number>(MAX_CAPACITY)),
    ).toEqual(
      arr
        .clone()
        .filter((item) => item % 2 === 0)
        .map((item) => item + 1),
    )
    arr.clear()
    expect(arr.reduce(() => 1)).toThrowError(TypeError)
  })

  test('Should concat other array correctly', () => {
    arr.push(0, 1)
    expect([...arr.concat([2, 3, 4])]).toEqual([0, 1, 2, 3, 4])
  })

  test('Should return true when item is in the array', () => {
    arr.push(2)
    expect(arr.includes(2)).toBeTruthy()
  })

  test('Should return false when item is not in the array', () => {
    expect(arr.includes(2)).toBeFalsy()
  })

  test('Should iterate the array', () => {
    const originList = [0, 1, 2, 3, 4, 5]
    arr.push(...originList)

    for (let i = 0; i < arr.length; i++) {}

    let idx = 0
    for (const item of arr) {
      expect(item).toBe(originList[idx++])
    }

    expect([...arr]).toEqual(originList)
  })
})
