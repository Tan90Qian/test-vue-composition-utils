import { computed, ref } from "vue";

import { renderCustomComposition } from "../composition-api-test";

describe("test computed api", () => {
  it("test case 1", () => {
    function usePlusOne() {
      const count = ref(1);
      const plusOne = computed(() => count.value + 1);
      return { count, plusOne };
    }

    const { result } = renderCustomComposition(() => usePlusOne());
    const { count, plusOne } = result.current;

    expect(plusOne.value).toBe(2);
    count.value++;
    expect(plusOne.value).toBe(3);
  });

  it("test case 2", () => {
    function usePlusOne() {
      const count = ref(1);
      const plusOne = computed({
        get: () => count.value + 1,
        set: (val) => {
          count.value = val - 1;
        },
      });
      return { count, plusOne };
    }

    const { result } = renderCustomComposition(() => usePlusOne());
    const { count, plusOne } = result.current;
    expect(plusOne.value).toBe(2);
    plusOne.value = 1;
    expect(count.value).toBe(0);
  });
});
