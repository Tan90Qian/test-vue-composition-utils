import { provide, inject, defineComponent, ref } from "vue";
import { renderCustomComposition } from "../composition-api-test";

describe("test dependency injection api", () => {
  it("test case 1", () => {
    const ThemeSymbol = Symbol();

    const Wrapper = defineComponent({
      setup() {
        provide(ThemeSymbol, "dark");
      },
      template: `<div><slot></slot></div>`,
    });

    function useThemeSymbol() {
      const theme = inject(ThemeSymbol, "light");
      return {
        theme,
      };
    }

    const { result } = renderCustomComposition(() => useThemeSymbol(), {
      wrapper: Wrapper,
    });

    expect(result.current.theme).toBe("dark");
  });

  it("test case 2", async () => {
    const ThemeSymbol = Symbol();

    const Wrapper = defineComponent({
      setup() {
        const color = ref("dark");
        provide(ThemeSymbol, color);
        setTimeout(() => {
          color.value = "blue";
        }, 500);
      },
      template: `<div><slot></slot></div>`,
    });

    function useThemeSymbol() {
      const theme = inject(ThemeSymbol, ref("light"));
      return {
        theme,
      };
    }

    const { result } = renderCustomComposition(() => useThemeSymbol(), {
      wrapper: Wrapper,
    });

    expect(result.current.theme.value).toBe("dark");
    await new Promise((res) => {
      setTimeout(res, 500);
    });
    expect(result.current.theme.value).toBe("blue");
  });
});
