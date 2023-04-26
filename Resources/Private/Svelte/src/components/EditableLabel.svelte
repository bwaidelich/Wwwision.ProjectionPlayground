<script>
	import {clickOutside} from '../actions/clickOutside.js';
	import { createEventDispatcher } from 'svelte';
	export let label=''
	let editMode = false
	let labelBeforeEdit
	const dispatch = createEventDispatcher();

	function handleKeyUp(event) {
		if (event.code === 'Enter') {
			submit()
		}
		if (event.code === 'Escape') {
			cancel()
		}
	}

	function enableEditMode() {
		labelBeforeEdit = label
		editMode = true
	}
	function cancel() {
		editMode = false
		label = labelBeforeEdit
	}
	function submit() {
		if (label == '') {
			cancel()
			return
		}
		editMode = false
		dispatch('label_changed', { label })
	}
</script>

<div class={editMode ? 'edit' : ''}>
	{#if editMode}
  	<form id="form" use:clickOutside on:click_outside={submit} on:submit|preventDefault={submit} on:keyup={handleKeyUp}>
			<!-- svelte-ignore a11y-autofocus -->
   		<input id="input" type="text" bind:value={label} autofocus required />
	  </form>
	{:else}
		<span id="span" on:click={enableEditMode}>{label}</span>
	{/if}
</div>
<style>
  #form {
    margin: 0;
    padding: 0;
    background: none;
    border: none;
  }
  #input {
    margin: 0;
    padding: 0;
    background: none;
    border: none;
    line-height: 1em;
    height: 100%;
    font-weight: bold;
  }
  #span {
    color: #000;
    font-weight: bold;
    margin: 5px 0 0 5px;
  }
</style>
