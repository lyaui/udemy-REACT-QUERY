import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { User } from '@shared/types';

import { useLoginData } from '@/auth/AuthContext';
import { axiosInstance, getJWTHeader } from '@/axiosInstance';
import { queryKeys } from '@/react-query/constants';
import { generateUserKey } from '@/react-query/key-factories';

// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    },
  );

  return data.user;
}

export function useUser() {
  // get details on the userId
  const { userId, userToken, clearLoginData, setLoginData } = useLoginData();

  // call useQuery to update user data from server
  const fallback = {};
  const { data: user = fallback } = useQuery({
    enabled: !!userId,
    queryKey: generateUserKey(userId, userToken),
    queryFn: () => getUser(userId, userToken),
    staleTime: Infinity,
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // TODO: update the user in the query cache
  }

  // meant to be called from useAuth
  function clearUser() {
    // TODO: reset user to null in query cache
  }

  return { user, updateUser, clearUser };
}
