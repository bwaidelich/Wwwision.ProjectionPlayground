<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { eventDefinitions } from '../eventDefinitions.js';
  import {
    eventStoreTypes,
    eventStoreScope,
    customEventDefinitionTypes,
  } from "../editorTypes.js";
  let container, editor, modelChangeSub, monaco;
  const resizeObserver = new ResizeObserver(entries => {
    // HACK
    //editor.layout({width: entries[0].contentRect.width, height: entries[0].contentRect.height - 1});
    editor.layout();
  });
  const dispatch = createEventDispatcher();

  export let code = '';

  onMount(async () => {
    monaco = await import("monaco-editor");
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      eventStoreTypes,
      "ts:filename/eventstore.d.ts"
    );
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      eventStoreScope,
      "ts:filename/eventstore-scope.d.ts"
    );
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      customEventDefinitionTypes(eventDefinitions),
      "ts:filename/custom-events.d.ts"
    );
    editor = monaco.editor.create(container, {
      value: code,
      language: "typescript",
      roundedSelection: false,
      lineNumbers: "off",
      scrollBeyondLastLine: false,
      readOnly: false,
      tabSize: 2,
      theme: "vs-light",
      // dimension: {
      //   width: 100,
      //   height: 50,
      // },
      minimap: {
        enabled: false
      },
      contextmenu: false,
    });
    const typescriptWorker = await monaco.languages.typescript.getTypeScriptWorker();
    modelChangeSub = editor.getModel().onDidChangeContent(async () => {
      //console.log('TS', editor.getModel().getValue());
      let proxy = await typescriptWorker(editor.getModel().uri);
      let transpilation = await proxy.getEmitOutput(
        editor.getModel().uri.toString()
      );
      //console.log('JS', transpilation.outputFiles[0].text);
      dispatch("codechange", {
        ts: editor.getModel().getValue(),
        js: transpilation.outputFiles[0].text
      });
    });
    resizeObserver.observe(container);
  });
  onDestroy(() => {
    if (editor) {
      editor.dispose();
      const model = editor.getModel();
      if (model) model.dispose();
    }
    if (modelChangeSub) modelChangeSub.dispose();
    resizeObserver.disconnect();
  });
</script>

<style>
  div {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>

<div bind:this={container} />
