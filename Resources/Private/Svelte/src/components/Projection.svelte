<script>
  import * as Comlink from "comlink";
  import Editor from "./Editor.svelte";
  import SplitPane from "./SplitPane.svelte";
  import Highlight from "svelte-highlight";
  import { json, typescript } from "svelte-highlight/languages";
  import "svelte-highlight/styles/github.css";
  import { draggable } from "../actions/draggable.js";
  import { resizable } from "../actions/resizable.js";
  import { selectable } from "../actions/selectable.js";
  import projectionWorker from "worker-loader!../projection.worker.js";
  import { createEventDispatcher } from "svelte";
  import EditableLabel from "./EditableLabel.svelte";

  let container;
  let projectionExecutor;

  export let id = "";
  export let label = "";
  export let x = 0;
  export let y = 0;
  export let width = 100;
  export let height = 200;
  export let code = "";

  let editMode = false;
  let state = {};

  const dispatch = createEventDispatcher();

  function handleEvent(event) {
    if (!projectionExecutor) {
      return;
    }
    projectionExecutor.processEvent(event.detail);
  }

  function handleResetProjections(event) {
    projectionExecutor.resetState();
  }

  function emit(json) {
    let eventData = JSON.parse(json);
    eventData.eventType = eventData.eventName;
    delete eventData.eventName;
    dispatch("emitevent", eventData);
  }

  function updateState(value) {
    state = JSON.stringify(JSON.parse(value), null, 2);
    //console.log(state);
  }

  let promise = init();

  async function init() {
    projectionExecutor = Comlink.wrap(new projectionWorker());
    await projectionExecutor.onEmit(Comlink.proxy(emit));
    await projectionExecutor.onStateChange(Comlink.proxy(updateState));

    await projectionExecutor.setCode(code);
  }

  function handleDragEnd(event) {
    x = event.detail.x;
    y = event.detail.y;
    dispatch("position_updated", { id, x, y });
    dispatchUpdated();
  }

  function handleResizeEnd(event) {
    width = event.detail.width;
    height = event.detail.height;
    dispatch("size_updated", { id, width, height });
    dispatchUpdated();
  }

  function handleCodeChange(event) {
    projectionExecutor.setCode(event.detail.js);
    code = event.detail.ts;
    dispatch("code_updated", { id, code });
    dispatchUpdated();
  }

  function dispatchUpdated() {
    dispatch("updated", { id, label, x, y, width, height, code });
  }

  function toggleEditMode() {
    editMode = !editMode;
  }

  function handleChangeLabel(event) {
    label = event.detail.label;
    dispatchUpdated();
  }
</script>

<article
  bind:this={container}
  use:draggable={{ handleSelector: "header" }}
  use:resizable
  use:selectable
  on:dragend={handleDragEnd}
  on:resizeend={handleResizeEnd}
  style="left: {x}px; top: {y}px; width: {width}px; height: {height}px;"
>
  <header>
    <EditableLabel {label} on:label_changed={handleChangeLabel} />
    <span id="remove" on:click={() => dispatch("removed")}><i class="fas fa-window-close icon-white"></i></span>
  </header>
  <section id="main">
    {#await promise}
      <p>initializing...</p>
    {:then}
      {#if editMode}
        <Editor {code} on:codechange={handleCodeChange} />
      {:else}
        <SplitPane type="horizontal" pos="50">
          <div slot="a" on:click={toggleEditMode}>
            <Highlight language={typescript}>{code}</Highlight>
          </div>
          <div slot="b">
            <Highlight language={json} bind:code={state} />
          </div>
        </SplitPane>
      {/if}
    {/await}
  </section>
  <footer>
    {#if editMode}
      <button id="save" on:click={toggleEditMode}><i class="fas fa-check icon-white"></i> SAVE</button>
    {/if}
  </footer>
</article>
<svelte:window on:emitevent={handleEvent} on:resetprojections={handleResetProjections} />

<style>
  article {
    position: absolute;
    flex-direction: column;
    border-radius: 3px;
    background: #ddd;
    display: flex;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    width: 300px;
    height: 400px;
    z-index: 100;
  }
  article:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
  header {
    background: #bbb;
    border-radius: 3px 3px 0 0;
    height: 24px;
    width: 100%;
    border-bottom: 1px solid #aaa;
    cursor: move;
    padding: 6px 0 0 6px;
  }
  #remove {
    margin: -12px 12px 0 0;
    border-radius: 10%;
    cursor: pointer;
    height: .5em;
    color: #ddd;
    float: right;
  }
  #remove:hover {
    color: #ff460d;
  }
  #main {
    flex-grow: 1;
    --second: #bbb;
  }
  #main div[slot="a"],
  #main div[slot="b"] {
    height: 100%;
  }
  #main :global(.svelte-highlight) {
    margin: 0;
    padding: 3px 10px;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
  }
  footer {
    border-radius: 0 0 3px 3px;
    border-top: 1px solid #ddd;
    background: #bbb;
    height: 20px;
    width: 100%;
  }
  #save {
    line-height: 1em;
    height: 100%;
  }
</style>
