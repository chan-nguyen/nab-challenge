import { NRoute } from '@nab/http';
import { UserActivity } from '../activities/types';
import { querySelectUserActivitys, querySelectUsers } from './queries';
import { User } from './types';

export const getUsers: NRoute<User[]> = async ({ response }) => {
  response.body = await querySelectUsers();
};

export const getUserActivities: NRoute<UserActivity[]> = async ({
  params,
  response,
}) => {
  const { id } = params;
  response.body = await querySelectUserActivitys(Number(id));
};
