import test from 'ava';
import '../helpers/setup-test-env';
import React, { Component } from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { connect, state } from '@noflux/react';
import { toRP } from '../../src';

configure({ adapter: new Adapter() });

const counter = state.cursor('counter');

const check = (t, wrapper) => {
  t.is(wrapper.find('#counter').text(), '0');

  wrapper.find('#inc').simulate('click');
  t.is(wrapper.find('#counter').text(), '1');

  wrapper.find('#dec').simulate('click');
  t.is(wrapper.find('#counter').text(), '0');
};

test('original HOC works', t => {
  counter.set(0);
  @connect
  class App extends Component {
    render() {
      return (
        <div>
          <div id="counter">{counter.get()}</div>
          <button id="inc" onClick={() => counter.set(counter.get() + 1)}>Increment</button>
          <button id="dec" onClick={() => counter.set(counter.get() - 1)}>Decrement</button>
        </div>
      );
    }
  }
  check(t, mount(<App />));
});

test('convert HOC to Render Props', t => {
  counter.set(0);
  const Connect = toRP(connect, { useComponent: true });
  const App = () => (
    <Connect>
      {() => (
        <div>
          <div id="counter">{counter.get()}</div>
          <button id="inc" onClick={() => counter.set(counter.get() + 1)}>Increment</button>
          <button id="dec" onClick={() => counter.set(counter.get() - 1)}>Decrement</button>
        </div>
      )}
    </Connect>
  );
  check(t, mount(<App />));
});
