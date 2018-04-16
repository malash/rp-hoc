import test from 'ava';
import React, { Component } from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { withState } from 'recompose';
import '../helpers/setup-test-env';
import { toRP } from '../../src';

configure({ adapter: new Adapter() });

const enhance = withState('counter', 'setCounter', 0);

const check = (t, wrapper) => {
  t.is(wrapper.find('#counter').text(), '0');

  wrapper.find('#inc').simulate('click');
  t.is(wrapper.find('#counter').text(), '1');

  wrapper.find('#dec').simulate('click');
  t.is(wrapper.find('#counter').text(), '0');
};

test('original HOC works', t => {
  @enhance
  class App extends Component {
    render() {
      const { counter, setCounter } = this.props;
      return (
        <div>
          <div id="counter">{counter}</div>
          <button id="inc" onClick={() => setCounter(n => n + 1)}>Increment</button>
          <button id="dec" onClick={() => setCounter(n => n - 1)}>Decrement</button>
        </div>
      );
    }
  }
  check(t, mount(<App />));
});

test('convert HOC to Render Props', t => {
  const Counter = toRP(enhance);
  const App = () => (
    <Counter>
      {({ counter, setCounter }) => (
        <div>
          <div id="counter">{counter}</div>
          <button id="inc" onClick={() => setCounter(n => n + 1)}>Increment</button>
          <button id="dec" onClick={() => setCounter(n => n - 1)}>Decrement</button>
        </div>
      )}
    </Counter>
  );
  check(t, mount(<App />));
});
