<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let contentRepositoryId = '';
  export let contentStreamId = '';

  let isPlaying = false;
  let eventSource = null;

  function play() {
    dispatch("resetprojections");
    isPlaying = true;
    eventSource = new EventSource(`/neos/__eventstream?contentRepository=${contentRepositoryId}&contentStream=${contentStreamId}`, {
      withCredentials: true,
    });
    eventSource.addEventListener('eos', stop);
    eventSource.onmessage = (e) => {
      const eventEnvelope = JSON.parse(e.data);
      dispatch("emitevent", {
        body: eventEnvelope.body,
        isJson: true,
        streamId: eventEnvelope.streamName,
        eventType: eventEnvelope.type,
        sequenceNumber: eventEnvelope.sequenceNumber,
        metadata: eventEnvelope.metadata,
        linkMetadata: "",
        partition: "",
      });
    };
  }
  function stop() {
    if (eventSource) {
      eventSource.close();
    }
    isPlaying = false;
  }
</script>
{#if isPlaying}
  <button class="neos-button neos-button-danger" on:click={stop}><i class="fas fa-stop icon-white"></i> STOP</button>
{:else}

  <button class="neos-button neos-button-primary" on:click={play}><i class="fas fa-play icon-white"></i> PLAY</button>
{/if}
