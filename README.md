# <center>test-vue-composition-utils</center>

<center>Simple and complete Vue composition api testing utilities.</center>

[<center>Usage Document</center>](./docs/usage/basic-custom-composition.md)

## Example

`useCounter.js`

```javascript
import { reactive } from "vue";

function useCounter() {
  const state = reactive({
    count: 0,
  });
  const increment = () => {
    state.count++;
  };
  return {
    state,
    increment,
  };
}

export default useCounter;
```

`useCounter.spec.js`

```javascript
import { renderCustomComposition } from "test-vue-composition-utils";

import useCounter from "./useCounter";

test("should increment counter", () => {
  const { result } = renderCustomComposition(() => useCounter());
  const { state, increment } = result.current;

  expect(state.count).toBe(0);
  increment();
  expect(state.count).toBe(1);
});
```

## Installation

```sh
npm install --save-dev test-vue-composition-utils
```

or

```sh
yarn add -D test-vue-composition-utils
```

## API

See the [API reference](./docs/api-reference.md)
