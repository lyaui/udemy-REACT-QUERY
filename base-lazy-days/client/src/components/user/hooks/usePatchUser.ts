import { useMutation } from '@tanstack/react-query';
import jsonpatch from 'fast-json-patch';

import type { User } from '@shared/types';

import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useUser } from './useUser';

import { useCustomToast } from '@/components/app/hooks/useCustomToast';

async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData.token),
    },
  );
  return data.user;
}

export function usePatchUser() {
  const toast = useCustomToast();
  const { user, updateUser } = useUser();

  const { mutate } = useMutation({
    mutationFn: (newData: User) => patchUserOnServer(newData, user),
    onSuccess(userData: User) {
      toast({ title: 'user updated!', status: 'success' });
      updateUser(userData);
    },
  });

  const patchUser = (newData: User | null) => {
    mutate(newData);
  };

  return patchUser;
}
