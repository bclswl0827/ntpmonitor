export const getGraphQlApiUrl = () => {
    const baseHost = import.meta.env.VITE_APP_BACKEND_BASE_HOST;
    const isProduction = import.meta.env.MODE === 'production';
    let apiPath = import.meta.env.VITE_APP_GRAPHQL_API_ENDPOINT;
    if (!apiPath) {
        apiPath = '/graphql';
    }

    if (isProduction) {
        const protocol = `${window.location.protocol}//`;
        return baseHost ? `${baseHost}${apiPath}` : `${protocol}${window.location.host}${apiPath}`;
    }

    return `${baseHost}${apiPath}`;
};
