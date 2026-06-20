import { fireEvent, render, screen } from '@testing-library/react-native';
import { DashboardLowStockWidget } from './DashboardLowStockWidget';
import type { LowStockProduct } from '@/types';

const lowStockProduct: LowStockProduct = {
  documentId: 'product-1',
  productId: 'product-1',
  name: 'USB-C Hub 7-in-1',
  slug: 'usbc-hub-7in1',
  image: null,
  stock: 0,
  reservedStock: 0,
  availableStock: 0,
  stockStatus: 'out_of_stock',
};

describe('DashboardLowStockWidget', () => {
  it('GIVEN low stock products WHEN rendered SHOULD show product name and available stock', () => {
    render(
      <DashboardLowStockWidget
        products={[lowStockProduct]}
        loading={false}
        error={false}
        onRetry={jest.fn()}
        onProductPress={jest.fn()}
        onViewAll={jest.fn()}
      />,
    );

    expect(screen.getByText('USB-C Hub 7-in-1')).toBeTruthy();
    expect(screen.getByText('0 disp.')).toBeTruthy();
    expect(screen.queryByText('No hay productos en bajo stock.')).toBeNull();
  });

  it('GIVEN a product press WHEN rendered SHOULD call onProductPress with selected product', () => {
    const onProductPress = jest.fn();

    render(
      <DashboardLowStockWidget
        products={[lowStockProduct]}
        loading={false}
        error={false}
        onRetry={jest.fn()}
        onProductPress={onProductPress}
        onViewAll={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByText('USB-C Hub 7-in-1'));

    expect(onProductPress).toHaveBeenCalledWith(lowStockProduct);
  });
});
