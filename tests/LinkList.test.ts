import { beforeEach, describe, expect, test } from 'vitest'
import { LinkList } from '../src/LinkList/LinkList'

describe('LinkList', () => {
  let linkList: LinkList<number>

  beforeEach(() => {
    linkList = new LinkList<number>()
  })

  test('should return null when index is out of bounds', () => {
    expect(linkList.remove(-1)).toBeNull()
    expect(linkList.remove(100)).toBeNull()
  })

  test('should remove the first node', () => {
    linkList.push(1)
    linkList.push(2)
    linkList.push(3)

    const removedNode = linkList.remove(0)

    expect(removedNode?.value).toEqual(1)
    expect(linkList.length).toEqual(2)
  })

  test('should remove the middle node', () => {
    linkList.push(1)
    linkList.push(2)
    linkList.push(3)

    const removedNode = linkList.remove(1)

    expect(removedNode?.value).toEqual(2)
    expect(linkList.length).toEqual(2)
  })

  test('should remove the last node', () => {
    linkList.push(1)
    linkList.push(2)
    linkList.push(3)

    const removedNode = linkList.remove(2)

    expect(removedNode?.value).toEqual(3)
    expect(linkList.length).toEqual(2)
  })
})
