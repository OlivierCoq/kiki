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
    children: [
      {
        key: 'event-list',
        label: 'Active',
        url: '/events/active',
        parentKey: 'events',
      },
      {
        key: 'archived-events',
        label: 'Archived',
        url: '/events/archived',
        parentKey: 'events',
      }
    ]
  },
  {
    key: 'inventory',
    label: 'Inventory',
    icon: 'solar:box-bold-duotone',
    url: '/inventory/warehouse',
  }
]