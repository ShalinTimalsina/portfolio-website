import { expect, test, describe } from 'vitest'
import { normalizePath, resolveNode, resolveParentAndName, initialFS, HOME_DIR } from './fs'

describe('Path Resolver', () => {
  test('normalizePath', () => {
    expect(normalizePath('projects', HOME_DIR)).toBe('/home/shalin/portfolio/projects')
    expect(normalizePath('./skills', HOME_DIR)).toBe('/home/shalin/portfolio/skills')
    expect(normalizePath('../skills', HOME_DIR + '/projects')).toBe('/home/shalin/portfolio/skills')
    expect(normalizePath('/etc/passwd', HOME_DIR)).toBe('/etc/passwd')
    expect(normalizePath('~', '/tmp')).toBe('/home/shalin/portfolio')
    expect(normalizePath('~/contact', '/tmp')).toBe('/home/shalin/portfolio/contact')
    expect(normalizePath('.', HOME_DIR)).toBe('/home/shalin/portfolio')
    expect(normalizePath('projects/../skills/./', HOME_DIR)).toBe('/home/shalin/portfolio/skills')
  })

  test('resolveNode', () => {
    const node = resolveNode(initialFS, 'projects/vote-app', HOME_DIR)
    expect(node.name).toBe('vote-app')
    expect(node.type).toBe('exec')
    
    expect(() => resolveNode(initialFS, 'projects/fake', HOME_DIR)).toThrowError(/No such file or directory/)
    expect(() => resolveNode(initialFS, 'projects/vote-app/fake', HOME_DIR)).toThrowError(/Not a directory/)
  })

  test('resolveParentAndName', () => {
    const { parent, name } = resolveParentAndName(initialFS, 'projects/newfile.txt', HOME_DIR)
    expect(parent.name).toBe('projects')
    expect(parent.type).toBe('dir')
    expect(name).toBe('newfile.txt')
  })
})
