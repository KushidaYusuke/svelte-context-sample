<script lang="ts">
  import FormProvider from '$lib/FormProvider.svelte';
  import TextField from '$lib/TextField.svelte';
  const initial = { name: '太郎' };
</script>

<h2>Context 経由のフォーム</h2>
<FormProvider {initial}>
  <TextField id="name" label="名前" placeholder="お名前を入力"/>
  <TextField id="email" label="メール" placeholder="mail@example.com" />
</FormProvider>

<h2>親が存在しない（フォールバック使用）</h2>
<TextField id="nickname" label="ニックネーム" placeholder="ご自由にどうぞ" />
