import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../database/entities/User';
import AppError from '../errors/AppError';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExits = await userRepository.findOne({ where: { email } });

    if (checkUserExits) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;