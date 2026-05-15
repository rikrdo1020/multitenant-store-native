import type { Product, ProductDescription, ProductDescriptionBlock, ProductOption } from '@/types';

export function normalizeProductOptions(options?: Product['options'] | Record<string, unknown> | null): ProductOption[] {
  if (!options) return [];

  if (Array.isArray(options)) {
    return options
      .map((option) => normalizeOption(option))
      .filter((option): option is ProductOption => option !== null);
  }

  if (typeof options === 'object') {
    return Object.entries(options)
      .map(([name, value]) => normalizeOption({ name, values: value }))
      .filter((option): option is ProductOption => option !== null);
  }

  return [];
}

export function getMissingOptionNames(
  options: ProductOption[],
  selectedOptions: Record<string, string>,
): string[] {
  return options
    .filter((option) => !selectedOptions[option.name])
    .map((option) => option.name);
}

export function getSelectedOptionsForCart(
  options: ProductOption[],
  selectedOptions: Record<string, string>,
): Record<string, string> | undefined {
  if (options.length === 0) return undefined;

  const payload = options.reduce<Record<string, string>>((acc, option) => {
    const selectedValue = selectedOptions[option.name];
    if (selectedValue) {
      acc[option.name] = selectedValue;
    }
    return acc;
  }, {});

  return Object.keys(payload).length > 0 ? payload : undefined;
}

export function getProductDescriptionText(description?: ProductDescription | null): string | null {
  if (!description) return null;

  const text = extractText(description).trim();
  return text.length > 0 ? text : null;
}

function normalizeOption(input: unknown): ProductOption | null {
  if (!input || typeof input !== 'object') return null;

  const record = input as Record<string, unknown>;
  const name = typeof record.name === 'string' ? record.name.trim() : '';
  const rawValues = record.values;

  if (!name || !Array.isArray(rawValues)) return null;

  const values = rawValues
    .map((value) => (typeof value === 'string' ? value.trim() : String(value).trim()))
    .filter(Boolean);

  return values.length > 0 ? { name, values } : null;
}

function extractText(value: ProductDescription | ProductDescriptionBlock[] | ProductDescriptionBlock | unknown): string {
  if (!value) return '';

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(extractText).filter(Boolean).join('\n\n');
  }

  if (typeof value === 'object') {
    const block = value as ProductDescriptionBlock;

    if (typeof block.text === 'string') {
      return block.text;
    }

    if (typeof block.content === 'string') {
      return block.content;
    }

    if (Array.isArray(block.content)) {
      return block.content.map(extractText).filter(Boolean).join('\n\n');
    }

    if (Array.isArray(block.children)) {
      return block.children.map(extractText).filter(Boolean).join(' ');
    }
  }

  return '';
}
