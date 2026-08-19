const processShim = {
  cwd: (): string => '',
}

export const cwd = processShim.cwd
export default processShim
