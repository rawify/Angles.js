const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
const { runInNewContext } = require('node:vm');
const { describe, it } = require('node:test');

function verifyAngles(Angles) {
  Angles.SCALE = 360;
  assert.equal(Angles.normalize(-10), 350);
  assert.equal(Angles.compass(225), 'SW');
}

describe('package distributions', () => {
  it('exports the class directly from CommonJS with aliases', () => {
    const Angles = require('..');
    verifyAngles(Angles);
    assert.equal(Angles.default, Angles);
    assert.equal(Angles.Angles, Angles);
  });

  it('exports default and named classes from ESM', async () => {
    const module = await import('../dist/angles.mjs');
    verifyAngles(module.default);
    assert.equal(module.Angles, module.default);
  });

  it('provides a standalone browser ESM build', async () => {
    const module = await import('../dist/angles.min.mjs');
    verifyAngles(module.default);
    assert.equal(module.Angles, module.default);
  });

  it('provides browser global and AMD builds', async () => {
    const source = await readFile(resolve(__dirname, '../dist/angles.min.js'), 'utf8');
    const globalContext = {};
    runInNewContext(source, globalContext);
    verifyAngles(globalContext.Angles);

    let amdFactory;
    const define = (_dependencies, factory) => {
      amdFactory = factory;
    };
    define.amd = {};
    runInNewContext(source, { define });
    assert.equal(typeof amdFactory, 'function');
    verifyAngles(amdFactory());
  });
});
