import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ServerConfig } from '../services/server-config';

/**
 * Rewrites relative "/api/..." requests to the configured backend base URL. On web/dev this is a
 * no-op (base URL is empty, requests stay relative). A native app has no same-origin backend to
 * fall back to, so every request needs an absolute URL once the user has set one in Settings.
 */
export const serverUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const serverConfig = inject(ServerConfig);
  const baseUrl = serverConfig.getBaseUrl();

  if (!baseUrl || !req.url.startsWith('/')) {
    return next(req);
  }

  return next(req.clone({ url: `${baseUrl}${req.url}` }));
};
