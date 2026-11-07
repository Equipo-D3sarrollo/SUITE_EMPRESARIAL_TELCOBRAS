export type BackgroundVariant =
  | 'grid'
  | 'constellation'
  | 'flow'
  | 'ripple'
  | 'aurora'
  | 'flicker'
  | 'magnet'
  | 'star'
  | 'mesh'
  | 'hex'
  | 'terrain'
  | 'orbit'
  | 'spot';

export const variants: readonly BackgroundVariant[];
export const effects: Record<string, unknown>;
