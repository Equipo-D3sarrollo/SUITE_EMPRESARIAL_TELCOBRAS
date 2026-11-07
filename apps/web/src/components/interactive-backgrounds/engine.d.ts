export type InteractiveBackgroundOptions = {
  variant?: string;
  density?: number;
  intensity?: number;
  radius?: number;
  autoplay?: boolean;
  interactive?: boolean;
  color?: string | null;
  hue?: number;
};

export type InteractiveBackgroundEngine = {
  setOptions(next?: InteractiveBackgroundOptions): void;
  resize(): void;
  destroy(): void;
};

export const DEFAULTS: Required<InteractiveBackgroundOptions>;
export function createEngine(
  canvas: HTMLCanvasElement,
  userOptions?: InteractiveBackgroundOptions,
): InteractiveBackgroundEngine | null;
