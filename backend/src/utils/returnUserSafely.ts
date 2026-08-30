import { UserEntity } from 'src/user/user.entity';

export const returnUserSafely = (user: UserEntity) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userData } = user;

  return userData;
};
