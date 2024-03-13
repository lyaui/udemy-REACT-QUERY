import { useQuery, useQueryClient } from '@tanstack/react-query';

import type { Appointment } from '@shared/types';

import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { generateUserAppointmentsKey } from '../../../react-query/key-factories';

import { useLoginData } from '@/auth/AuthContext';
import { queryKeys } from '@/react-query/constants';

// for when we need a query function for useQuery
async function getUserAppointments(
  userId: number,
  userToken: string,
): Promise<Appointment[] | null> {
  const { data } = await axiosInstance.get(`/user/${userId}/appointments`, {
    headers: getJWTHeader(userToken),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
  const { userId, userToken } = useLoginData();

  // replace with React Query
  const fallback: Appointment[] = [];
  const { data = fallback } = useQuery({
    enabled: !!userId,
    queryKey: generateUserAppointmentsKey(userId, userToken),
    queryFn: () => getUserAppointments(userId, userToken),
  });

  return data;
}
