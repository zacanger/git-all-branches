import { execSync } from 'child_process'

const remoteName = process.argv[2] || 'origin'

const reset = '\u001b[0m'
const green = '\u001b[0;32m'
const yellow = '\u001b[0;33m'
const red = '\u001b[0;31m'

const cleanUpLists = (s = '') =>
  s
    .split('\n')
    .map((a) => a.trim())
    .map((a) => a.replace(`${remoteName}/`, ''))
    .filter((a) => !a.includes('->'))

const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim()

const remoteBranches = cleanUpLists(execSync('git branch -r').toString().trim())

const localBranches = cleanUpLists(
  execSync('git branch').toString().trim().replace('* ', '')
)

export const uniq = (xs: Array<string>) =>
  xs.filter((v, i, s) => s.indexOf(v) === i)

const allBranches = uniq(
  // eslint-disable-next-line fp/no-mutating-methods
  [...remoteBranches, ...localBranches].sort((a: string, b: string) =>
    a.localeCompare(b)
  )
)

const onlyRemote = allBranches.filter((a: string) => !localBranches.includes(a))
const onlyLocal = allBranches.filter((a: string) => !remoteBranches.includes(a))
const onBoth = allBranches.filter(
  (a: string) => remoteBranches.includes(a) && localBranches.includes(a)
)

const annotatedBranches = allBranches.map((a: string) => {
  let branchString = `  ${a}`
  if (a === currentBranch) {
    branchString = `* ${a}`
  }
  if (onlyRemote.includes(a)) {
    branchString = `${yellow}${branchString} (remote)${reset}`
  }
  if (onlyLocal.includes(a)) {
    branchString = `${red}${branchString} (local)${reset}`
  }
  if (onBoth.includes(a)) {
    branchString = `${green}${branchString} (both)${reset}`
  }

  return branchString
})

console.log(annotatedBranches.join('\n'))
