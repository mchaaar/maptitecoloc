import { UserModel, IUser } from "../databases/mongodb/user.model";
import { UserToCreateDTO } from "../types/user/dtos";
import { AuthService } from "./auth.service";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
  private authService: AuthService;
  private userRepository: UserRepository;

  constructor() {
    this.authService = new AuthService();
    this.userRepository = new UserRepository();
  }

  async registerUser(data: UserToCreateDTO): Promise<IUser> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      const error: any = new Error("Email already in use");
      error.statusCode = 400;
      error.code = "EMAIL_IN_USE";
      throw error;
    }

    const passwordHash = await this.authService.hashPassword(data.password);

    const user = await this.userRepository.createUser({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      age: data.age,
      photo: data.photo,
      passwordHash,
      isActive: true,
    });

    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async validateUserPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return this.authService.comparePasswords(plainPassword, hashedPassword);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.deactivateUser(userId);
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
