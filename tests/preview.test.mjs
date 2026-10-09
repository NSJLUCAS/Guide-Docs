import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as config from '../scripts/config.mjs'

test('unconfigured visitor preview stays absent and ignores retired static demo setting', () => {
  assert.equal(typeof config.resolveGuidePreview, 'function')
  assert.equal(config.resolveGuidePreview({}), '')
  assert.equal(config.resolveGuidePreview({ VITE_GUIDE_PREVIEW_URL: '  ' }), '')
  assert.equal(config.resolveGuidePreview({ VITE_DEMO_URL: 'https://retired.example.invalid' }), '')
})

test('visitor preview accepts an explicit credential-free HTTP(S) address', () => {
  assert.equal(typeof config.resolveGuidePreview, 'function')
  assert.equal(config.resolveGuidePreview({ VITE_GUIDE_PREVIEW_URL: ' https://guide.example.invalid/navigation ' }), 'https://guide.example.invalid/navigation')
  for (const url of ['not a URL', 'javascript:alert(1)', 'https://user:password@example.invalid', 'ftp://example.invalid']) {
    assert.throws(() => config.resolveGuidePreview({ VITE_GUIDE_PREVIEW_URL: url }), /VITE_GUIDE_PREVIEW_URL/)
  }
})
