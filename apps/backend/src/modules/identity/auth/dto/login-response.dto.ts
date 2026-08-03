export interface LoginUserDto {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: LoginUserDto;
}
