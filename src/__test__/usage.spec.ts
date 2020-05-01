import { reactive, ref, unref, Ref, toRef } from "vue";
import { renderCustomComposition } from "../composition-api-test";

describe("basic", () => {
  test("Rendering", () => {
    function useCounter() {
      const state = reactive({
        count: 0,
      });
      const increment = () => {
        state.count++;
      };
      return { state, increment };
    }
    const { result } = renderCustomComposition(() => useCounter());
    expect(result.current.state.count).toBe(0);
    expect(typeof result.current.increment).toBe("function");
  });

  test("Updates", () => {
    function useCounter() {
      const state = reactive({
        count: 0,
      });
      const increment = () => {
        state.count++;
      };
      return { state, increment };
    }
    const { result } = renderCustomComposition(() => useCounter());
    result.current.increment();
    expect(result.current.state.count).toBe(1);
  });

  test("Providing Props 1", () => {
    function useCounter(initialValue: number | Ref<number> = 0) {
      const state = reactive({
        count: unref(initialValue),
      });
      const increment = () => {
        state.count++;
      };

      return {
        state,
        increment,
      };
    }
    const { result } = renderCustomComposition(() => useCounter(9000));
    result.current.increment();
    expect(result.current.state.count).toBe(9001);
  });

  test("Providing Props 2", () => {
    function useCounter(initialValue: number | Ref<number> = 0) {
      const state = reactive({
        count: unref(initialValue),
      });
      const increment = () => {
        state.count++;
      };
      const reset = () => {
        state.count = unref(initialValue);
      };
      return {
        state,
        increment,
        reset,
      };
    }
    const initialValue = ref(0);
    const { result } = renderCustomComposition(() => useCounter(initialValue));
    initialValue.value = 10;
    result.current.reset();
    expect(result.current.state.count).toBe(10);
  });

  test("Providing Props 3", () => {
    function useCounter(initialValue: number | Ref<number> = 0) {
      const state = reactive({
        count: unref(initialValue),
      });
      const increment = () => {
        state.count++;
      };
      const reset = () => {
        state.count = unref(initialValue);
      };
      return {
        state,
        increment,
        reset,
      };
    }
    const { result, rerender } = renderCustomComposition(
      (props) => useCounter(toRef(props, "initialValue")),
      {
        initialProps: { initialValue: 0 },
      }
    );
    rerender({ initialValue: 10 });
    result.current.reset();
    expect(result.current.state.count).toBe(10);
  });
});
