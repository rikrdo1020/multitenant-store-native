import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customers';
import type { CustomerAddressPayload, UpdateCustomerProfilePayload } from '@/types';

const customerKeys = {
  profile: (tenantSlug?: string) => ['customers', tenantSlug, 'me'] as const,
  addresses: (tenantSlug?: string) => ['customers', tenantSlug, 'me', 'addresses'] as const,
};

export function useCustomerProfile(tenantSlug?: string, enabled = true) {
  return useQuery({
    queryKey: customerKeys.profile(tenantSlug),
    queryFn: () => customerService.getMe(tenantSlug!),
    enabled: enabled && !!tenantSlug,
    staleTime: 60_000,
  });
}

export function useUpdateCustomerProfile(tenantSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCustomerProfilePayload) =>
      customerService.updateMe(tenantSlug!, payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(customerKeys.profile(tenantSlug), profile);
      void queryClient.invalidateQueries({ queryKey: customerKeys.profile(tenantSlug) });
    },
  });
}

export function useCustomerAddresses(tenantSlug?: string, enabled = true) {
  return useQuery({
    queryKey: customerKeys.addresses(tenantSlug),
    queryFn: () => customerService.getAddresses(tenantSlug!),
    enabled: enabled && !!tenantSlug,
    staleTime: 60_000,
  });
}

export function useCreateCustomerAddress(tenantSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CustomerAddressPayload) =>
      customerService.createAddress(tenantSlug!, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.addresses(tenantSlug) });
    },
  });
}

export function useUpdateCustomerAddress(tenantSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CustomerAddressPayload> }) =>
      customerService.updateAddress(tenantSlug!, id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.addresses(tenantSlug) });
    },
  });
}

export function useDeleteCustomerAddress(tenantSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => customerService.deleteAddress(tenantSlug!, addressId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.addresses(tenantSlug) });
    },
  });
}
