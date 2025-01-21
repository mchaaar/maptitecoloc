import { Expose } from "class-transformer";
import { IsBoolean } from "class-validator";

export class ColocationPresenter {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  location: string;

  @Expose()
  surface: number;

  @Expose()
  roomCount: number;

  @Expose()
  agency?: string;

  @Expose()
  owner?: string;

  @Expose()
  members: string[];

  @Expose()
  createdBy: string;

  @Expose()
  @IsBoolean()
  isActive: boolean;
}
