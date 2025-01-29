import { validate } from 'class-validator';
import { CreateStatesDto } from './create-state.dto';
import { StateType } from '../entities/state.entity';

describe('CreateStatesDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = new CreateStatesDto();
    dto.id_state = 1;
    dto.name = 'Pending';
    dto.type = StateType.ORDER_STATUS;
    dto.priority = 10;
    dto.status = 1;

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should fail if the name field is missing', async () => {
    const dto = new CreateStatesDto();
    dto.id_state = 1;
    dto.type = StateType.ORDER_STATUS;
    dto.priority = 10;

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should fail if name is not a string', async () => {
    const dto = new CreateStatesDto();
    dto.id_state = 1;
    dto.name = 123 as any; 
    dto.type = StateType.ORDER_STATUS;
    dto.priority = 10;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail if type is not a valid StateType', async () => {
    const dto = new CreateStatesDto();
    dto.id_state = 1;
    dto.name = 'Pending';
    dto.type = 'InvalidType' as any; 
    dto.priority = 10;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('type');
  });

  it('should fail if priority is not a number', async () => {
    const dto = new CreateStatesDto();
    dto.id_state = 1;
    dto.name = 'Pending';
    dto.type = StateType.ORDER_STATUS;
    dto.priority = 'high' as any; 

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('priority');
  });

  it('should allow status to be optional', async () => {
    const dto = new CreateStatesDto();
    dto.id_state = 1;
    dto.name = 'Pending';
    dto.type = StateType.ORDER_STATUS;
    dto.priority = 10;

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should fail if status is not a number', async () => {
    const dto = new CreateStatesDto();
    dto.id_state = 1;
    dto.name = 'Pending';
    dto.type = StateType.ORDER_STATUS;
    dto.priority = 10;
    dto.status = 'Active' as any; 

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
  });
});
