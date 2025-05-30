import { getLongUrl } from '@/shared/api/data/shortener.data';

import { DOMAIN_NAME_SHORTENED_LINKS } from '../external-links-listener.constants';

type Route = {
    expression: any;
    callback: any;
};

const schemes: any[] = [];
const routes: Route[] = [];

const hasShortenedLink = (url: string) => {
    const urlFormatted = new URL(url);

    return urlFormatted.hostname === DOMAIN_NAME_SHORTENED_LINKS;
};

const getShortIdFromShortenedLink = (url: string) => {
    const urlFormatted = new URL(url);

    return urlFormatted.pathname?.slice(1);
};

const getLongLink = async (url: string) => {
    const isShortenedLink = hasShortenedLink(url);
    const shortId = getShortIdFromShortenedLink(url);

    if (!isShortenedLink || !shortId) {
        return url;
    }

    try {
        const data = await getLongUrl(shortId);

        return data?.url ?? url;
    } catch {
        return url;
    }
};

const fetchQueries = (expression: string) => {
    const regex = /:([^/]*)/g;
    const queries = [];

    let match = regex.exec(expression);
    while (match) {
        if (match && match[0] && match[1]) {
            queries.push(match[0]);
        }

        match = regex.exec(expression);
    }

    return queries;
};

const execRegex = (queries: any[], expression: string, path: string) => {
    let regexExpression = expression;
    queries.forEach((query: any) => {
        regexExpression = regexExpression.replace(query, '(.*)');
    });

    const queryRegex = new RegExp(regexExpression, 'g');
    const match = queryRegex.exec(path);

    // @ts-expect-error - auto-ts-ignore

    if (match && !match[1].includes('/')) {
        let results = { path: match[0] };
        queries.forEach((query: string, index: number) => {
            const id = query.substring(1);
            results = { [id]: match[index + 1], ...results };
        });

        return results;
    }

    return false;
};

const evaluateExpression = (expression: string | string[], path: any, scheme: any) => {
    if (expression === path) {
        return { scheme, path };
    }

    try {
        const regex = expression;
        // @ts-expect-error - auto-ts-ignore

        const match = regex.exec(path);
        // @ts-expect-error - auto-ts-ignore

        regex.lastIndex = 0;
        if (match) {
            return { scheme, path, match };
        }
    } catch (e) {
        // Error, expression is not regex
    }

    if (typeof expression === 'string' && expression.includes(':')) {
        const queries = fetchQueries(expression);
        if (queries.length) {
            return execRegex(queries, expression, path);
        }
    }

    return false;
};

const evaluateUrl = (url: string) => {
    let solved = false;

    const urlWithoutUTM = url.split('?utm_')[0] ?? '';

    schemes.forEach((scheme) => {
        if (urlWithoutUTM.startsWith(scheme)) {
            const path = urlWithoutUTM.substring(scheme.length - 1);
            routes.forEach((route) => {
                const result = evaluateExpression(route.expression, path, scheme);
                if (result) {
                    solved = true;
                    route.callback({ scheme, ...result });
                }
            });
        }
    });

    return solved;
};

const addRoute = (expression: any, callback: any) => {
    routes.push({ expression, callback });
};

const removeRoute = (expression: any) => {
    const index = routes.findIndex((route) => route.expression === expression);
    routes.splice(index, 1);
};

const resetRoutes = () => {
    routes.splice(0, routes.length);
};

const addScheme = (scheme: any) => {
    schemes.push(scheme);
};

const resetSchemes = () => {
    schemes.splice(0, schemes.length);
};

const DeepLinking = {
    addRoute,
    addScheme,
    evaluateUrl,
    removeRoute,
    resetSchemes,
    resetRoutes,
    getLongLink,
    routes,
    schemes,
};

export default DeepLinking;
