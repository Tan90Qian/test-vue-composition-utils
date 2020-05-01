import { reactive, ref, watchEffect, Ref } from "vue";

import { renderCustomComposition } from "./composition-api-test";

function useCount(count?: number | Ref<number>) {
  const state = reactive({
    count: count || 1,
  });
  function increment() {
    state.count++;
  }

  watchEffect(() => {
    if (typeof count === "number") {
      state.count = count || 1;
    } else if (typeof count === "object" && count.value) {
      state.count = count.value || 1;
    }
  });

  return { state, increment };
}

describe("test useCount", () => {
  it("initial test 1", () => {
    const { result } = renderCustomComposition(() => useCount());
    expect(result.current.state.count).toBe(1);
    result.current.increment();
    expect(result.current.state.count).toBe(2);
  });

  it("initial test 2", () => {
    const { result } = renderCustomComposition(() => useCount(0));
    expect(result.current.state.count).toBe(1);
    result.current.increment();
    expect(result.current.state.count).toBe(2);
  });

  it("initial test 3", () => {
    const { result } = renderCustomComposition(() => useCount(2));
    expect(result.current.state.count).toBe(2);
    result.current.increment();
    expect(result.current.state.count).toBe(3);
  });

  it("rerender test 1", async () => {
    const initialValue = ref(2);
    const { result, rerender } = renderCustomComposition(() =>
      useCount(initialValue)
    );
    expect(result.current.state.count).toBe(2);

    initialValue.value = 10;
    await rerender();

    expect(result.current.state.count).toBe(10);
  });
});
