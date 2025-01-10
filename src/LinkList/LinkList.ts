export class ListNode<T> implements ListNode<T> {
  value: T
  next: ListNode<T> | null
  constructor(value: T) {
    this.next = null
    this.value = value
  }
}

export class LinkList<T> implements LinkList<T> {
  private dummyHeadNode: ListNode<T>
  length: number

  constructor() {
    this.dummyHeadNode = new ListNode(null) as ListNode<T>
    this.length = 0
  }

  push(value: T): ListNode<T> {
    const targetNode = new ListNode(value)
    let tmpNode = this.dummyHeadNode

    while (tmpNode.next !== null) {
      tmpNode = tmpNode.next
    }

    tmpNode.next = targetNode
    this.length++

    return targetNode
  }

  remove(index: number): ListNode<T> | null {
    if (index < 0 || index >= this.length) return null

    let currentIndex = 0
    let currentNode = this.dummyHeadNode
    let preNode = currentNode
    // null -> 0
    // 0
    while (currentIndex++ <= index && currentNode.next) {
      preNode = currentNode
      currentNode = currentNode.next
    }

    preNode.next = currentNode.next
    currentNode.next = null

    this.length--
    return currentNode
  }
}
