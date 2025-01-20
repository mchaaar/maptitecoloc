import { UserModel, IUser } from "../databases/mongodb/user.model";

export class UserRepository {
  public async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  public async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return user.save();
  }

  public async findById(userId: string): Promise<IUser | null> {
    return UserModel.findById(userId);
  }

  public async deactivateUser(userId: string): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );
  }
}
