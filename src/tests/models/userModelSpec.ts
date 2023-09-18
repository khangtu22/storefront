import { UserRepository } from '../../models/User';
import { UserType } from '../../interfaces/User';
import { UserCreatedResponseDTO } from '../../interfaces/dtos/UserCreatedResponseDTO';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let testUserId: number;

  beforeAll(async () => {
    userRepository = new UserRepository();

    const testUser: UserType = {
      firstname: 'John',
      lastname: 'Doe',
      password: 'test123',
    };

    const createdUser = await userRepository.createUser(testUser);
    testUserId = createdUser.id;
  });

  // getAllUsers
  it('gets all users', async () => {
    const users = await userRepository.getAllUsers();
    expect(users.length).toBeGreaterThan(0);
  });

  // getUserById
  it('gets user by ID', async () => {
    const user = await userRepository.getUserById(testUserId);
    expect(user.id).toEqual(testUserId);
  });

  it('throws error if user not found', async () => {
    try {
      await userRepository.getUserById(999);
      throw new Error('Expected promise to be rejected.');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  // createUser
  it('creates a new user', async () => {
    const newUser: UserType = {
      firstname: 'Jane',
      lastname: 'Smith',
      password: 'test456',
    };

    const createdUser: UserCreatedResponseDTO =
      await userRepository.createUser(newUser);
    expect(createdUser.auth).toBe(true);
    expect(createdUser.token).not.toBeNull();
  });

  it('throws error if user to delete not found', async () => {
    try {
      await userRepository.deleteUser(999);
      throw new Error('Expected promise to be rejected.');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
