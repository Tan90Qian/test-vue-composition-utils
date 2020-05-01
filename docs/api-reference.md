# API

`test-vue-composition-utils` epxorts the following methods:

- renderCustomComposition
- cleanup

## `renderCustomComposition`

```typescript
interface Result<T> {
  readonly current: ReturnType<T>;
  readonly error?: Error;
}

interface RenderOption {
  initialProps?: any;
  wrapper?: any;
}

interface RenderCustomCompositionResult<T> {
  result: Result<T>;
  rerender: (newProps: any) => Promise<void>;
  unmount: () => void;
}

function renderCustomComposition<T extends (...args: any) => any>(
  callback: T,
  { initialProps, wrapper }: RenderOption = { initialProps: {} }
): RenderCustomCompositionResult<T>;
```

Renders a test component that will call the provided `callback`, including any custom composition it calls, every time it renders.

The renderCustomComposition function accepts the following arguments:

### `callback`

The function that is called only once right after the initial props resolution when a component instance is created.

This function should call one custom composition for testing.

The `props` passed into the callback will be the `initialProps` provided in the `options` to `renderCustomComposition`, unless new props are provided by a `subsequent` rerender call.

### `options` (Optional)

An options object to modify the execution of the `callback` function. See the [renderCustomComposition Options]() section for more details.

## `renderCustomComposition` Options

The `renderCustomComposition` function accepts the following options as the second parameter:

### `initialProps`

The initial values to pass as `props` to the `callback` function of `renderCustomComposition`.

### `wrapper`

A Vue component to wrap the test component in when rendering. This is usually used to add dependency injection form `provide` for the hook to access with `inject`.

## `renderCustomComposition` Result

The `renderCustomComposition` function returns an object that has the following properties:

### `result`

```typescript
{
  current: any,
  error: Error
}
```

The `current` value of the `result` will reflect whatever is returned from the `callback` passed to `renderCustomComposition`. Any thrown values will be reflected in the `error` value of the result.

### `rerender`

```typescript
function rerender(newProps?: any): Promise<void>;
```

// TODO: 这里描述有问题  
A function to rerender the test component, causing `watchEffect` or `watch` hooks to be recalculated. If `newProps` are passed, they will replace the `callback` function's `initialProps` for subsequent rerenders.

### `unmount`

```typescript
function unmount(): void;
```

A function to unmount the test component. This is commonly used to trigger [`side effect invalidation`](https://composition-api.vuejs.org/api.html#side-effect-invalidation), or used to tigger `onBeforeUnmount` and `onUnmounted` lifecycle hooks
