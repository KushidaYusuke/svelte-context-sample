<script lang="ts">
  import { useFormContext } from './form-context';
  import { defaultForm } from './default-form';
  type Props = {
    id: string;
    label?: string;
    placeholder?: string;
  }
  let { id, label = "", placeholder = ""}: Props = $props();
  // export let id!: string;
  // export let label = '';
  // export let placeholder = '';

  // 親があれば親の API、無ければフォールバック
  const form = useFormContext(defaultForm);

  let local = $state(form.getValue(id) ?? '');

  // 親側変更に追従（他コンポーネントから更新された場合など）
  $effect(() => {
    const cur = form.getValue(id);
    if (cur !== local) local = cur ?? '';
  });

  function onInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    local = v;            // 即時UI反映
    form.setValue(id, v); // ← Context経由で保存
  }
</script>

<label style="display:block; gap: 4px;">
  <span>{label || id}</span>
  <input value={local} oninput={onInput} placeholder={placeholder} />
</label>