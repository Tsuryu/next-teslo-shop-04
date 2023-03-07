import { useContext, FC } from 'react';

import { Grid, Typography } from '@mui/material';

import { CartContext } from '@/context';
import { currencyUtils } from '@/utils';
import { IOrder } from '@/interfaces';

interface Props {
  order?: IOrder;
}

export const OrderSummary: FC<Props> = ({ order = {} }) => {
  const context = useContext(CartContext);
  const { numberOfItems, subTotal, tax, total } = { ...context, ...order };

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>
          {numberOfItems} producto{numberOfItems > 1 && 's'}{' '}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currencyUtils.format(subTotal)} </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currencyUtils.format(tax)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total: </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end" sx={{ mt: 2 }}>
        <Typography variant="subtitle1">{currencyUtils.format(total)} </Typography>
      </Grid>
    </Grid>
  );
};
