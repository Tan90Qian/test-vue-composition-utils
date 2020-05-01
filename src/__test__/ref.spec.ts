import { reactive, ref } from "vue";

import { renderCustomComposition } from "../composition-api-test";

describe("test ref api", () => {
  it("test case 1", () => {
    function useCount() {
      const count = ref(0);
      return count;
    }
    const { result } = renderCustomComposition(() => useCount());

    expect(typeof result.current === "number").toBeFalsy();
    expect(typeof result.current.value === "number").toBeTruthy();
    expect(result.current.value).toBe(0);
    result.current.value++;
    expect(result.current.value).toBe(1);
  });

  it("test case 2", () => {
    function useCount() {
      const count = ref(0);
      const state = reactive({
        count,
      });
      return state;
    }
    const { result } = renderCustomComposition(() => useCount());

    expect(result.current.count).toBe(0);
    result.current.count = 1;
    expect(result.current.count).toBe(1);
  });

  it("test case 3", () => {
    function useCount() {
      const count = ref(0);
      const state = reactive({
        count,
      });

      return { state, count };
    }
    const { result } = renderCustomComposition(() => useCount());

    const otherCount = ref(2);
    const { state, count } = result.current;
    //@ts-ignore
    state.count = otherCount;

    expect(state.count).toBe(2);
    expect(count.value).toBe(0);
  });

  it("test case 4", () => {
    function useArrayRef() {
      const arr = reactive([ref(0)]);
      const map = reactive(new Map([["foo", ref(0)]]));

      return {
        arr,
        map,
      };
    }

    const { result } = renderCustomComposition(() => useArrayRef());
    const { arr, map } = result.current;

    expect(arr[0].value).toBe(0);
    expect(map.get("foo").value).toBe(0);
  });
});
