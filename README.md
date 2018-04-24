# Convert between Render Props and HOC

## Install

Install from `npm`:

```bash
npm install rp-hoc --save
```

Import:

```javascript
import { toRP, withRP } from 'rp-hoc';
```

If you use `decorator` with [Babel](https://babeljs.io/) please run this command:

```bash
npm install --save-dev babel-plugin-transform-decorators-legacy
```

And modify the `.babelrc` file to enable the plugin:

```javascript
{
  "plugins": ["transform-decorators-legacy"]
}
```

## APIs

### `toRP(decorator, options)`

Convert the decorator to a render-props component.

Options:

| Option           | Default value | Usage                                                        | Tests |
| ---------------- | ------------- | ------------------------------------------------------------ | ---------------- |
| renderKey        | `'children'`    | change the callback key in props.                            | [test/hoc-to-rp/react-redux.js#L92-L117](https://github.com/malash/rp-hoc/blob/40a36fbfbef8c1e9e585f197c310cd9e59426ed9/test/hoc-to-rp/react-redux.js#L92-L117) |
| useComponent     | `false`       | Use `React.Component` to create new component instead of [Stateless Component](https://reactjs.org/docs/components-and-props.html#functional-and-class-components). | [test/hoc-to-rp/react-redux.js#L119-L149](https://github.com/malash/rp-hoc/blob/40a36fbfbef8c1e9e585f197c310cd9e59426ed9/test/hoc-to-rp/react-redux.js#L119-L149) |
| usePureComponent | `false`         | Use `React.PureComponent` to create new component instead of [Stateless Component](https://reactjs.org/docs/components-and-props.html#functional-and-class-components). | [test/hoc-to-rp/react-redux.js#L151-L181](https://github.com/malash/rp-hoc/blob/40a36fbfbef8c1e9e585f197c310cd9e59426ed9/test/hoc-to-rp/react-redux.js#L151-L181) |

#### Example [React Redux](https://github.com/reactjs/react-redux)

Use decorator:

```javascript
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class App extends Component {
  render() {
    const { counter, inc, dec } = this.props;
    return (
      <div>
        <div id="counter">{counter}</div>
        <button id="inc" onClick={() => inc()}>Increment</button>
        <button id="dec" onClick={() => dec()}>Decrement</button>
      </div>
    );
  }
}
```

Use render-props component:

```javascript
const Connect = toRP(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
);

const App = () => (
  <Connect>
    {({ counter, inc, dec }) => (
      <div>
        <div id="counter">{counter}</div>
        <button id="inc" onClick={() => inc()}>Increment</button>
        <button id="dec" onClick={() => dec()}>Decrement</button>
      </div>
    )}
  </Connect>
);
```

Use different `renderKey`:

```javascript
const Connect = toRP(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ), {
    renderKey: 'myRender', // this line changed
  },
);

const App = () => (
  <Connect
    // this line changed
    myRender={({ counter, inc, dec }) => (
      <div>
        <div id="counter">{counter}</div>
        <button id="inc" onClick={() => inc()}>Increment</button>
        <button id="dec" onClick={() => dec()}>Decrement</button>
      </div>
    )}
  />
);
```

### `withRP(element, options)` and `withRP(component, props, options)`

Convert the render-props component to a decorator.

Options:

| Option    | Default value | Usage                                                        | Tests                                                        |
| --------- | ------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| renderKey | 'children'    | change the callback key in props.                            | [test/rp-to-hoc/react-value.js#L31-L49](https://github.com/malash/rp-hoc/blob/40a36fbfbef8c1e9e585f197c310cd9e59426ed9/test/rp-to-hoc/react-value.js#L31-L49) |
| multiArgs | null          | Convert callback `arguments` to `Array`. Otherwise callback props will be assigned with original props by `Object.assign`. | [test/rp-to-hoc/react-value.js#L31-L49](https://github.com/malash/rp-hoc/blob/40a36fbfbef8c1e9e585f197c310cd9e59426ed9/test/rp-to-hoc/react-value.js#L31-L49) |

#### Example [React Value](https://github.com/JedWatson/react-value)

Use render-props component:

```javascript
import Toggle from 'react-toggled';
const App = () => (
  <Toggle defaultOn>
    {({ on, getTogglerProps }) => (
      <div>
        <button {...getTogglerProps()}>Toggle me</button>
        <div id="result">{on ? 'Toggled On' : 'Toggled Off'}</div>
      </div>
    )}
  </Toggle>
);
```

Use heigher-order component:

```javascript
const WithToggle = withRP(<Toggle defaultOn />);

@WithToggle
class App extends Component {
  render() {
    const { on, getTogglerProps } = this.props;
    return (
      <div>
        <button {...getTogglerProps()}>Toggle me</button>
        <div id="result">{on ? 'Toggled On' : 'Toggled Off'}</div>
      </div>
    );
  }
}
```

To prevent `prop-types` warning, you can use `withRP(component, props, options)`:

```javascript
const WithToggle = withRP(Toggle, { defaultOn: true });

@WithToggle
class App extends Component {
  render() {
    const { on, getTogglerProps } = this.props;
    return (
      <div>
        <button {...getTogglerProps()}>Toggle me</button>
        <div id="result">{on ? 'Toggled On' : 'Toggled Off'}</div>
      </div>
    );
  }
}
```
