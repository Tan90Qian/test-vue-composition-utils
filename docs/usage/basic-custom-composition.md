# Basic Custom Composition

## Rendering

Imagine we have a simple custom composition that we want to test:

```typescript
import { reactive } from "vue";

export default function useCounter() {
  const state = reactive({
    count: 0,
  });
  const increment = () => {
    state.count++;
  };
  return { state, increment };
}
```

To test useCounter we need to render it using the renderCustomComposition function provided by test-vue-composition-utils:

```typescript
import { renderCustomComposition } from "test-vue-composition-utils";
import useCounter from "./useCounter";
test("should use counter", () => {
  const { result } = renderCustomComposition(() => useCounter());
  expect(result.current.state.count).toBe(0);
  expect(typeof result.current.increment).toBe("function");
});
```

As you can see, the result's current value matches what is returned by our hook.

## Updates

The test shown above is great and all, but it doesn't actually test what we want to use the counter for, i.e. counting. We can easily improve this test by calling the increment function and checking that the count value increases:

```typescript
import { renderCustomComposition } from "test-vue-composition-utils";
import useCounter from "./useCounter";
test("should increment counter", () => {
  const { result } = renderCustomComposition(() => useCounter());
  result.current.increment();
  expect(result.current.state.count).toBe(1);
});
```

After increment is called, the current `count` value of `state` now reflects the new value `reactively`.

## Providing Props

Sometimes a custom composition relies on the props passed to it in order to do its thing. For example the `useCounter` composition could easily accept the initial value of the counter as a prop:

```typescript
import { reactive, unref } from "vue";

export default function useCounter(initialValue = 0) {
  const state = reactive({
    count: unref(initialValue),
  });
  const increment = () => {
    state.count++;
  };
  return { state, increment };
}
```

Setting the `initialValue` prop in our test is as easy as calling the custom composition with the value we want to use:

```typescript
import { ref } from "vue";
import { renderCustomComposition } from "test-vue-composition-utils";
import useCounter from "./useCounter";
test("should increment counter", () => {
  const { result } = renderCustomComposition(() => useCounter(9000));
  result.current.increment();
  expect(result.current.state.count).toBe(9001);
});
```

### Props

Many of the custom composition use an array of dependent values to determine when to trigger a `watch` or `watchEffect`. If we extend our `useCounter` composition to have a reset function that resets the value to the `initialValue` it might look something like this:

```typescript
import { reactive, unref } from "vue";

export default function useCounter(initialValue = 0) {
  const state = reactive({
    count: unref(initialValue),
  });
  const increment = () => {
    state.count++;
  };
  const reset = () => {
    state.count = unref(initialValue);
  };
  return { state, increment, reset };
}
```

Now, the `reset` function will be updated when the value in `initialValue` changes. The most basic way to handle changing the input props of our custom composition in a test is to simply update the value in a reference and rerender the composition:

```typescript
import { ref } from "vue";
import { renderCustomComposition } from "test-vue-composition-utils";
import useCounter from "./useCounter";
test("should increment counter", () => {
  const initialValue = ref(0);
  const { result } = renderCustomComposition(() => useCounter(initialValue));
  initialValue.value = 10;
  result.current.reset();
  expect(result.current.state.count).toBe(10);
});
```

- Tips: any value of dependent array should be a `reactive` of `ref` data, so that vue can track the change of its value.

This is fine, but if there are lots of props, it can become a bit difficult to have variables to keep track of them all. Another option is to use the initialProps option and newProps of rerender:

```typescript
import { ref } from "vue";
import { renderCustomComposition } from "test-vue-composition-utils";
import useCounter from "./useCounter";
test("should increment counter", () => {
  const { result } = renderCustomComposition(
    (props) => useCounter(toRef(props, "initialValue")),
    {
      initialProps: { initialValue: 0 },
    }
  );
  rerender({ initialValue: 10 });
  result.current.reset();
  expect(result.current.state.count).toBe(10);
});
```
