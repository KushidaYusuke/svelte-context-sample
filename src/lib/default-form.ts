import { writable, get } from 'svelte/store';
import type { FormAPI } from './form-context';

export const _values = writable<Record<string, any>>({});

export const defaultForm: FormAPI = {
  getValue: (k) => get(_values)[k],
  setValue: (k, v) => _values.update(m => ({ ...m, [k]: v })),
  reset(keys?) {
    if (!keys) { _values.set({}); return; }
    _values.update(m => {
      const n = { ...m }; for (const k of keys) delete n[k]; return n;
    });
  },
  subscribe: _values.subscribe
};