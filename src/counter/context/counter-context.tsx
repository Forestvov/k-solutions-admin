import { createContext } from 'react';

import { CounterResponse } from 'src/types/transaction';

// ----------------------------------------------------------------------

export const CounterContext = createContext({} as CounterResponse);
