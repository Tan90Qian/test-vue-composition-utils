import { onMounted, reactive } from "vue";
import { renderCustomComposition } from "../composition-api-test";

describe("test liefecycle api", () => {
  it("test case 1", async () => {
    function useLifeCycle() {
      const state = reactive({
        flag: null,
      });

      onMounted(() => {
        state.flag = "mounted";
      });
      return state;
    }
    const { result } = renderCustomComposition(() => useLifeCycle());
    expect(result.current.flag).toBe("mounted");
  });
});
