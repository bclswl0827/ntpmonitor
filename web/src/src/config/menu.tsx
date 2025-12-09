import { mdiClockFast, mdiCog, mdiHome, mdiWebClock } from '@mdi/js';

export interface IMenuItem {
    readonly url: string;
    readonly icon: string;
    readonly label: string;
}

export const menuConfig: IMenuItem[] = [
    {
        url: '/',
        label: 'Home',
        icon: mdiHome
    },
    {
        url: '/offsets',
        label: 'Server Offset',
        icon: mdiWebClock
    },
    {
        url: '/drifts',
        label: 'Clock Drift',
        icon: mdiClockFast
    },
    {
        url: '/settings',
        label: 'Settings',
        icon: mdiCog
    }
];
