<script>
  import Projection from "./Projection.svelte";
  import { projections } from "../stores.js";
  import SSE from "./SSE.svelte";

  projections.useLocalStorage();

  export let contentRepositoryId = '';
  export let workspaces = [];
  let contentStreamId = '';

  const projectionCodeTemplate = `fromAll()
.when({
    $init: () => {
        return {
            count: 0
        }
    },
    $any: (s, e) => {
        s.count ++;
    }
})`;


  function handleAddProjection() {
    const index = $projections.length;
    projections.add({
      id: Math.random().toString(36).substring(2, 8),
      label: `Projection ${index + 1}`,
      x: 600 + index * 20,
      y: 150 + index * 20,
      width: 640,
      height: 420,
      code: projectionCodeTemplate,
    });
  }
  if ($projections.length === 0) {
    handleAddProjection();
  }

  function handleEmitEvent(event) {
    window.dispatchEvent(event);
  }
  function handleResetProjections(event) {
    window.dispatchEvent(event);
  }

</script>

<div class="neos-row-fluid" style="height: calc(100vh - 255px)">
  {#each $projections as projection}
    <Projection
      {...projection}
      on:updated={e => projections.update(e.detail)}
      on:removed={() => projections.remove(projection.id)}
      on:emitevent={handleEmitEvent}
    />
  {/each}
</div>
<div class="neos-footer">
	<select bind:value={contentStreamId}>
    <option value="">- all workspaces -</option>
		{#each workspaces as workspace}
			<option value={workspace.contentStreamId}>
				{workspace.name}
			</option>
		{/each}
	</select>
  <SSE {contentRepositoryId} {contentStreamId} on:resetprojections={handleResetProjections} on:emitevent={handleEmitEvent} />
  <button class="neos-button" on:click={handleAddProjection}><i class="fas fa-plus icon-white"></i> Add Projection</button>
</div>
