#!/usr/bin/env node

if (!module.parent) {
  require('./lib').default()
}
