import { useMemo, useState, ReactNode, useEffect, useContext, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { TimerContext } from './timer-context';
import { AuthContext } from '../../auth/context/jwt';

type Props = {
  children: ReactNode;
};

export function TimerProvider({ children }: Props) {
  const [requisites, setRequisites] = useState(0);
  const [process, setProcess] = useState(0);

  const { user } = useContext(AuthContext);

  const getRequisites = useCallback(async () => {
    await axios
      .get<{ settingValue: number }>(endpoints.settings.wait_requisites, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(({ data }) => {
        setRequisites(+data.settingValue);
      });
  }, []);

  const getProcess = useCallback(async () => {
    await axios
      .get<{ settingValue: number }>(endpoints.settings.time_process, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(({ data }) => {
        setProcess(+data.settingValue);
      });
  }, []);

  useEffect(() => {
    if (user) {
      getRequisites();
      getProcess();
    }
  }, [getProcess, getRequisites, user]);

  const memoizedValue = useMemo(
    () => ({
      wait_requisites: requisites,
      wait_process: process,
    }),
    [process, requisites]
  );

  return <TimerContext.Provider value={memoizedValue}>{children}</TimerContext.Provider>;
}
