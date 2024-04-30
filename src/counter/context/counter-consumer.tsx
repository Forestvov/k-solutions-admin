import { ReactNode } from 'react';

import { CounterContext } from './counter-context';
import { SplashScreen } from '../../components/loading-screen';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export function ContextConsumer({ children }: Props) {
  return (
    <CounterContext.Consumer>
      {(value) => (value ? <SplashScreen /> : children)}
    </CounterContext.Consumer>
  );
}
