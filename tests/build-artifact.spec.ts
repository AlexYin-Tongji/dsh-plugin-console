import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'

describe('built client artifact', () => {
  it('uses the DSH lazy module loader envelope', async () => {
    const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')
    expect(source).toContain('window.__ModuleLoader__.load')
    expect(source).toContain('dsh-plugin-console')
    expect(source).not.toContain('require("react-markdown")')
    expect(source).not.toContain('require("remark-gfm")')
    expect(source).not.toContain('require("node:path")')
    expect(source).not.toContain('require("node:process")')
    expect(source).not.toContain('require("node:url")')
    const required = [...source.matchAll(/require\("([^"]+)"\)/g)].map(match => match[1]).sort()
    expect(required).toEqual([
      '@deepseek-ai/dsh-client-ui-primitives',
      'react',
      'react/jsx-runtime',
    ])
  })

  it('evaluates against the rc.6 module-map contract and registers the Manage slot', async () => {
    const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')
    let registration: { factory: (require: (id: string) => unknown) => any } | null = null
    const window = { __ModuleLoader__: { load(value: typeof registration) { registration = value } } }
    const document = {
      querySelector: () => null,
      createElement: () => ({ dataset: {}, textContent: '' }),
      head: { appendChild: () => undefined },
    }
    Function('window', 'document', source)(window, document)
    expect(registration).not.toBeNull()
    const require = createRequire(import.meta.url)
    const exports = registration!.factory((id) => {
      if (id === 'react' || id === 'react/jsx-runtime') return require(id)
      if (id === '@deepseek-ai/dsh-client-ui-primitives') return {}
      throw new Error(`unexpected client module ${id}`)
    })
    let registeredId: string | null = null
    exports.apply({
      effect: (factory: () => unknown) => factory(),
      locale: {
        register: () => () => undefined,
        bind: () => (key: string) => key,
        getLocale: () => ({ active: 'en' }),
      },
      slots: {
        inject: (_name: string, factory: () => unknown) => factory(),
        register: (options: { id?: string }) => { registeredId = options.id ?? null; return () => undefined },
      },
    })
    expect(registeredId).toBe('manage')
  })
})
