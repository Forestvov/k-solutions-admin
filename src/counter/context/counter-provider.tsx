import { useMemo, useState, ReactNode, useEffect, useContext, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { CounterResponse } from 'src/types/transaction';

import { CounterContext } from './counter-context';
import { AuthContext } from '../../auth/context/jwt';

type Props = {
  children: ReactNode;
};

export function CounterProvider({ children }: Props) {
  const [state, setState] = useState({
    waitRequisitesCount: 0,
    processCount: 0,
    markAsPaidCount: 0,
    cancelledCount: 0,
    successCount: 0,
  });

  const { user } = useContext(AuthContext);

  const getCounter = useCallback(async () => {
    const res = await axios.get<CounterResponse>(endpoints.transaction.p2pCount);
    const { data } = res;
    await setState(data);
  }, []);

  useEffect(() => {
    if (user) {
      getCounter();

      const interval = setInterval(getCounter, 10000);

      return () => clearInterval(interval);
    }
  }, [user, getCounter]);

  const memoizedValue = useMemo(
    () => ({
      waitRequisitesCount: state.waitRequisitesCount,
      processCount: state.processCount,
      markAsPaidCount: state.markAsPaidCount,
      cancelledCount: state.cancelledCount,
      successCount: state.successCount,
    }),
    [
      state.cancelledCount,
      state.markAsPaidCount,
      state.processCount,
      state.successCount,
      state.waitRequisitesCount,
    ]
  );

  return <CounterContext.Provider value={memoizedValue}>{children}</CounterContext.Provider>;
}
