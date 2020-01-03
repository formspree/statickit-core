import { toCamel } from '../src/util';

describe('toCamel', () => {
  it('converts snake case to camel', () => {
    expect(toCamel('first_name')).toBe('firstName');
  });

  it('converts kebab case to camel', () => {
    expect(toCamel('first-name')).toBe('firstName');
  });

  it('does not change camel case', () => {
    expect(toCamel('firstName')).toBe('firstName');
  });
});
