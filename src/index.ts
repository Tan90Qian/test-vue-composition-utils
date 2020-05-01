import { cleanup } from "./composition-api-test";

if (typeof afterEach === "function" && !process.env.RHTL_SKIP_AUTO_CLEANUP) {
  afterEach(async () => {
    await cleanup();
  });
}

export * from "./composition-api-test";
