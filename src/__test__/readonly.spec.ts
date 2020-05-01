import { reactive, readonly } from "vue";

import { renderCustomComposition } from "../composition-api-test";

describe("test readonly api", () => {
  it("test case 1", () => {
    function useCopy() {
      const original = reactive({ count: 0 });
      const copy = readonly(original);
      return { original, copy };
    }

    const { result } = renderCustomComposition(useCopy);
    const { original, copy } = result.current;

    original.count++;
    expect(original.count).toBe(1);
    expect(copy.count).toBe(1);
    //@ts-ignore
    copy.count++;
    expect(original.count).toBe(1);
    expect(copy.count).toBe(1);
  });
});
