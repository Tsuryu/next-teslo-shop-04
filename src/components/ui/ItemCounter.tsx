import { FC } from 'react';

import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import { Box, IconButton, Typography } from '@mui/material';

interface Props {
  currentValue: number;
  maxValue: number;
  onUpdateQuantity: (quantity: number) => void;
}

export const ItemCounter: FC<Props> = ({ currentValue, maxValue, onUpdateQuantity }) => {
  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={() => onUpdateQuantity(currentValue - 1)} disabled={currentValue === 1}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}>{currentValue}</Typography>
      <IconButton onClick={() => onUpdateQuantity(currentValue + 1)} disabled={currentValue === maxValue}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
