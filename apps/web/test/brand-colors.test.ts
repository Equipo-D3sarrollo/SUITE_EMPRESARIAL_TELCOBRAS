import { describe, expect, it } from 'vitest';
import { BRAND_COLORS } from '../src/components/page-background';

const TELCOBRAS_COLORS = ['#88BD4C', '#2491CC', '#F3CB35'];

describe('PageBackground brand colors', () => {
  it('uses only the three official Telcobras colors', () => {
    expect([...BRAND_COLORS]).toEqual(TELCOBRAS_COLORS);
    expect(BRAND_COLORS).toHaveLength(3);
  });
});
