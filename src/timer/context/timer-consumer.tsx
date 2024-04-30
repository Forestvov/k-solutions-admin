import { ReactNode } from 'react';

import { TimerContext } from './timer-context';
import { SplashScreen } from '../../components/loading-screen';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export function TimerConsumer({ children }: Props) {
  return (
    <TimerContext.Consumer>
      {(value) => (value ? <SplashScreen /> : children)}
    </TimerContext.Consumer>
  );
}
