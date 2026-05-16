import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('SHOULD render title and message when visible', () => {
    render(
      <ConfirmDialog
        visible={true}
        title="Eliminar?"
        message="Esta acción no se puede deshacer"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText('Eliminar?')).toBeTruthy();
    expect(screen.getByText('Esta acción no se puede deshacer')).toBeTruthy();
  });

  it('SHOULD call onCancel when cancel button pressed', () => {
    const onCancel = jest.fn();
    render(
      <ConfirmDialog
        visible={true}
        title="Eliminar?"
        message="Esta acción no se puede deshacer"
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />
    );

    fireEvent.press(screen.getByText('Cancelar'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('SHOULD call onConfirm when confirm button pressed', () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmDialog
        visible={true}
        title="Eliminar?"
        message="Esta acción no se puede deshacer"
        onConfirm={onConfirm}
        onCancel={jest.fn()}
      />
    );

    fireEvent.press(screen.getByText('Confirmar'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('SHOULD disable cancel button while loading', () => {
    const onCancel = jest.fn();
    render(
      <ConfirmDialog
        visible={true}
        title="Eliminar?"
        message="Esta acción no se puede deshacer"
        onConfirm={jest.fn()}
        onCancel={onCancel}
        loading={true}
      />
    );

    const cancelButton = screen.getByTestId('confirm-cancel');
    fireEvent.press(cancelButton);
    expect(onCancel).not.toHaveBeenCalled();
  });
});
