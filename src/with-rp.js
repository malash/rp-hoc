import React, { Component, cloneElement, createElement } from 'react';
import { isElement, isValidElementType } from 'react-is';

const getType = x => {
  if (isElement(x)) {
    return 'element';
  } else if (isValidElementType(x)) {
    return 'component';
  } else {
    throw new TypeError('the first argument of `withRP` must be React component or element');
  }
};

export const withRP = (rp, props, options) => ChildComp => {
  const type = getType(rp);
  if (type === 'element') {
    options = props;
  }
  const {
    renderKey = 'children',
    multiArgs = null,
  } = options || {};
  class WithRP extends Component {
    renderCallback = multiArgs === null ?
      newProps => (
        <ChildComp {...this.props} {...newProps} />
      )
      :
      (...newProps) => (
        <ChildComp {...this.props} {...{ [multiArgs]: newProps }} />
      );
    render() {
      if (type === 'element') {
        return cloneElement(rp, {
          [renderKey]: this.renderCallback,
        });
      } else if (type === 'component') {
        return createElement(rp, {
          ...props,
          [renderKey]: this.renderCallback,
        });
      }
    }
  }
  WithRP.displayName = `WithRP_${ChildComp.name || ChildComp.displayName}`;
  return WithRP;
};
