
import React, { Component, cloneElement } from 'react';

export const withRP = (RPElement, {
  renderKey = 'children',
  multiArgs = null,
} = {}) => ChildComp => {
  class WithRP extends Component {
    renderCallback = multiArgs === null ?
      newProps => (
        <ChildComp {...this.props} {...newProps} />
      )
      :
      (...args) => (
        <ChildComp {...this.props} {...{ [multiArgs]: args }} />
      );
    render() {
      let element = RPElement;
      if (typeof RPElement === 'function') {
        element = RPElement(this.props);
      }
      return (
        cloneElement(element, {
          [renderKey]: this.renderCallback,
        })
      );
    }
  }
  WithRP.displayName = `WithRP_${ChildComp.name || ChildComp.displayName}`;
  return WithRP;
};

export const toRP = (decorator, { renderKey = 'children' } = {}) => {
  const ToRP = ({ [renderKey]: children, ...props }) => children(props);
  // ToRP.name = `toRP_${decorator.name}`;
  return decorator(ToRP);
};
