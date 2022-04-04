import { NRoute } from '../router';
import { createActivity } from './queries';
import { ActivityDb } from './types';

export const postActivities: NRoute<ActivityDb> = async ({
  request,
  response,
}) => {
  response.body = await createActivity(request.body);
};
