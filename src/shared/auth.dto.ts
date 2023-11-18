export class AuthDTO {
  email: string;
  password: string;
}

export class UpdateTokenDTO {
  ID: number
  refreshToken: string
}

export class ChangePasswordDTO {
  ID: number
  oldPassword: string
  newPassword: string
}