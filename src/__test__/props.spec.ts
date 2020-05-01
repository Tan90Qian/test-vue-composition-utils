import { reactive, watchEffect } from "vue";
import { renderCustomComposition } from "../composition-api-test";

describe("test props change", () => {
  it("test case 1", async () => {
    interface Props {
      count: number;
    }

    function useCount(props: Props) {
      const state = reactive({
        count: props.count,
      });

      watchEffect(() => {
        state.count = props.count;
      });

      return state;
    }

    const { result, rerender } = renderCustomComposition(
      (props) => useCount(props),
      {
        initialProps: { count: 10 },
      }
    );
    expect(result.current.count).toBe(10);
    await rerender({ count: 20 });
    expect(result.current.count).toBe(20);
  });

  it("test case 2", async () => {
    interface Props {
      count: number;
    }

    function useCount(props: Props) {
      const state = reactive({
        count: props.count,
      });

      watchEffect(() => {
        state.count = props.count;
      });

      return state;
    }

    // reactive is important for automatic dependency collection
    const props = reactive({ count: 10 });

    const { result, rerender } = renderCustomComposition(() => useCount(props));
    expect(result.current.count).toBe(10);
    props.count = 20;
    await rerender();
    expect(result.current.count).toBe(20);
  });
});
