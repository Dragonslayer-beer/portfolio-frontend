// theme/ThemeProvider.tsx
'use client';
import { ThemeProvider } from '@mui/material';
import React, { FC, PropsWithChildren } from 'react';
import { themeCreator } from './base';

const ThemeProviderWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <ThemeProvider theme={themeCreator()}>{children}</ThemeProvider>;
};

export default ThemeProviderWrapper;