import { expect, test, describe } from 'vitest'
import { tokenize, parse, expandVariables } from './parser'

describe('Tokenizer & Parser', () => {
  test('tokenize simple', () => {
    expect(tokenize('ls -la')).toEqual([{ type: 'word', value: 'ls' }, { type: 'word', value: '-la' }])
  })

  test('tokenize quotes and escapes', () => {
    expect(tokenize('echo "hello world"')).toEqual([{ type: 'word', value: 'echo' }, { type: 'word', value: 'hello world' }])
    expect(tokenize('echo \\"hello\\"')).toEqual([{ type: 'word', value: 'echo' }, { type: 'word', value: '"hello"' }])
  })

  test('tokenize ops', () => {
    expect(tokenize('ls | grep txt > out.txt')).toEqual([
      { type: 'word', value: 'ls' },
      { type: 'pipe', value: '|' },
      { type: 'word', value: 'grep' },
      { type: 'word', value: 'txt' },
      { type: 'redirect', value: '>' },
      { type: 'word', value: 'out.txt' }
    ])
  })

  test('parse AST', () => {
    const tokens = tokenize('ls -la | grep txt > out.txt')
    const ast = parse(tokens)
    expect(ast?.args).toEqual(['ls', '-la'])
    expect(ast?.next?.op).toBe('pipe')
    expect(ast?.next?.cmd.args).toEqual(['grep', 'txt'])
    expect(ast?.next?.cmd.redirect).toEqual({ file: 'out.txt', append: false })
  })

  test('expandVariables', () => {
    expect(expandVariables('hello $USER', { USER: 'shalin' })).toBe('hello shalin')
    expect(expandVariables('path/${PWD}', { PWD: '/home' })).toBe('path//home')
  })
})
