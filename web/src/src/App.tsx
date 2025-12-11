import { mdiGithub } from '@mdi/js';
import Icon from '@mdi/react';
import { Link } from 'react-router-dom';

import { RouterView } from './components/RouterView';
import { Skeleton } from './components/Skeleton';
import { globalConfig } from './config/global';
import { menuConfig } from './config/menu';
import { routerConfig } from './config/router';

const App = () => {
    return (
        <div className="bg-base-100 flex h-screen flex-col overflow-hidden md:flex-row">
            <div className="border-base-300 flex shrink-0 flex-col p-4 md:border-r">
                <div className="-mb-32 hidden max-w-48 text-center md:block">
                    <h2 className="text-2xl font-bold text-gray-800">{globalConfig.name}</h2>
                    <p className="mt-16 text-sm text-gray-600">{globalConfig.description}</p>
                </div>

                <div className="text-md m-auto flex flex-row flex-wrap items-center justify-center gap-2 px-2 md:flex-col md:items-start">
                    {menuConfig.map(({ icon, label, url }, index) => (
                        <Link
                            to={url}
                            key={`${index}-${label}`}
                            className="flex gap-2 rounded-md px-4 py-2 text-nowrap transition-all hover:bg-gray-100 md:w-full"
                        >
                            <Icon className="text-cyan-800" path={icon} size={1} />
                            <span className="text-cyan-600">{label}</span>
                        </Link>
                    ))}
                </div>

                <div className="hidden md:block">
                    <Link
                        to={globalConfig.repository}
                        className="flex items-center justify-center space-x-2 text-gray-600 hover:opacity-80"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Icon className="shrink-0" path={mdiGithub} size={0.9} />
                        <span className="text-sm">Source Code</span>
                    </Link>
                </div>
            </div>

            <div className="flex-1 overflow-x-hidden overflow-y-scroll p-4">
                <RouterView
                    appName={globalConfig.name}
                    routes={routerConfig.routes}
                    suspense={<Skeleton />}
                />
            </div>
        </div>
    );
};

export default App;
