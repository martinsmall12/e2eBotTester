import { ReactNode } from 'react';
import MmsTwoToneIcon from '@mui/icons-material/MmsTwoTone';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  {
    heading: 'Menu',
    items: [
      {
        name: 'Tester',
        icon: MmsTwoToneIcon,
        link: '/dashboards/messenger'
      }
    ]
  }
];

export default menuItems;
