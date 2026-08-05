export interface LoginUserDto {
  id: string;
  loginId: string;
  role: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: LoginUserDto;
}
