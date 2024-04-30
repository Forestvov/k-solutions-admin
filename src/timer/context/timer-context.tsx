import { createContext } from 'react';

// ----------------------------------------------------------------------

interface Prop {
  wait_requisites: number;
  wait_process: number;
}

export const TimerContext = createContext({} as Prop);
