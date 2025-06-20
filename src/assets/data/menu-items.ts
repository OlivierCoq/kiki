import { MenuItemType } from '@/types/menu'

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: 'general',
    label: 'GENERAL',
    isTitle: true,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'solar:widget-5-bold-duotone',
    url: '/dashboard',
  },
  {
    key: 'events',
    label: 'Events',
    icon: 'solar:calendar-bold-duotone',
    url: '/events',
  },
  {
    key: 'inventory',
    label: 'Inventory',
    icon: 'solar:box-bold-duotone',
    url: '/inventory/warehouse',
  }
]