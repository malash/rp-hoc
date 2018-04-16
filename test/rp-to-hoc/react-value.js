import test from 'ava';
import React, { Component } from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Value } from 'react-value';
import '../helpers/setup-test-env';
import { withRP } from '../../src';

configure({ adapter: new Adapter() });

const check = (t, wrapper) => {
  t.is(wrapper.find('input').prop('value'), 'Malash');
  wrapper.find('input').simulate('change', {
    target: { value: 'rp-hoc' },
  });
  t.is(wrapper.find('input').prop('value'), 'rp-hoc');
};

test('original Render Props works', t => {
  const App = () => (
    <Value
      defaultValue="Malash"
      render={(value, onChange) => (
        <input onChange={e => onChange(e.target.value)} value={value} />
      )}
    />
  );
  check(t, mount(<App />));
});

test('convert Render Props to HOC', t => {
  const WithValue = withRP(
    <Value
      defaultValue="Malash"
    />,
    {
      renderKey: 'render',
      multiArgs: 'args',
    },
  );
  @WithValue
  class App extends Component {
    render() {
      const [value, onChange] = this.props.args;
      return (
        <input onChange={e => onChange(e.target.value)} value={value} />
      );
    }
  }
  check(t, mount(<App />));
});
