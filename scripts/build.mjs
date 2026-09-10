import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';

const shared = {
  entryPoints: ['src/angles.ts'],
  bundle: true,
  platform: 'neutral',
  target: ['es2020'],
  legalComments: 'inline',
};

await rm('dist', { recursive: true, force: true });
await rm('.types', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

await Promise.all([
  build({
    ...shared,
    format: 'cjs',
    outfile: 'dist/angles.js',
    sourcemap: true,
    footer: {
      js: 'const AnglesExport=module.exports.default;AnglesExport.default=AnglesExport;AnglesExport.Angles=AnglesExport;module.exports=AnglesExport;',
    },
  }),
  build({
    ...shared,
    format: 'esm',
    outfile: 'dist/angles.mjs',
    sourcemap: true,
  }),
  build({
    ...shared,
    format: 'iife',
    globalName: 'Angles',
    outfile: 'dist/angles.min.js',
    minify: true,
    footer: {
      js: 'var AnglesModule=Angles;if(typeof define==="function"&&define.amd)define([],function(){return AnglesModule.default});Angles=AnglesModule.default;',
    },
  }),
  build({
    ...shared,
    format: 'esm',
    outfile: 'dist/angles.min.mjs',
    minify: true,
  }),
]);

execFileSync('npx', ['tsc', '--project', 'tsconfig.build.json'], { stdio: 'inherit' });

const declaration = await readFile('.types/angles.d.ts', 'utf8');
await Promise.all([
  writeFile('dist/angles.d.mts', declaration),
  writeFile(
    'dist/angles.d.ts',
    declaration
      .replaceAll('export type ', 'type ')
      .replace('export declare class Angles', 'declare class Angles')
      .replace(
        'export default Angles;',
        `declare namespace Angles {
  type CompassDirection = typeof DIRECTIONS[number];
  type RotationDirection = -1 | 1;
  type ShortestDirection = RotationDirection | 0;
  type PointTuple = readonly [x: number, y: number];
}
export = Angles;`,
      ),
  ),
]);

await rm('.types', { recursive: true, force: true });
