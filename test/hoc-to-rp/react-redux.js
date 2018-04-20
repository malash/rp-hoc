import test from 'ava';
import '../helpers/setup-test-env';
import React, { Component } from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { toRP } from '../../src';

configure({ adapter: new Adapter() });

const reducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};
const store = createStore(reducer);

const mapStateToProps = state => ({
  counter: state,
});

const mapDispatchToProps = dispatch => ({
  inc: () => dispatch({ type: 'INCREMENT' }),
  dec: () => dispatch({ type: 'DECREMENT' }),
});

const check = (t, wrapper) => {
  t.is(wrapper.find('#counter').text(), '0');

  wrapper.find('#inc').simulate('click');
  t.is(wrapper.find('#counter').text(), '1');

  wrapper.find('#dec').simulate('click');
  t.is(wrapper.find('#counter').text(), '0');
};

test('original HOC works', t => {
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
  check(t, mount(
    <Provider store={store}>
      <App />
    </Provider>,
  ));
});

test('convert HOC to Render Props', t => {
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
  check(t, mount(
    <Provider store={store}>
      <App />
    </Provider>,
  ));
});

test('use renderKey', t => {
  const Connect = toRP(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    ), {
      renderKey: 'myRender',
    },
  );
  const App = () => (
    <Connect
      myRender={({ counter, inc, dec }) => (
        <div>
          <div id="counter">{counter}</div>
          <button id="inc" onClick={() => inc()}>Increment</button>
          <button id="dec" onClick={() => dec()}>Decrement</button>
        </div>
      )}
    />
  );
  check(t, mount(
    <Provider store={store}>
      <App />
    </Provider>,
  ));
});

test('use Component', t => {
  const Connect = toRP(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    ), {
      useComponent: true,
    },
  );
  t.truthy(Connect.prototype.isReactComponent);
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
  const wrapper = mount(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  const toRPComponent = wrapper.childAt(0).childAt(0).childAt(0).get(0).type;
  t.true(toRPComponent.displayName.indexOf('ToRP_') === 0);
  t.truthy(toRPComponent.prototype.isReactComponent);
  check(t, wrapper);
});

test('use PureComponent', t => {
  const Connect = toRP(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    ), {
      usePureComponent: true,
    },
  );
  t.truthy(Connect.prototype.isReactComponent);
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
  const wrapper = mount(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  const toRPComponent = wrapper.childAt(0).childAt(0).childAt(0).get(0).type;
  t.true(toRPComponent.displayName.indexOf('ToRP_') === 0);
  t.truthy(toRPComponent.prototype.isPureReactComponent);
  check(t, wrapper);
});

test('use Component and PureComponent', t => {
  t.throws(() => {
    toRP(
      connect(
        mapStateToProps,
        mapDispatchToProps,
      ), {
        useComponent: true,
        usePureComponent: true,
      },
    );
  });
});
