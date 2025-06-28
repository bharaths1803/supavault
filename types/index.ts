export interface LoginFormType {
  email: string;
}

export interface SignupFormType extends LoginFormType {
  username: string;
}

export interface UserType {
  username: string;
  email: string;
  id: string;
}
