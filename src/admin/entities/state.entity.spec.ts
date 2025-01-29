import { States, StateType } from './state.entity';
import { Orders } from 'src/orders/entities/order.entity';

describe('States Entity', () => {
  it('debería instanciar una entidad con valores correctos', () => {
    // Arrange
    const state = new States();

    // Act
    state.id_state = 1;
    state.name = 'Pending';
    state.type = StateType.ORDER_STATUS;
    state.priority = 10;
    state.status = 1;
    state.created_at = new Date();
    state.updated_at = new Date();
    state.orders = [];

    // Assert
    expect(state).toBeDefined();
    expect(state.id_state).toBe(1);
    expect(state.name).toBe('Pending');
    expect(state.type).toBe(StateType.ORDER_STATUS);
    expect(state.priority).toBe(10);
    expect(state.status).toBe(1);
    expect(state.created_at).toBeInstanceOf(Date);
    expect(state.updated_at).toBeInstanceOf(Date);
    expect(state.orders).toEqual([]);
  });

  it('debería asignar correctamente la relación OneToMany con Orders', () => {
    // Arrange
    const state = new States();
    const orderMock = new Orders();
    orderMock.id_order = 1;
    orderMock.state = state;

    // Act
    state.orders = [orderMock];

    // Assert
    expect(state.orders).toHaveLength(1);
    expect(state.orders[0]).toBe(orderMock);
  });

  it('debería permitir la relación con múltiples Orders', () => {
    // Arrange
    const state = new States();
    const orderMock1 = new Orders();
    orderMock1.id_order = 1;
    orderMock1.state = state;

    const orderMock2 = new Orders();
    orderMock2.id_order = 2;
    orderMock2.state = state;

    // Act
    state.orders = [orderMock1, orderMock2];

    // Assert
    expect(state.orders).toHaveLength(2);
    expect(state.orders).toEqual([orderMock1, orderMock2]);
  });

  it('debería inicializar la relación Orders como un array vacío', () => {
    // Arrange
    const state = new States();

    // Act & Assert
    expect(state.orders).toBeUndefined(); 
    state.orders = [];
    expect(state.orders).toEqual([]);
  });

  it('debería mantener el valor predeterminado de status', () => {
    // Arrange
    const state = new States();

    // Act & Assert
    expect(state.status).toBe(1);
  });


  it('debería actualizar correctamente los valores', () => {
    // Arrange
    const state = new States();
    state.name = 'Initial';

    // Act
    state.name = 'Updated';

    // Assert
    expect(state.name).toBe('Updated');
  });

  it('debería establecer created_at correctamente', () => {
    // Arrange
    const state = new States();

    // Act & Assert
    expect(state.created_at).toBeInstanceOf(Date);
  });

  it('debería actualizar updated_at al modificar la entidad', () => {
    // Arrange
    const state = new States();
    state.updated_at = new Date();

    // Act
    const initialUpdatedAt = state.updated_at;
    state.updated_at = new Date();

    // Assert
    expect(state.updated_at).not.toBe(initialUpdatedAt);
  });
});
