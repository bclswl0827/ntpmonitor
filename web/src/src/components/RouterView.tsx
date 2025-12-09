import { ReactNode, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { IRoute, IRouterComponent, routerConfig } from '../config/router';

interface IRouterView {
    readonly routes: Record<string, IRoute>;
    readonly routerProps?: IRouterComponent;
    readonly appName: string;
    readonly suspense: ReactNode;
}

export const RouterView = ({ routes, appName, suspense, routerProps }: IRouterView) => {
    const { pathname } = useLocation();

    // Set the document title based on the current route
    useEffect(() => {
        const routeTitle = Object.values(routes).find(({ uri }) => pathname === uri)?.title;
        const title = routeTitle ?? routerConfig.routes.default.title;
        document.title = `${title} - ${appName}`;
    }, [routes, appName, pathname]);

    return (
        <Suspense key={pathname} fallback={suspense}>
            <Routes>
                {Object.values(routes).map(({ uri, element: Element }, index) => (
                    <Route key={index} element={<Element {...routerProps} />} path={`${uri}`} />
                ))}
            </Routes>
        </Suspense>
    );
};
