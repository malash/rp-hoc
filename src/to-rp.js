/* eslint-disable react/no-multi-comp */
import { Component, PureComponent } from 'react';

export const toRP = (
  decorator,
  {
    renderKey = 'children',
    useComponent = false,
    usePureComponent = false,
  } = {},
) => {
  if (useComponent && usePureComponent) {
    throw new Error('can not use both `useComponent` and `usePureComponent` in `toRP`');
  }
  if (useComponent) {
    class ToRP extends Component {
      render() {
        const { [renderKey]: children, ...props } = this.props;
        return children(props);
      }
    }
    ToRP.displayName = `ToRP_${decorator.name}`;
    return decorator(ToRP);
  }
  if (usePureComponent) {
    class ToRP extends PureComponent {
      render() {
        const { [renderKey]: children, ...props } = this.props;
        return children(props);
      }
    }
    ToRP.displayName = `ToRP_${decorator.name}`;
    return decorator(ToRP);
  }
  const ToRP = ({ [renderKey]: children, ...props }) => children(props);
  ToRP.displayName = `ToRP_${decorator.name}`;
  return decorator(ToRP);
};
