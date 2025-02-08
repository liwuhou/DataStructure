import { StaticArray } from './StaticArray'

const INITIAL_CAPACITY = 10

export class DynamicArray<T> {
  private list: StaticArray<T>
  private capacity: number

  constructor() {
    this.capacity = INITIAL_CAPACITY
    this.list = new StaticArray<T>(INITIAL_CAPACITY)
  }

  get length() {
    return this.list.length
  }

  private makeSureCapacity(willInsertItemsCount = 1) {
    if (this.length + willInsertItemsCount >= this.capacity / 2) {
      // need enlarger array's capacity
      const originList = this.list
      this.capacity = this.capacity * 2 + willInsertItemsCount
      this.list = new StaticArray<T>(this.capacity)

      for (let i = 0; i < originList.length; i++) {
        this.list.set(i, originList.get(i) as T)
      }
    }
  }

  get(index: number): T | undefined {
    return this.list.get(index)
  }

  set(index: number, value: T) {
    this.makeSureCapacity()
    this.list.set(index, value)
  }

  clone(deep = false): DynamicArray<T> {
    const newStaticArray = new DynamicArray<T>()

    for (let i = 0; i < this.length; i++) {
      const newValue = deep
        ? structuredClone(this.get(i) as T)
        : (this.get(i) as T)
      newStaticArray.set(i, newValue)
    }

    return newStaticArray
  }

  clear() {
    this.capacity = INITIAL_CAPACITY
    this.list = new StaticArray<T>(this.capacity)
  }

  push(...values: T[]): number {
    // this.makeSureCapacity(values.length)

    // return this.list.push(...values)
    for (const value of values) {
      this.makeSureCapacity()
      this.list.set(this.length, value)
    }
    return this.length
  }

  pop(): T | undefined {
    return this.list.pop()
  }

  unshift(...values: T[]): number {
    // FIXME:
    this.makeSureCapacity(values.length)
    if (this.length !== 0) {
      for (let i = this.length + values.length - 1; i >= 0; i--) {
        this.list.set(i + values.length, this.list.get(i) as T)
      }
    }
    for (let i = 0; i < values.length; i++) {
      this.list.set(i, values[i])
    }

    return this.length
  }

  shift(): T | undefined {
    return this.list.shift()
  }

  indexOf(value: T): number {
    return this.list.indexOf(value)
  }

  lastIndexOf(value: T): number {
    return this.list.lastIndexOf(value)
  }

  find(callback: (item: T) => boolean): T | undefined {
    return this.list.find(callback)
  }

  findLast(callback: (item: T) => boolean): T | undefined {
    return this.list.findLast(callback)
  }

  map<U = T>(callback: (item: T, index: number, arr: this) => U) {
    const newStaticArray = new DynamicArray<U>()
    for (let i = 0; i < this.length; i++) {
      newStaticArray.set(i, callback(this.get(i) as T, i, this) as U)
    }
    return newStaticArray
  }

  forEach(callback: (item: T, index: number, arr: this) => void) {
    for (let i = 0; i < this.length; i++) {
      callback(this.list.get(i) as T, i, this)
    }
  }

  filter<S extends T>(
    callback: (value: T, index: number, arr: this) => unknown,
  ): DynamicArray<S> {
    const newStaticArray = new DynamicArray<S>()
    for (let i = 0; i < this.length; i++) {
      if (callback(this.list.get(i) as T, i, this))
        newStaticArray.push(this.list.get(i) as S)
    }

    return newStaticArray
  }

  reduce<U = T>(
    callback: (
      previousValud: U,
      currentValue: T,
      currentIndex: number,
      array: this,
    ) => U,
  ): U
  reduce<U = T>(
    callback: (
      previousValud: U,
      currentValue: T,
      currentIndex: number,
      array: this,
    ) => U,
    initialValue: U,
  ): U
  reduce<U>(
    callback: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: this,
    ) => U,
    initialValue?: U,
  ): U | TypeError {
    const hasInitValue = typeof initialValue !== 'undefined'
    if (!this.length && !hasInitValue)
      return new TypeError('Reduce of empty StaticArray with no initial value')
    let _initialValue = hasInitValue ? initialValue : (this.get(0) as U)

    for (let i = hasInitValue ? 0 : 1; i < this.length; i++) {
      _initialValue = callback(_initialValue, this.get(i) as T, i, this)
    }

    return _initialValue
  }

  concat(
    otherList: StaticArray<T> | DynamicArray<T> | Array<T>,
  ): DynamicArray<T> {
    const newList = this.clone()
    for (const item of otherList) {
      item && newList.push(item)
    }
    return newList
  }

  includes(item: T): boolean {
    for (const element of this) {
      if (Object.is(item, element)) return true
    }
    return false
  }

  [Symbol.iterator]() {
    let currentIndex = 0
    return {
      next: () => {
        if (currentIndex < this.length) {
          return { value: this.get(currentIndex++), done: false }
        }
        return { done: true }
      },
    }
  }
}
