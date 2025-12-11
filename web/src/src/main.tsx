import './index.css';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

import App from './App.tsx';
import { ErrorPage } from './components/ErrorPage.tsx';
import { RouterWrapper } from './components/RouterWrapper';
import { routerConfig } from './config/router';
import { createGraphQlApiLink } from './helpers/app/createGraphQlApiLink.tsx';
import { getGraphQlApiUrl } from './helpers/app/getGraphQlApiUrl.tsx';

const graphQlClient = new ApolloClient({
    defaultOptions: {
        watchQuery: { fetchPolicy: 'network-only' },
        query: { fetchPolicy: 'network-only' }
    },
    cache: new InMemoryCache(),
    link: createGraphQlApiLink(getGraphQlApiUrl())
});

createRoot(document.getElementById('root')!).render(
    <ErrorBoundary
        fallback={<ErrorPage heading="Something went wrong." content="Please try again later." />}
    >
        <ApolloProvider client={graphQlClient}>
            <RouterWrapper mode={routerConfig.mode} basename={routerConfig.basename}>
                <App />
            </RouterWrapper>
        </ApolloProvider>
    </ErrorBoundary>
);
