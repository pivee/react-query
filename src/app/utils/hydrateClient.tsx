'use client'

import { Hydrate as RQHydrate, type HydrateProps } from '@tanstack/react-query';

/**
 * This file may be redundant in the future, but for now it's needed to avoid a type error.
 */
export default function Hydrate(props: HydrateProps) {
  return <RQHydrate {...props} />;
}

