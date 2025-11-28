<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();
</script>

<h2>ログイン</h2>
<p>部員のみが閲覧可能なページを表示するためには、Mattermostで共有されているパスワードを入力してください。</p>
<form method="POST" use:enhance>
	{#if form?.error}
		<div class="error-message">{form.error}</div>
	{/if}
	<div class="form-group">
		<label for="password">パスワード</label>
		<input
			type="password"
			id="password"
			name="password"
			required
			autocomplete="current-password"
		/>
	</div>
	<input type="hidden" name="redirect" value={data.redirectTo} />
	<button type="submit" class="submit-button">ログインする</button>
</form>

<style>
	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: #333;
	}

	input[type="password"] {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 0.25rem;
		font-size: 1rem;
		font-family: inherit;
		box-sizing: border-box;
	}

	input[type="password"]:focus {
		outline: none;
		border-color: #000;
	}

	.error-message {
		padding: 0.75rem;
		margin-bottom: 1rem;
		background-color: #fee;
		border: 1px solid #fcc;
		border-radius: 0.25rem;
		color: #c33;
		font-size: 0.875rem;
	}

	.submit-button {
		width: 100%;
		padding: 0.75rem;
		background-color: #000;
		color: #fff;
		border: none;
		border-radius: 0.25rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.submit-button:hover {
		background-color: #333;
	}

	.submit-button:active {
		background-color: #666;
	}
</style>

