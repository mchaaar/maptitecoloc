import { UserModel, IUser } from "../databases/mongodb/user.model";
import { UserToCreateDTO, UserLoginDTO } from "../types/user/dtos";
import { AuthService } from "./auth.service";

export class UserService {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async registerUser(data: UserToCreateDTO): Promise<IUser> {
    const existing = await UserModel.findOne({ email: data.email });
    if (existing) {
      const error: any = new Error("Email already in use");
      error.statusCode = 400;
      error.code = "EMAIL_IN_USE";
      throw error;
    }

    const passwordHash = await this.authService.hashPassword(data.password);

    const user = new UserModel({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      age: data.age,
      photo: data.photo,
      passwordHash,
    });

    await user.save();
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async validateUserPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return this.authService.comparePasswords(plainPassword, hashedPassword);
  }

  async deleteUser(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { isActive: false });
  }

  generateTokens(user: IUser) {
    const payload = {
      userId: user._id,
      email: user.email,
    };
    const accessToken = this.authService.generateAccessToken(payload);
    const refreshToken = this.authService.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  verifyRefreshToken(token: string) {
    return this.authService.verifyRefreshToken(token);
  }
}
