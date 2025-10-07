import { ROUTES } from "@/shared/config/router";
import { registerRoute } from "@/shared/lib/ssr/prefetch";

registerRoute({
  path: ROUTES.HOME,
});
