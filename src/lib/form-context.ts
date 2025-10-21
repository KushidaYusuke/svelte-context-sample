import { setContext, getContext } from 'svelte';

export const FORM_CTX = Symbol('FORM_CTX');

export type FormAPI = {
  getValue: (k: string) => any;
  setValue: (k: string, v: any) => void;
  reset?: (keys?: string[]) => void;
  // （任意）子が全体を監視したい時用
  subscribe?: (run: (all: Record<string, any>) => void) => () => void;
};

// 親側：Context に API を登録
export function provideFormContext(api: FormAPI) {
  setContext<FormAPI>(FORM_CTX, api);
  return api;
}

// 子側：Context 取得（親が無ければ fallback を使う）
export function useFormContext<T extends FormAPI>(fallback: T): T {
  const ctx = getContext<FormAPI | undefined>(FORM_CTX);
  return (ctx ?? fallback) as T;
}
