import { UserModel } from "../databases/mongodb/user.model";
import { UserToCreateDTO } from "../types/user/dtos";

export class UserService {
  async registerUser(userToCreate: UserToCreateDTO): Promise<any> {
    const password_hash = "hash du mot de passe"; // Replace with actual hashing logic

    const createdUser = new UserModel({
      ...userToCreate,
      password_hash,
    });

    const savedUser = await createdUser.save();

    return savedUser;
  }
}