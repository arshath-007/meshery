import { describe, expect, it } from 'vitest';
import { updateVisibleColumns, getResponsiveColumnVisibility } from '../responsive-column';

describe('updateVisibleColumns', () => {
  it('marks "na" columns as never visible', () => {
    expect(updateVisibleColumns([['hidden', 'na']], 10000)).toEqual({ hidden: false });
  });

  it('marks "xs" columns as always visible', () => {
    expect(updateVisibleColumns([['shown', 'xs']], 0)).toEqual({ shown: true });
    expect(updateVisibleColumns([['shown', 'xs']], 10000)).toEqual({ shown: true });
  });

  it('respects the s breakpoint', () => {
    expect(updateVisibleColumns([['c', 's']], 689)).toEqual({ c: false });
    expect(updateVisibleColumns([['c', 's']], 690)).toEqual({ c: true });
  });

  it('respects the m breakpoint', () => {
    expect(updateVisibleColumns([['c', 'm']], 774)).toEqual({ c: false });
    expect(updateVisibleColumns([['c', 'm']], 775)).toEqual({ c: true });
  });

  it('respects the l breakpoint', () => {
    expect(updateVisibleColumns([['c', 'l']], 914)).toEqual({ c: false });
    expect(updateVisibleColumns([['c', 'l']], 915)).toEqual({ c: true });
  });

  it('respects the xl breakpoint', () => {
    expect(updateVisibleColumns([['c', 'xl']], 1139)).toEqual({ c: false });
    expect(updateVisibleColumns([['c', 'xl']], 1140)).toEqual({ c: true });
  });

  it('treats unknown screen sizes as minimum width zero', () => {
    expect(updateVisibleColumns([['c', 'unknown']], 0)).toEqual({ c: true });
  });

  it('handles multiple columns', () => {
    expect(
      updateVisibleColumns(
        [
          ['a', 'xs'],
          ['b', 's'],
          ['c', 'l'],
          ['d', 'na'],
        ],
        800,
      ),
    ).toEqual({ a: true, b: true, c: false, d: false });
  });

  it('returns an empty object for an empty array', () => {
    expect(updateVisibleColumns([], 500)).toEqual({});
  });

  it.each([null, undefined, 'invalid', {}, 123])(
    'returns an empty object for invalid colViews: %s',
    (colViews) => {
      expect(updateVisibleColumns(colViews, 800)).toEqual({});
    },
  );

  it('ignores nullish and malformed column tuples', () => {
    expect(
      updateVisibleColumns(
        [null, undefined, 'invalid', [], [''], ['valid'], ['also-valid', 'xs']],
        800,
      ),
    ).toEqual({ 'also-valid': true });
  });

  it('ignores tuples with invalid column names or screen sizes', () => {
    expect(
      updateVisibleColumns(
        [
          [null, 'xs'],
          [123, 's'],
          ['invalid', null],
          ['valid', 'xs'],
        ],
        800,
      ),
    ).toEqual({ valid: true });
  });

  it.each([NaN, Infinity, -Infinity, '800', null, undefined])(
    'uses zero as the fallback for invalid width: %s',
    (width) => {
      expect(updateVisibleColumns([['small', 's']], width)).toEqual({
        small: false,
      });
      expect(updateVisibleColumns([['always', 'xs']], width)).toEqual({
        always: true,
      });
    },
  );
});

describe('getResponsiveColumnVisibility', () => {
  it('returns visibility keyed by the supplied column list', () => {
    const colViews = [
      ['name', 'xs'],
      ['size', 'l'],
      ['hidden', 'na'],
    ];
    expect(getResponsiveColumnVisibility(['name', 'size', 'hidden'], colViews, 800)).toEqual({
      name: true,
      size: false,
      hidden: false,
    });
  });

  it('yields undefined for columns missing from colViews', () => {
    const result = getResponsiveColumnVisibility(['name', 'missing'], [['name', 'xs']], 800);
    expect(result.name).toBe(true);
    expect(result.missing).toBeUndefined();
  });

  it('returns an empty object when no column names are supplied', () => {
    expect(getResponsiveColumnVisibility([], [['name', 'xs']], 800)).toEqual({});
  });

  it.each([null, undefined, 'invalid', {}])(
    'returns an empty object for invalid columnNames: %s',
    (columnNames) => {
      expect(getResponsiveColumnVisibility(columnNames, [['name', 'xs']], 800)).toEqual({});
    },
  );

  it('ignores invalid entries in columnNames', () => {
    expect(
      getResponsiveColumnVisibility(
        ['name', null, 123, '', 'hidden'],
        [
          ['name', 'xs'],
          ['hidden', 'na'],
        ],
        800,
      ),
    ).toEqual({ name: true, hidden: false });
  });

  it('handles invalid colViews safely', () => {
    expect(getResponsiveColumnVisibility(['name', 'size'], null, 800)).toEqual({
      name: undefined,
      size: undefined,
    });
  });
});
