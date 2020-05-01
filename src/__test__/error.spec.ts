import { reactive, watch } from "vue";
import { renderCustomComposition } from "../composition-api-test";

describe("test error catch", () => {
  it("test case 1", async () => {
    function useCount() {
      const state = reactive({
        count: 1,
      });
      watch(
        () => state.count,
        (value) => {
          if (value > 10) throw Error(`It's over 10!`);
        }
      );
      return { state };
    }
    const { result, rerender } = renderCustomComposition(() => useCount());
    expect(result.error).toBe(undefined);
    result.current.state.count = 11;
    await rerender();
    expect(result.error instanceof Error).toBe(true);
    expect(result.error.message).toBe(`It's over 10!`);
  });
});
