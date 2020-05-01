import { reactive } from "vue";

import { renderCustomComposition } from "../composition-api-test";

describe("test reactive api", () => {
  it("test case 1", () => {
    function useCount() {
      const obj = reactive({ count: 0 });
      return obj;
    }

    const { result } = renderCustomComposition(() => useCount());
    expect(result.current.count).toBe(0);
  });
});
