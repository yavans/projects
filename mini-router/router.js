// MiniRouter — SPA hash/history router (~160 lines)
// Supports: hash & history mode, dynamic params, before hooks, link interception

const ROUTE_CHANGE = 'minirouter:change';

export function createRouter({ mode = 'hash', routes = [] } = {}) {
  const router = {
    mode,
    routes,
    current: { path: '', params: {}, query: {} },
    guards: [],
  };

  function parseQuery(qs) {
    const query = {};
    if (qs) {
      qs.split('&').forEach(pair => {
        const [k, v] = pair.split('=');
        query[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }
    return query;
  }

  function matchRoute(pathname) {
    for (const route of routes) {
      const keys = [];
      const pattern = route.path.replace(/:(\w+)/g, (_, key) => {
        keys.push(key);
        return '([^/]+)';
      });
      const regex = new RegExp(`^${pattern}$`);
      const match = pathname.match(regex);
      if (match) {
        const params = {};
        keys.forEach((key, i) => {
          params[key] = match[i + 1];
        });
        return { route, params };
      }
    }
    return { route: routes.find(r => r.path === '*') || null, params: {} };
  }

  function getPath() {
    if (mode === 'hash') {
      const hash = window.location.hash.slice(1) || '/';
      const [path, qs] = hash.split('?');
      return { path: path, query: parseQuery(qs) };
    } else {
      const [path, qs] = window.location.pathname.split('?');
      return { path: path || '/', query: parseQuery(qs) };
    }
  }

  async function navigate(to, replace = false) {
    const fullPath = typeof to === 'string' ? to : to.path;
    const [path, qs] = fullPath.split('?');
    const { route, params } = matchRoute(path);

    for (const guard of router.guards) {
      const result = await guard(to, router.current);
      if (result === false) return;
      if (typeof result === 'string') {
        return navigate(result);
      }
    }

    if (replace) {
      router._replaceState(fullPath);
    } else {
      router._pushState(fullPath);
    }

    router.current = {
      path: fullPath,
      params,
      query: parseQuery(qs),
      route,
    };

    window.dispatchEvent(new CustomEvent(ROUTE_CHANGE, { detail: router.current }));
  }

  function init() {
    if (mode === 'hash') {
      window.addEventListener('hashchange', () => {
        const { path, query } = getPath();
        navigate(path + (Object.keys(query).length ? '?' + new URLSearchParams(query).toString() : ''));
      });
      router._pushState = (to) => {
        window.location.hash = '#' + to;
      };
      router._replaceState = (to) => {
        window.history.replaceState(null, '', '#' + to);
      };
    } else {
      window.addEventListener('popstate', () => {
        const { path, query } = getPath();
        navigate(path + (Object.keys(query).length ? '?' + new URLSearchParams(query).toString() : ''));
      });
      router._pushState = (to) => {
        window.history.pushState(null, '', to);
      };
      router._replaceState = (to) => {
        window.history.replaceState(null, '', to);
      };
    }

    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]');
      if (link) {
        e.preventDefault();
        router.push(link.getAttribute('data-link'));
      }
    });

    const { path, query } = getPath();
    const qs = Object.keys(query).length ? '?' + new URLSearchParams(query).toString() : '';
    router.current = { path: path + qs, params: {}, query, route: null };
    navigate(path + qs, true);
  }

  router.push = (to) => navigate(to, false);
  router.replace = (to) => navigate(to, true);
  router.back = () => window.history.back();
  router.forward = () => window.history.forward();
  router.beforeEach = (guard) => {
    router.guards.push(guard);
  };
  router.init = init;

  return router;
}
