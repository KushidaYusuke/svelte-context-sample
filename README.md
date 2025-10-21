 Context Sample

## 全体構成
- `src/routes/+page.svelte` :1-9 — `FormProvider` がフォーム状態を提供し、各 `TextField` が `id` をキーに同じ状態を共有。初期値は `initial` で渡したオブジェクトの `name` のみ設定済み。
- `src/lib/FormProvider.svelte` :6-22 — 親側の状態管理。`$state` でフォーム値を保持し、独自 API (`getValue`/`setValue`/`reset`) を Context に登録。`snapshot()` で親から現在値を取得するフックも用意。
- `src/lib/form-context.ts` :3-25 — Context ヘルパ。`provideFormContext` が API を登録し、`useFormContext` は見つからない場合にフォールバックを返す作り。

## フォールバック実装
- `src/lib/default-form.ts` :4-16 — デフォルトのフォーム API を定義。Svelte の `writable` ストアを裏で使い `subscribe` も提供するため、Context が無い環境でも単体で動作。

## TextField の振る舞い
- `src/lib/TextField.svelte` :2-25 — `useFormContext` で Context API を取得し、未登録ならフォールバックを利用。`local` を `$state` で保持し、`$effect` で親側の変更に追従。
- 入力イベントでは UI を即更新（`local = v`）しつつ `form.setValue` で共有状態を更新するため、他フィールドからの更新とも同期。
- ラベル／プレースホルダーは props で受取り、未指定でも `id` をラベルとして表示（`src/lib/TextField.svelte` :28-30）。

## 補足ポイント
- Context が無い（単体利用）ケースでも `defaultForm` で動作し、`subscribe` でフォーム全体の監視が可能。
- 状態リセットは `FormProvider` が in-place に削除、`defaultForm` はストア差し替えで対応し、いずれもキー指定／全体リセットに対応。

## バグ修正メモ
- `useFormContext` で `getContext` が未登録でも `undefined` を返す点を見落としていたため、フォールバックが効かず `form` が `undefined` になっていた。`src/lib/form-context.ts` :20-22 を修正し、`getContext<FormAPI | undefined>` の戻り値をチェックして `ctx ?? fallback` を返すよう変更。これで親が無いケースでも `defaultForm` が確実に使われる。

## 質問: Context API を使う理由（ストアだけではダメなのか）

### Context を使う理由
- `FormProvider.svelte` :6-22 のようにフォームごとに別インスタンスの状態を持たせたいとき、Context ならそのツリー配下だけに API を公開でき、他ページと干渉しない。
- `FormProvider.svelte` を複数置けば独立した `getValue`/`setValue` を渡せるため、1 つのグローバル store を共有せずに済む。ストア単体だとスコープ分離を自前でラップする必要がある。
- `useFormContext` のフォールバックにより `TextField.svelte` :11-25 は親が無いときも `default-form.ts` :6-16 で安全に動作。コンポーネント単体のテストやプレビューがしやすく、props で API を受け渡すより記述量が少ない。
- Context なら親が内部実装を差し替えても子側のコード変更が不要で、フォームバリデーションや `reset` などの拡張を `FormProvider` に閉じ込められる。グローバル store を直接使うと子が store 構造に強く依存しやすい。
- SSR 時もツリー単位で状態が分かれるため、同一リクエスト内でフォームが混線しにくい。

### ストアのみでやる場合
- 可能ではあるが、各フォームに専用 store を作って prop で渡す／破棄する処理を自前で用意する必要がある。Context はそれを Svelte の仕組みで薄く抽象化していると捉えるとわかりやすい。