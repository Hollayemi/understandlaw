// Plain, side-effect-free constant — safe to import from anywhere:
// server components, route handlers, middleware (Edge runtime), and
// client components alike. Deliberately has NO "use client" directive
// and no other imports, so it can't drag client-only code into
// server/edge bundles (that was the root cause of the "handlers is
// undefined" / "auth is not a function" errors).
export const server =
  process.env.NODE_ENV === "production"
    ? "https://lawticha.onrender.com"
    : "http://172.20.10.8:5000" //"http://localhost:5000";
