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

  push(value: T): number {
    if (this.length >= this.capacity) return this.length
    this.list[this.length] = value
    return ++this.length
  }

  pop(): T | undefined {
    if (!this.length) return
    const deleteItem = this.list[this.length - 1]
    delete this.list[--this.length]

    return deleteItem
  }

  unshift(value: T): number {
    if (this.length >= this.capacity) return this.length
    for (let i = this.length - 1; i >= 0; i--) {
      this.list[i + 1] = this.list[i]
    }
    this.list[0] = value

    return ++this.length
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

  find(callback: (item: T) => boolean): number | undefined {
    if (!this.length) return

    for (let i = 0; i < this.length; i++) {
      if (this.list[i] === callback(this.list[i])) return i
    }
  }

  findLast(callback: (item: T) => boolean): number | undefined {
    if (!this.length) return

    for (let i = this.length - 1; i >= 0; i--) {
      if (this.list[i] === callback(this.list[i])) return i
    }
  }

  map(callback: (item: T) => StaticArray<unknown>) {
    const newStaticArray = new StaticArray<unknown>(this.capacity)
    for (let i = 0; i < this.length; i++) {
      newStaticArray.set(i, callback(this.get(i) as T))
    }
    return newStaticArray
  }

  forEach(callback: (item: T) => void) {
    for (let i = 0; i < this.length; i++) {
      callback(this.list[i])
    }
  }

  filter(callback: (item: T) => boolean): StaticArray<T> {
    const newStaticArray = new StaticArray<T>(this.capacity)
    for (let i = 0; i < this.length; i++) {
      if (callback(this.list[i])) newStaticArray.push(this.list[i])
    }

    return newStaticArray
  }
}
