import { reactive } from "vue";
import { renderCustomComposition } from "../composition-api-test";

describe("test async utils", () => {
  it("test waitForNextUpdate api", async () => {
    function useCount() {
      const state = reactive({
        count: 0,
      });
      const increment = () => {
        state.count++;
      };
      const incrementAsync = () =>
        new Promise((res) => {
          setTimeout(() => {
            increment();
            res();
          }, 100);
        });
      return { state, increment, incrementAsync };
    }
    const { result } = renderCustomComposition(() => useCount());
    const { state, increment, incrementAsync } = result.current;
    expect(state.count).toBe(0);
    increment();
    expect(state.count).toBe(1);
    await incrementAsync();
    expect(state.count).toBe(2);
  });
});
