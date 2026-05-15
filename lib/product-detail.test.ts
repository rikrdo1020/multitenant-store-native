import { describe, expect, it } from '@jest/globals';
import {
  getMissingOptionNames,
  getProductDescriptionText,
  getSelectedOptionsForCart,
  normalizeProductOptions,
} from './product-detail';

describe('product detail helpers', () => {
  it('GIVEN array options WHEN normalizing SHOULD keep valid option groups', () => {
    const options = normalizeProductOptions([
      { name: 'Talla', values: ['38', '39'] },
      { name: '', values: ['Azul'] },
      { name: 'Color', values: [] },
    ]);

    expect(options).toEqual([{ name: 'Talla', values: ['38', '39'] }]);
  });

  it('GIVEN object options WHEN normalizing SHOULD convert entries to option groups', () => {
    const options = normalizeProductOptions({
      Talla: ['38', '39'],
      Color: ['Negro'],
    });

    expect(options).toEqual([
      { name: 'Talla', values: ['38', '39'] },
      { name: 'Color', values: ['Negro'] },
    ]);
  });

  it('GIVEN required options WHEN some are unselected SHOULD return missing option names', () => {
    const missing = getMissingOptionNames(
      [
        { name: 'Talla', values: ['38'] },
        { name: 'Color', values: ['Negro'] },
      ],
      { Talla: '38' },
    );

    expect(missing).toEqual(['Color']);
  });

  it('GIVEN selected options WHEN building cart payload SHOULD only include product option names', () => {
    const payload = getSelectedOptionsForCart(
      [{ name: 'Talla', values: ['38'] }],
      { Talla: '38', Ignored: 'value' },
    );

    expect(payload).toEqual({ Talla: '38' });
  });

  it('GIVEN backend JSON description WHEN formatting SHOULD return readable text', () => {
    const description = getProductDescriptionText({
      type: 'doc',
      content: 'Premium wireless headphones with noise cancellation.',
    });

    expect(description).toBe('Premium wireless headphones with noise cancellation.');
  });
});
