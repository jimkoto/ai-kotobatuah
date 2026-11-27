import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rules = fs.readFileSync('firestore.rules', 'utf8');

test('firestore.rules enforces default deny and rules_version 2', () => {
  assert.match(rules, /rules_version\s*=\s*'2'/);
  assert.match(rules, /match \/\{document=\*\*\}\s*\{\s*allow read, write: if false;/);
});

test('firestore.rules covers all collections in firebase-blueprint.json', () => {
  const blueprint = JSON.parse(fs.readFileSync('firebase-blueprint.json', 'utf8'));
  const collections = Object.keys(blueprint.firestore).map((p) => p.split('/')[1]);
  for (const col of collections) {
    assert.ok(rules.includes(`match /${col}/`), `Missing match block for collection: ${col}`);
  }
});

test('firestore.rules enforces PII isolation and email verification', () => {
  assert.match(rules, /request\.auth\.token\.email_verified\s*==\s*true/);
  assert.match(rules, /match \/leads\/\{leadId\}[\s\S]*allow get:\s*if isValidId\(leadId\) && isAdmin\(\)/);
  assert.match(rules, /match \/leads\/\{leadId\}[\s\S]*allow list:\s*if isBootstrappedAdmin\(\)/);
  assert.match(rules, /match \/sheetsConfig\/\{configId\}[\s\S]*allow get:\s*if isValidId\(configId\) && isAdmin\(\)/);
});

test('firestore.rules enforces validation blueprints on all creates and updates', () => {
  assert.match(rules, /isValidPortfolioItem\(incoming\(\)\)/);
  assert.match(rules, /isValidTestimonial\(incoming\(\)\)/);
  assert.match(rules, /isValidHostingPartner\(incoming\(\)\)/);
  assert.match(rules, /isValidLeadInquiry\(incoming\(\)\)/);
  assert.match(rules, /isValidBlogPost\(incoming\(\)\)/);
  assert.match(rules, /isValidProcedurePage\(incoming\(\)\)/);
  assert.match(rules, /isValidSheetsConfig\(incoming\(\)\)/);
});
