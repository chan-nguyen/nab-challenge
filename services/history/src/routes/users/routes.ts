import { NRoute } from '../router';
import { querySelectUsers } from './queries';
import { User } from './types';

export const getUsers: NRoute<User[]> = async ({ response }) => {
  response.body = await querySelectUsers();
};
