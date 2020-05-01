import { reactive, watch } from "vue";
import { renderCustomComposition } from "../composition-api-test";

describe("test watch api", () => {
  it("test case 1", async () => {
    function useCount() {
      const state = reactive({ count: 0, flag: null });
      watch(
        () => state.count,
        (count, prevCount) => {
          if (count - prevCount > 1) {
            state.flag = true;
          } else {
            state.flag = false;
          }
        }
      );

      return state;
    }
    const { result, rerender } = renderCustomComposition(() => useCount());
    const state = result.current;
    expect(state.flag).toBe(null);
    state.count = 2;
    await rerender();
    expect(state.flag).toBe(true);
    state.count = 3;
    await rerender();
    expect(state.flag).toBe(false);
  });
});
