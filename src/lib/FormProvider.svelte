<script lang="ts">
  import { provideFormContext } from './form-context';
  import { _values } from './default-form';
  import Debug from './Debug.svelte';
  type Props = Record<string, any>;
  let { initial }: Props = $props();

  // runes: 親が保持するリアクティブ状態
  const values = $state({ ...initial });

  const api = {
    getValue: (k: string) => values[k],
    setValue: (k: string, v: any) => { values[k] = v; },
    reset(keys?: string[]) {
      if (!keys) { for (const k in values) delete values[k]; return; }
      for (const k of keys) delete values[k];
    }
  } as const;

  // Context に公開
  provideFormContext(api);

  // 親から読みたい場合用のスナップショット（任意）
  export function snapshot() { return { ...values }; }
</script>

<Debug data={values} label='values'/>
<Debug data={$_values} label='$_values'/>
<slot />