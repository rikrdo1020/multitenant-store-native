import { useMutation } from '@tanstack/react-query';
import { uploadService } from '@/services/upload';

export function useUploadImage() {
  return useMutation({
    mutationFn: ({ fileUri, folder }: { fileUri: string; folder?: string }) =>
      uploadService.uploadImage(fileUri, folder),
  });
}
