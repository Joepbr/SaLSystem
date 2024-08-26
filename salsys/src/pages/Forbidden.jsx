import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Forbidden() {

  return (
    <>
      <Box>
        <Typography
          variant="h4"
          fontWeight="bold"
        >
          Acesso Negado
        </Typography>
        <Typography>
          Você não tem permissão para acessar esta página.
        </Typography>
      </Box>
    </>
  );
}
