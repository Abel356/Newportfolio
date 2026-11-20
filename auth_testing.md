# Auth testing notes
1. Mongo: `db.users.find({role:"admin"})` has exactly one user; `password_hash` starts with `$2b$`; unique index on users.email; index on login_attempts.identifier.
2. API (use the external REACT_APP_BACKEND_URL):
   - login with ADMIN_EMAIL / ADMIN_PASSWORD from the environment -> 200, sets httpOnly `access_token` and `refresh_token`
   - GET /api/auth/me with those cookies -> same user; without cookies -> 401
   - GET /api/admin/stats without cookies -> 401
   - POST /api/auth/logout with a foreign `Origin` header -> 403
3. There is intentionally no register / forgot-password / reset-password endpoint.
