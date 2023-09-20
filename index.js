#!/usr/bin/env node

const { execSync } = require('child_process')

const remoteName = process.argv[2] || 'origin'

const useCol = process.stdout.isTTY
const reset = useCol ? '\u001b[0m' : ''
const green = useCol ? '\u001b[0;32m' : ''
const yellow = useCol ? '\u001b[0;33m' : ''
const red = useCol ? '\u001b[0;31m' : ''

const isInGitRepo = () => {
  try {
    return (
      execSync('git rev-parse --is-inside-work-tree').toString().trim() ===
      'true'
    )
  } catch {
    return false
  }
}

if (!isInGitRepo()) {
  process.exit(1)
} else {
  const cleanUpLists = (s = '') =>
    s
      .split('\n')
      .map((a) => a.trim())
      .map((a) => a.replace(`${remoteName}/`, ''))
      .filter((a) => !a.includes('->'))

  try {
    execSync('git fetch --all')
  } catch (e) {
    console.error('Failed fetching, continuing with current local data', e)
  }

  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim()

  const remoteBranches = cleanUpLists(
    execSync('git branch -r').toString().trim()
  )

  const localBranches = cleanUpLists(
    execSync('git branch').toString().trim().replace('* ', '')
  )

  const uniq = (xs) => xs.filter((v, i, s) => s.indexOf(v) === i)

  const allBranches = uniq(
    [...remoteBranches, ...localBranches].sort((a, b) => a.localeCompare(b))
  )

  const onlyRemote = allBranches.filter((a) => !localBranches.includes(a))

  const onlyLocal = allBranches.filter((a) => !remoteBranches.includes(a))

  const onBoth = allBranches.filter(
    (a) => remoteBranches.includes(a) && localBranches.includes(a)
  )

  const annotatedBranches = allBranches.map((a) => {
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
}
