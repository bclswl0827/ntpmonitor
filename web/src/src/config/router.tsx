import { JSX, lazy, LazyExoticComponent } from 'react';

import { RouterMode } from '../components/RouterWrapper';

export type RouterProp<T> = Record<string, T>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRouterComponent {}

export interface IRoute {
    readonly uri: string;
    readonly title: string;
    readonly element: LazyExoticComponent<(props: IRouterComponent) => JSX.Element>;
}

interface IRouterConfig {
    readonly mode: RouterMode;
    readonly basename: string;
    readonly routes: Record<string, IRoute>;
}

const Home = lazy(() => import('../views/Home'));
const Offsets = lazy(() => import('../views/Offsets'));
const Drifts = lazy(() => import('../views/Drifts'));
const Settings = lazy(() => import('../views/Settings'));
const NotFound = lazy(() => import('../views/NotFound'));

export const routerConfig: IRouterConfig = {
    basename: '/',
    mode: 'hash',
    routes: {
        home: {
            uri: '/',
            element: Home,
            title: 'Home'
        },
        offsets: {
            uri: '/offsets',
            element: Offsets,
            title: 'Server Offset'
        },
        drifts: {
            uri: '/drifts',
            element: Drifts,
            title: 'Clock Drift'
        },
        settings: {
            uri: '/settings',
            element: Settings,
            title: 'Settings'
        },
        default: {
            uri: '*',
            element: NotFound,
            title: 'Page Not Found'
        }
    }
};
