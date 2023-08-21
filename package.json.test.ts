import {describe, expect, it} from 'vitest';
import packageJson from './package.json';

describe('package.json', () => {
  it('contains only exact versions of dependencies', () => {
    expectAllExactVersionsForDependenciesObject(packageJson.dependencies);
    expectAllExactVersionsForDependenciesObject(packageJson.devDependencies);
  });

  type DependenciesObject = Record<string, string>;
  const expectAllExactVersionsForDependenciesObject = (
    dependenciesObject: DependenciesObject,
  ) => {
    for (const [, version] of Object.entries(dependenciesObject)) {
      expect(isExactVersion(version)).toBe(true);
    }
  };

  const isExactVersion = (version: string) => /^\d+\.\d+\.\d+$/.test(version);

  describe('isExactVersion', () => {
    it('returns true for exact versions', () => {
      expect(isExactVersion('1.2.3')).toBe(true);
      expect(isExactVersion('11.2.3')).toBe(true);
      expect(isExactVersion('0.22.234')).toBe(true);
    });

    it('returns false for non-exact versions', () => {
      expect(isExactVersion('*')).toBe(false);
      expect(isExactVersion('latest')).toBe(false);
      expect(isExactVersion('~34.2.3')).toBe(false);
      expect(isExactVersion('^0.2.234')).toBe(false);
      expect(isExactVersion('1.2.3-beta')).toBe(false);
      expect(isExactVersion('1.2.3-beta.1')).toBe(false);
      expect(isExactVersion('1.2.3-beta.1+build.123')).toBe(false);
    });
  });
});
