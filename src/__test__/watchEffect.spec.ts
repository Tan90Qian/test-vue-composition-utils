import { watchEffect, ref, reactive, unref } from "vue";
import { renderCustomComposition } from "../composition-api-test";

describe("test watchEffect api", () => {
  it("test case 1", async () => {
    function useCount() {
      const count = ref(0);
      const state = reactive({
        count: unref(count),
      });

      watchEffect(() => {
        state.count = count.value + 1;
      });

      return { count, state };
    }
    const { result, rerender } = renderCustomComposition(() => useCount());
    const { state, count } = result.current;
    expect(state.count).toBe(1);
    count.value++;
    expect(state.count).toBe(1);
    await rerender();
    expect(state.count).toBe(2);
  });

  it("test case 2", async () => {
    function useCount() {
      const count = ref(0);
      const state = reactive({
        count: unref(count),
      });

      watchEffect(
        () => {
          state.count = count.value + 1;
        },
        { flush: "sync" }
      );

      return { count, state };
    }
    const { result } = renderCustomComposition(() => useCount());
    const { state, count } = result.current;
    expect(state.count).toBe(1);
    count.value++;
    expect(state.count).toBe(2);
  });

  it("test case 3", async () => {
    function useCount() {
      const count = ref(0);
      const state = reactive({
        count: unref(count),
      });

      watchEffect(
        () => {
          state.count = count.value + 1;
        },
        { flush: "pre" }
      );

      return { count, state };
    }
    const { result, rerender } = renderCustomComposition(() => useCount());
    const { state, count } = result.current;
    expect(state.count).toBe(1);
    count.value++;
    expect(state.count).toBe(1);
    await rerender();
    expect(state.count).toBe(2);
  });
});
