import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

export default function getQueryClient() {
  return cache(() => new QueryClient());
}