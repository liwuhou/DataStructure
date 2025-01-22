import { beforeEach, describe, expect, test } from 'vitest'
import { StaticArray } from '../src/StaticArray/StaticArray'

describe('StaticArray', () => {
  let arr: StaticArray<number>

  beforeEach(() => {
    arr = new StaticArray(10)
  })

  test('should have initial length of 0', () => {
    expect(arr.length).toEqual(0)
  })

  test('push some element', () => {
    arr.push(0)
    expect(arr.get(0)).toEqual(0)
    expect(arr.length).toEqual(1)
  })
})
