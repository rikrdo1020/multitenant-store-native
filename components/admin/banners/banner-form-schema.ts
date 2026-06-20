import * as z from 'zod';
import type { StoreBanner, StoreBannerPayload } from '@/types';

export const bannerFormSchema = z.object({
  title: z.string().min(1, 'El titulo es requerido'),
  subtitle: z.string().optional(),
  imageUrl: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  order: z.coerce.number().int().min(0, 'El orden no puede ser negativo'),
  active: z.boolean().default(true),
});

export type BannerFormValues = z.infer<typeof bannerFormSchema>;

export function bannerToFormValues(banner?: StoreBanner | null): BannerFormValues {
  return {
    title: banner?.title ?? '',
    subtitle: banner?.subtitle ?? '',
    imageUrl: banner?.imageUrl ?? '',
    ctaText: banner?.ctaText ?? '',
    ctaUrl: banner?.ctaUrl ?? '',
    order: banner?.order ?? 0,
    active: banner?.active ?? true,
  };
}

export function toBannerPayload(values: BannerFormValues): StoreBannerPayload {
  return {
    title: values.title.trim(),
    subtitle: optionalText(values.subtitle),
    imageUrl: optionalText(values.imageUrl),
    ctaText: optionalText(values.ctaText),
    ctaUrl: optionalText(values.ctaUrl),
    order: values.order,
    active: values.active,
  };
}

function optionalText(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
