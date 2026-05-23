import type { ComponentType } from 'react';

export interface DrawerMenuItem {
  label: string;
  href: string;
  icon: ComponentType<{ size?: string | number; className?: string }>;
  badge?: number;
}

export interface DrawerMenuSection {
  title?: string;
  items: readonly DrawerMenuItem[];
  disabled?: boolean;
  disabledMessage?: string;
}
