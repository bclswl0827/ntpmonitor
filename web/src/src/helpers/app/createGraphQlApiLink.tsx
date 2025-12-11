import { ApolloLink, Observable } from '@apollo/client';

const xhrRequest = (url: string, payload: string) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText);
            } else {
                reject(new Error('HTTP ' + xhr.status));
            }
        };
        xhr.onerror = () => reject(new Error('XHR network error'));
        xhr.send(payload);
    });
};

export const createGraphQlApiLink = (baseUrl: string) => {
    return new ApolloLink((operation) => {
        return new Observable((observer) => {
            (async () => {
                try {
                    const payload = JSON.stringify({
                        query: operation.query.loc?.source.body,
                        variables: operation.variables
                    });
                    const res = (await xhrRequest(baseUrl, payload)) as string;
                    observer.next(JSON.parse(res));
                    observer.complete();
                } catch (err) {
                    observer.error(err);
                }
            })();
        });
    });
};
