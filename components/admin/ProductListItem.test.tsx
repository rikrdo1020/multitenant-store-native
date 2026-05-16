import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ProductListItem } from './ProductListItem';
import type { Product } from '@/types';

const product: Product = {
  documentId: 'prod_001',
  slug: 'camisa-test',
  name: 'Camisa Test',
  price: 25,
  stock: 10,
  images: ['https://example.com/camisa.jpg'],
  category: { documentId: 'cat_1', slug: 'ropa', name: 'Ropa' },
  productStatus: 'published',
};

describe('ProductListItem', () => {
  it('SHOULD render product name, price and category', () => {
    render(
      <ProductListItem
        product={product}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('Camisa Test')).toBeTruthy();
    expect(screen.getByText('Ropa')).toBeTruthy();
    expect(screen.getByText('Publicado')).toBeTruthy();
  });

  it('SHOULD call onEdit when edit button pressed', () => {
    const onEdit = jest.fn();
    const { getByTestId } = render(
      <ProductListItem
        product={product}
        onEdit={onEdit}
        onDelete={jest.fn()}
      />
    );

    // Edit button is first touchable in the actions row
    const editButton = getByTestId('edit-button');
    fireEvent.press(editButton);
    expect(onEdit).toHaveBeenCalledWith(product);
  });

  it('SHOULD call onDelete when delete button pressed', () => {
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <ProductListItem
        product={product}
        onEdit={jest.fn()}
        onDelete={onDelete}
      />
    );

    const deleteButton = getByTestId('delete-button');
    fireEvent.press(deleteButton);
    expect(onDelete).toHaveBeenCalledWith(product);
  });
});
