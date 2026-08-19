// @vitest-environment jsdom

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RichReadme, resolveReadmeUrl } from '../src/client/ReadmeRenderer.tsx'

const commit = 'a'.repeat(40)
const source = `NanmiCoder/dsh-agent-teams@${commit}/README.md`

describe('README renderer', () => {
  it('renders common raw HTML and resolves GitHub-relative resources', () => {
    const { container } = render(<RichReadme
      value={'<p align="center"><strong>English</strong> · <a href="./README_ZH.md">简体中文</a></p>\n\n<p align="center"><img src="./assets/readme/hero.svg" width="100%" alt="hero"></p>'}
      source={source}
      repositoryUrl="https://github.com/NanmiCoder/dsh-agent-teams"
      gitRef={commit}
    />)
    const paragraph = container.querySelector('p')
    const link = container.querySelector('a')
    const image = container.querySelector('img')
    expect(paragraph?.getAttribute('align')).toBe('center')
    expect(link?.textContent).toContain('简体中文')
    expect(link?.getAttribute('href')).toBe(`https://github.com/NanmiCoder/dsh-agent-teams/blob/${commit}/README_ZH.md`)
    expect(link?.getAttribute('target')).toBe('_blank')
    expect(link?.getAttribute('rel')).toContain('noopener')
    expect(image?.getAttribute('src')).toBe(`https://raw.githubusercontent.com/NanmiCoder/dsh-agent-teams/${commit}/assets/readme/hero.svg`)
    expect(image?.getAttribute('loading')).toBe('lazy')
  })

  it('drops executable HTML and unsafe URLs', () => {
    const { container } = render(<RichReadme
      value={'<script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(2)"><a href="javascript:alert(3)" onclick="alert(4)">bad</a>'}
      source={source}
      repositoryUrl="https://github.com/NanmiCoder/dsh-agent-teams"
      gitRef={commit}
    />)
    expect(container.querySelector('script')).toBeNull()
    expect(container.querySelector('img')?.getAttribute('src')).toBeNull()
    expect(container.querySelector('img')?.getAttribute('onerror')).toBeNull()
    expect(container.querySelector('a')?.getAttribute('href')).toBeNull()
    expect(container.querySelector('a')?.getAttribute('onclick')).toBeNull()
  })

  it('rejects traversal and dangerous schemes before rendering', () => {
    const context = { owner: 'NanmiCoder', repo: 'dsh-agent-teams', ref: commit, path: 'docs/README.md' }
    expect(resolveReadmeUrl('../../outside.txt', 'link', context)).toBeNull()
    expect(resolveReadmeUrl('javascript:alert(1)', 'link', context)).toBeNull()
    expect(resolveReadmeUrl('data:image/svg+xml,boom', 'image', context)).toBeNull()
    expect(resolveReadmeUrl('../assets/logo.svg', 'image', context)).toBe(`https://raw.githubusercontent.com/NanmiCoder/dsh-agent-teams/${commit}/assets/logo.svg`)
  })
})
