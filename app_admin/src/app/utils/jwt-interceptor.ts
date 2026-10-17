import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication';

// Intercept HTTP requests and attach the JWT when required
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  // Access the authentication service
  const authenticationService = inject(AuthenticationService);

  // DEBUG: Check whether the interceptor is running
  console.log('JWT Interceptor:', req.method, req.url);

  // Identify login and registration requests
  const isAuthAPI =
    req.url.includes('/api/login') ||
    req.url.includes('/api/register');

  // DEBUG: Check authentication status
  console.log('User logged in:', authenticationService.isLoggedIn());
  console.log('Authentication API:', isAuthAPI);

  // Add JWT to authenticated API requests
  if (authenticationService.isLoggedIn() && !isAuthAPI) {

    // Retrieve the saved token
    const token = authenticationService.getToken();

    // DEBUG: Confirm a token exists without exposing it
    console.log('JWT token present:', !!token);

    // Clone the HTTP request and add the Authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // DEBUG: Confirm the header was added
    console.log('Adding Authorization header');

    // Send the authenticated request
    return next(authReq);
  }

  // Send the original request when authentication is not required
  console.log('Sending request without Authorization header');

  return next(req);
};