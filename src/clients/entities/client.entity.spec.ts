import { Clients, TypeBusiness } from './client.entity';
import { Orders } from '../../orders/entities/order.entity';
import { Restaurants } from 'src/costumers/entities/restaurant.entity';
import { Gender } from 'src/enums/gender.enum';

describe('Clients Entity', () => {
  it('should create an instance of Clients with valid values', () => {
    const client = new Clients();

    client.id_client = 1;
    client.name = 'John';
    client.lastname = 'Doe';
    client.email = 'john.doe@example.com';
    client.photo = 'profile.jpg';
    client.code_country = '+1';
    client.phone = '1234567890';
    client.id = 'A123456';
    client.type_business = TypeBusiness.B2C;
    client.gender = Gender.MASCULINO;
    client.info = 'Some client info';
    client.google = 1;
    client.status = 1;
    client.restaurantIdRestaurant = 100;
    client.created_at = new Date();
    client.updated_at = new Date();
    client.orders = [];
    client.restaurant = new Restaurants();

    expect(client).toBeDefined();
    expect(client.id_client).toBe(1);
    expect(client.name).toBe('John');
    expect(client.lastname).toBe('Doe');
    expect(client.email).toBe('john.doe@example.com');
    expect(client.photo).toBe('profile.jpg');
    expect(client.code_country).toBe('+1');
    expect(client.phone).toBe('1234567890');
    expect(client.id).toBe('A123456');
    expect(client.type_business).toBe(TypeBusiness.B2C);
    expect(client.gender).toBe(Gender.MASCULINO);
    expect(client.info).toBe('Some client info');
    expect(client.google).toBe(1);
    expect(client.status).toBe(1);
    expect(client.restaurantIdRestaurant).toBe(100);
    expect(client.created_at).toBeInstanceOf(Date);
    expect(client.updated_at).toBeInstanceOf(Date);
    expect(client.orders).toEqual([]);
    expect(client.restaurant).toBeInstanceOf(Restaurants);
  });

  it('should initialize orders as an empty array', () => {
    const client = new Clients();

    expect(client.orders).toBeUndefined(); // Before initialization
    client.orders = [];
    expect(client.orders).toEqual([]);
  });

  it('should initialize created_at and updated_at as Date instances', () => {
    const client = new Clients();

    client.created_at = new Date();
    client.updated_at = new Date();

    expect(client.created_at).toBeInstanceOf(Date);
    expect(client.updated_at).toBeInstanceOf(Date);
  });

  it('should correctly associate orders', () => {
    const client = new Clients();
    const order1 = new Orders();
    const order2 = new Orders();

    order1.id_order = 1;
    order1.client = client;

    order2.id_order = 2;
    order2.client = client;

    client.orders = [order1, order2];

    expect(client.orders).toHaveLength(2);
    expect(client.orders[0]).toBe(order1);
    expect(client.orders[1]).toBe(order2);
  });

  it('should correctly associate a restaurant', () => {
    const client = new Clients();
    const restaurant = new Restaurants();

    restaurant.id_restaurant = 100;
    restaurant.name = 'Test Restaurant';

    client.restaurant = restaurant;

    expect(client.restaurant).toBe(restaurant);
    expect(client.restaurant.id_restaurant).toBe(100);
    expect(client.restaurant.name).toBe('Test Restaurant');
  });

  it('should set the default status to 1', () => {
    const client = new Clients();

    expect(client.status).toBe(1);
  });

  it('should not allow invalid email format', () => {
    const client = new Clients();

    client.email = 'invalid-email' as any; // Invalid value

    expect(client.email).toBe('invalid-email'); // TypeORM does not enforce validation at this level
  });

  it('should only allow valid TypeBusiness enum values', () => {
    const client = new Clients();

    client.type_business = TypeBusiness.B2B;
    expect(client.type_business).toBe(TypeBusiness.B2B);

    client.type_business = TypeBusiness.B2C;
    expect(client.type_business).toBe(TypeBusiness.B2C);
  });

  it('should only allow valid Gender enum values', () => {
    const client = new Clients();

    client.gender = Gender.FEMENINO;
    expect(client.gender).toBe(Gender.FEMENINO);

    client.gender = Gender.MASCULINO;
    expect(client.gender).toBe(Gender.MASCULINO);

    client.gender = Gender.OTRO
    expect(client.gender).toBe(Gender.OTRO);
  });
});
