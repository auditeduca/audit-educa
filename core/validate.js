import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function loadSchema(name) {
  const path = join(__dirname, 'schemas', `${name}.schema.json`);
  const schema = JSON.parse(readFileSync(path, 'utf8'));
  ajv.addSchema(schema, name);
  return schema;
}

const SCHEMA_MAP = {
  'content/registry/routes.json': 'route',
  'content/registry/integrations.json': 'integrations',
  'content/registry/navigation.json': 'navigation',
  'content/pages/home.json': 'page',
  'content/templates/index.json': 'template-doc',
};

loadSchema('route');
loadSchema('integrations');
loadSchema('page');
loadSchema('calculator');
loadSchema('template-doc');
loadSchema('navigation');

export function validateFile(relativePath, schemaName) {
  const fullPath = join(ROOT, relativePath);
  if (!existsSync(fullPath)) {
    return { valid: false, errors: [`File not found: ${relativePath}`] };
  }
  const data = JSON.parse(readFileSync(fullPath, 'utf8'));
  const validate = ajv.getSchema(schemaName);
  if (!validate) {
    return { valid: false, errors: [`Schema not found: ${schemaName}`] };
  }
  const valid = validate(data);
  return {
    valid: !!valid,
    errors: valid ? [] : validate.errors.map((e) => `${e.instancePath} ${e.message}`),
  };
}

export function validateAll(options = {}) {
  const { includeCalculators = true, includeTemplates = true } = options;
  const results = [];

  for (const [file, schema] of Object.entries(SCHEMA_MAP)) {
    if (file.includes('templates') && !includeTemplates) continue;
    results.push({ file, ...validateFile(file, schema) });
  }

  if (includeCalculators) {
    const calcDir = join(ROOT, 'content/calculators');
    if (existsSync(calcDir)) {
      for (const f of readdirSync(calcDir).filter((n) => n.endsWith('.json') && n !== 'tables')) {
        results.push({
          file: `content/calculators/${f}`,
          ...validateFile(`content/calculators/${f}`, 'calculator'),
        });
      }
    }
  }

  const integrations = join(ROOT, 'content/registry/integrations.json');
  if (existsSync(integrations)) {
    const data = JSON.parse(readFileSync(integrations, 'utf8'));
    if (data.consent?.required && !existsSync(integrations)) {
      results.push({ file: 'integrations', valid: false, errors: ['integrations.json required when consent.required'] });
    }
  }

  return results;
}

export function assertValid(options = {}) {
  const results = validateAll(options);
  const failed = results.filter((r) => !r.valid);
  if (failed.length) {
    const msg = failed.map((f) => `${f.file}:\n  ${f.errors.join('\n  ')}`).join('\n');
    throw new Error(`Validation failed:\n${msg}`);
  }
  return results;
}

if (process.argv[1]?.endsWith('validate.js')) {
  try {
    assertValid();
    console.log('All validations passed.');
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
