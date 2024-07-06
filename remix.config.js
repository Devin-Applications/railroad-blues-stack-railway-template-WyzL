/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
  serverModuleFormat: "cjs",
  future: {
    v2_routeConvention: true,
    v2_dev: true,
  },
  routes: async (defineRoutes) => {
    return defineRoutes((route) => {
      route("/", "routes/index.tsx");
      route("/resources", "routes/resources/index.tsx");
      route("/resources/new", "routes/resources/new.tsx");
      route("/resources/:resourceId/edit", "routes/resources/$resourceId.edit.tsx");
    });
  },
};
