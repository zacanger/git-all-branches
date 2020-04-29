import { execSync } from 'child_process'

const remoteName = process.argv[2] || 'origin'

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

// eslint-disable-next-line fp/no-nil
export default () => {
  console.log('remote', remoteBranches)
  console.log('local', localBranches)
  console.log('current', currentBranch)
}

// display: all branch names, sorted
// current branch at the bottom with a star next to it
// other branches: mark whether they only exist locally,
// only exist on the remote, or exist in both places
