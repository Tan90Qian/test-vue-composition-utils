import {
  defineComponent,
  Suspense,
  h,
  reactive,
  createApp,
  onErrorCaptured,
} from "vue";
import { cleanup, addCleanup, removeCleanup } from "./cleanup";

const TestCustomComposition = defineComponent({
  functional: true,
  props: ["callback", "compositionProps", "onError", "setValue"],
  setup(props) {
    const { callback, setValue, onError } = props;
    try {
      const value = callback(props.compositionProps);
      setValue(value);
    } catch (err) {
      if (err.then) {
        throw err;
      } else {
        onError(err);
      }
    }
    return () => null;
  },
});

const Fallback = defineComponent({
  functional: true,
  render() {
    return null;
  },
});

interface Result<T> {
  readonly current: T;
  readonly error?: Error;
}

function resultContainer<T>() {
  let value: T = null;
  let error = null;

  const result: Result<T> = {
    get current() {
      if (error) {
        throw error;
      }
      return value;
    },
    get error() {
      return error;
    },
  };

  const updateResult = (val, err?) => {
    value = val;
    error = err;
  };

  return {
    result,
    setValue: (val) => {
      updateResult(val);
    },
    setError: (err) => {
      updateResult(undefined, err);
    },
  };
}

interface RenderOption {
  initialProps?: any;
  wrapper?: any;
}

interface RenderCustomCompositionResult<T> {
  result: Result<T>;
  rerender: (newProps?: any) => Promise<void>;
  unmount: () => void;
}

function renderCustomComposition<T extends (...args: any) => any>(
  callback: T,
  { initialProps, wrapper }: RenderOption = { initialProps: {} }
): RenderCustomCompositionResult<ReturnType<T>> {
  const { result, setValue, setError } = resultContainer<ReturnType<T>>();
  const compositionProps: { current: any } = {
    current: initialProps,
  };

  const wrapUiIfNeeded = (innerElement) =>
    wrapper
      ? h(wrapper, null, {
          // use funtion slots to avoid warning
          default: () => innerElement,
        })
      : innerElement;

  const props = reactive({ ...initialProps });

  const ToRender = defineComponent({
    setup() {
      onErrorCaptured((err: any) => {
        if (err.then) {
          throw err;
        } else {
          setError(err);
          // document of vue@2 say return false, but runtime-core@3 say return true
          return true;
        }
      });

      return () =>
        wrapUiIfNeeded(
          h(Suspense, null, {
            default: h(TestCustomComposition, {
              callback,
              compositionProps: props,
              onError: setError,
              setValue,
            }),
            fallback: h(Fallback),
          })
        );
    },
  });

  const app = createApp(ToRender);
  const root = document.createElement("div");
  const unmountHook = app.unmount;
  const instance = app.mount(root);

  const setProps = (newProps: any) => {
    for (const [k, v] of Object.entries(newProps)) {
      props[k] = v;
    }

    return instance.$nextTick();
  };

  function unmountCustomComposition() {
    removeCleanup(unmountHook);
    //@ts-ignore
    unmountHook();
  }

  addCleanup(unmountCustomComposition);

  return {
    result,
    rerender: (newProps = compositionProps.current) => {
      compositionProps.current = newProps;
      return setProps(compositionProps.current);
    },
    unmount: unmountCustomComposition,
  };
}

export { renderCustomComposition, cleanup };
