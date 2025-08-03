// Common type aliases to replace 'any' usage

// For when you don't know the type yet but want to be safer than 'any'
export type TODO = unknown;

// Common React event types
export type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
export type FormEvent = React.FormEvent<HTMLFormElement>;
export type MouseEvent = React.MouseEvent<HTMLElement>;
export type KeyboardEvent = React.KeyboardEvent<HTMLElement>;

// Common data structures
export type ApiResponse<T = unknown> = {
  data?: T;
  error?: string | Error;
  success: boolean;
};

export type AsyncState<T = unknown> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

// Common function types
export type AsyncFunction<T = void> = () => Promise<T>;
export type Callback<T = void> = (data: T) => void;
export type ErrorCallback = (error: Error) => void;

// State setter types
export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

// Common object types
export type AnyObject = Record<string, unknown>;
export type StringObject = Record<string, string>;
export type NumberObject = Record<string, number>;