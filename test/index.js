import test from 'ava';
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import './helpers/setup-test-env';
import { App } from '../src';

configure({ adapter: new Adapter() });

test('App', t => {
  const wrapper = mount(<App title="My Title" />);
  t.is(wrapper.find('h1').text(), 'My Title');
});
