export class StaticArray<T> {
  public length: number
  private capacity: number
  private list: Array<T>
  constructor(capacity: number) {
    this.length = 0
    this.capacity = capacity
    this.list = new Array<T>(this.capacity)
  }

  private checkIndexValid(index: number): boolean {
    return index >= 0 && index <= this.capacity - 1
  }

  get(index: number): T | undefined {
    return this.list?.[index]
  }

  set(index: number, value: T) {
    if (!this.checkIndexValid(index)) return
    if (!this.list[index]) this.length++
    this.list[index] = value
  }

  clone(deep = false): StaticArray<T> {
    const newStaticArray = new StaticArray<T>(this.capacity)

    for (let i = 0; i < this.length; i++) {
      const newValue = deep
        ? structuredClone(this.get(i) as T)
        : (this.get(i) as T)
      newStaticArray.set(i, newValue)
    }

    return newStaticArray
  }

  clear() {
    this.length = 0
    this.list = new Array<T>()
  }

  push(...values: T[]): number {
    if (this.length >= this.capacity) return this.length
    for (const value of values) {
      this.list[this.length++] = value
      if (this.length === this.capacity) break
    }
    return this.length
  }

  pop(): T | undefined {
    if (!this.length) return
    const deleteItem = this.list[this.length - 1]
    delete this.list[--this.length]

    return deleteItem
  }

  unshift(...values: T[]): number {
    if (this.length >= this.capacity) return this.length
    for (const value of values) {
      for (let i = this.length - 1; i >= 0; i--) {
        this.list[i + 1] = this.list[i]
      }
      this.list[0] = value
      this.length++

      if (this.length === this.capacity) break
    }

    return this.length
  }

  shift(): T | undefined {
    if (!this.length) return
    const firstItem = this.list[0]
    for (let i = 0; i < this.length; i++) {
      this.list[i] = this.list[i + 1]
    }
    this.length--

    return firstItem
  }

  indexOf(value: T): number {
    if (!this.length) return -1

    for (let i = 0; i < this.length; i++) {
      if (this.list[i] === value) return i
    }
    return -1
  }

  lastIndexOf(value: T): number {
    if (!this.length) return -1

    for (let i = this.length - 1; i >= 0; i--) {
      if (this.list[i] === value) return i
    }
    return -1
  }

  find(callback: (item: T) => boolean): T | undefined {
    if (!this.length) return

    for (let i = 0; i < this.length; i++) {
      if (callback(this.list[i])) return this.list[i]
    }
  }

  findLast(callback: (item: T) => boolean): T | undefined {
    if (!this.length) return

    for (let i = this.length - 1; i >= 0; i--) {
      if (callback(this.list[i])) return this.list[i]
    }
  }

  map<U = T>(callback: (item: T, index: number, arr: this) => U) {
    Array.prototype.map
    const newStaticArray = new StaticArray<U>(this.capacity)
    for (let i = 0; i < this.length; i++) {
      newStaticArray.set(i, callback(this.get(i) as T, i, this) as U)
    }
    return newStaticArray
  }

  forEach(callback: (item: T, index: number, arr: this) => void) {
    for (let i = 0; i < this.length; i++) {
      callback(this.list[i], i, this)
    }
  }

  filter<S extends T>(
    callback: (value: T, index: number, arr: this) => unknown,
  ): StaticArray<S> {
    const newStaticArray = new StaticArray<S>(this.capacity)
    for (let i = 0; i < this.length; i++) {
      if (callback(this.list[i], i, this))
        newStaticArray.push(this.list[i] as S)
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

  concat(otherList: StaticArray<T> | Array<T>): StaticArray<T> {
    const newList = this.clone()
    for (const item of otherList) {
      item && newList.push(item)
    }
    return newList
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
