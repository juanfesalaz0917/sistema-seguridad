// src/services/profileService.ts
import { BaseService } from "./baseService";
import { Profile } from "../models/Profile";

export class ProfileService extends BaseService<Profile> {
  constructor() {
    super("/profiles"); // endpoint de tu API
  }
}

export const profileService = new ProfileService();
