import type { LucideIcon } from 'lucide-react-native';

export interface DrawerMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export interface DrawerMenuSection {
  title?: string;
  items: readonly DrawerMenuItem[];
  disabled?: boolean;
  disabledMessage?: string;
}
