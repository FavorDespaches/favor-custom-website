'use client'

// Third-party Imports
import classnames from 'classnames'
import { useParams } from 'next/navigation'

// Type Imports
import type { NotificationsType } from '@components/layout/shared/NotificationsDropdown'
import type { ShortcutsType } from '@components/layout/shared/ShortcutsDropdown'
import type { Locale } from '@configs/i18n'

// Component Imports
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import NotificationsDropdown from '@components/layout/shared/NotificationsDropdown'
import NavSearch from '@components/layout/shared/search'
import ShortcutsDropdown from '@components/layout/shared/ShortcutsDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import NavToggle from './NavToggle'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

// Vars
const shortcuts: ShortcutsType[] = [
  {
    url: '/apps/calendar',
    icon: 'ri-calendar-line',
    title: 'Calendar',
    subtitle: 'Appointments'
  },
  {
    url: '/apps/invoice/list',
    icon: 'ri-file-list-3-line',
    title: 'Invoice App',
    subtitle: 'Manage Accounts'
  },
  {
    url: '/apps/user/list',
    icon: 'ri-user-3-line',
    title: 'Users',
    subtitle: 'Manage Users'
  },
  {
    url: '/apps/roles',
    icon: 'ri-computer-line',
    title: 'Role Management',
    subtitle: 'Permissions'
  },
  {
    url: '/dashboards/crm',
    icon: 'ri-pie-chart-2-line',
    title: 'Dashboard',
    subtitle: 'User Dashboard'
  },
  {
    url: '/pages/account-settings',
    icon: 'ri-settings-4-line',
    title: 'Settings',
    subtitle: 'Account Settings'
  }
]

const notifications: NotificationsType[] = [
  {
    avatarImage: '/images/avatars/2.png',
    title: 'Congratulations Flora 🎉',
    subtitle: 'Won the monthly bestseller gold badge',
    time: '1h ago',
    read: false
  },
  {
    title: 'Cecilia Becker',
    subtitle: 'Accepted your connection',
    time: '12h ago',
    read: false
  },
  {
    avatarImage: '/images/avatars/3.png',
    title: 'Bernard Woods',
    subtitle: 'You have new message from Bernard Woods',
    time: 'May 18, 8:26 AM',
    read: true
  },
  {
    avatarIcon: 'ri-bar-chart-line',
    avatarColor: 'info',
    title: 'Monthly report generated',
    subtitle: 'July month financial report is generated',
    time: 'Apr 24, 10:30 AM',
    read: true
  },
  {
    avatarText: 'MG',
    avatarColor: 'success',
    title: 'Application has been approved 🚀',
    subtitle: 'Your Meta Gadgets project application has been approved.',
    time: 'Feb 17, 12:17 PM',
    read: true
  },
  {
    avatarIcon: 'ri-mail-line',
    avatarColor: 'error',
    title: 'New message from Harry',
    subtitle: 'You have new message from Harry',
    time: 'Jan 6, 1:48 PM',
    read: true
  }
]

const NavbarContent = () => {
  // Get the current language from params
  const { lang } = useParams() as { lang: Locale };

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, "flex items-center justify-between gap-4 is-full")}>
      <div className="flex items-center gap-[7px]">
        <NavToggle />
        <NavSearch />
      </div>
      <div className="flex items-center">
        {/* <LanguageDropdown lang={lang} />
        <ModeDropdown />
        <ShortcutsDropdown shortcuts={shortcuts} /> */}
        <NotificationsDropdown notifications={notifications} />
        <UserDropdown />
      </div>
    </div>
  );
}

export default NavbarContent
