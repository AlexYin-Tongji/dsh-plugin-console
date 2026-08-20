import { spawn } from 'node:child_process'
import { describe, expect, it } from 'vitest'
import { processExit, terminateProcessTree } from '../src/process.ts'

function processAlive(pid: number): boolean {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return (error as NodeJS.ErrnoException).code !== 'ESRCH'
  }
}

describe('managed process tree', () => {
  it('terminates a process group before returning', async () => {
    if (process.platform === 'win32') return
    const source = [
      "const { spawn } = require('node:child_process')",
      "const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' })",
      "console.log(child.pid)",
      "process.on('SIGTERM', () => {})",
      "setInterval(() => {}, 1000)",
    ].join(';')
    const parent = spawn(process.execPath, ['-e', source], {
      detached: true,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
    const exited = processExit(parent)
    const grandchildPid = await new Promise<number>((resolve, reject) => {
      let output = ''
      parent.stdout?.on('data', chunk => {
        output += String(chunk)
        const parsed = Number(output.trim())
        if (Number.isSafeInteger(parsed)) resolve(parsed)
      })
      parent.once('error', reject)
    })
    expect(processAlive(parent.pid as number)).toBe(true)
    expect(processAlive(grandchildPid)).toBe(true)
    expect(await terminateProcessTree(parent, exited, 100, 2_000)).toBe(true)
    expect(processAlive(parent.pid as number)).toBe(false)
    expect(processAlive(grandchildPid)).toBe(false)
  }, 10_000)
})
