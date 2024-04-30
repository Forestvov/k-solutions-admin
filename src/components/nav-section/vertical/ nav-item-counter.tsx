import { useContext } from 'react';

import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import { CounterContext } from '../../../counter/context';

const Counter = styled('div')`
  background: #fff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
`;

const NavItemCounter = () => {
  const { processCount, waitRequisitesCount } = useContext(CounterContext);
  const total = processCount + waitRequisitesCount;
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      p2p
      {total > 0 && <Counter>{total}</Counter>}
    </Stack>
  );
};

export default NavItemCounter;
