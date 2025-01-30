import { validate } from 'class-validator';
import { CreateClientDto } from './create-client.dto';
import { TypeBusiness } from '../entities/client.entity';
import { Gender } from 'src/enums/gender.enum';

describe('CreateClientDto', () => {
  it('should validate a valid DTO', async () => {
    // Arrange
    const dto = new CreateClientDto();
    dto.name = 'John';
    dto.lastname = 'Doe';
    dto.email = 'john.doe@example.com';
    dto.photo = 'profile.jpg';
    dto.code_country = '+1';
    dto.phone = '1234567890';
    dto.id = 'A123456';
    dto.type_business = TypeBusiness.B2B;
    dto.gender = Gender.MASCULINO;
    dto.info = 'Some client info';
    dto.google = 1;
    dto.status = 1;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should fail if name is missing', async () => {
    // Arrange
    const dto = new CreateClientDto();

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail if name is not a string', async () => {
    // Arrange
    const dto = new CreateClientDto();
    dto.name = 123 as any; // Invalid type

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  
  it('should fail if email is not a valid format', async () => {
    // Arrange
    const dto = new CreateClientDto();
    dto.name = 'John';
    dto.email = 'invalid-email'; // Invalid email format

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  

  it('should allow type_business to be optional but only accept enum values', async () => {
    // Arrange
    const dtoValid = new CreateClientDto();
    dtoValid.name = 'John';
    dtoValid.gender = Gender.OTRO;
    dtoValid.type_business = TypeBusiness.B2C;

    const dtoInvalid = new CreateClientDto();
    dtoInvalid.name = 'John';
    dtoInvalid.type_business = 'InvalidType' as any; // Invalid enum value

    // Act
    const validErrors = await validate(dtoValid);
    const invalidErrors = await validate(dtoInvalid);

    // Assert
    expect(validErrors).toHaveLength(0);
    expect(invalidErrors.length).toBeGreaterThan(0);
    expect(invalidErrors[0].property).toBe('type_business');
  });

  it('should fail if gender is missing', async () => {
    // Arrange
    const dto = new CreateClientDto();
    dto.name = 'John';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('gender');
  });

  it('should fail if gender is not a valid enum value', async () => {
    // Arrange
    const dto = new CreateClientDto();
    dto.name = 'John';
    dto.gender = 'Unknown' as any; // Invalid enum value

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('gender');
  });
});
