<?php

declare(strict_types=1);

namespace Wwwision\ProjectionPlayground\ContentRepository;

use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceInterface;
use Neos\ContentRepository\Core\Feature\ContentStreamEventStreamName;
use Neos\ContentRepository\Core\SharedModel\Workspace\ContentStreamId;
use Neos\EventStore\EventStoreInterface;
use Neos\EventStore\Model\Event\SequenceNumber;
use Neos\EventStore\Model\EventStream\VirtualStreamName;

final class EventStreamService implements ContentRepositoryServiceInterface {

    public function __construct(
        private readonly EventStoreInterface $eventStore,
    ) {}

    public function loadEvents(?ContentStreamId $contentStreamId, ?SequenceNumber $lastSequenceNumber, int $batchSize): \Generator
    {
        if ($contentStreamId !== null) {
            $eventStream = $this->eventStore->load(ContentStreamEventStreamName::fromContentStreamId($contentStreamId)->getEventStreamName());
        } else {
            $eventStream = $this->eventStore->load(VirtualStreamName::all());
        }
        if ($lastSequenceNumber !== null) {
            $eventStream = $eventStream->withMinimumSequenceNumber($lastSequenceNumber->next());
        }
        $i = 0;
        $intercepted = false;
        foreach ($eventStream as $eventEnvelope) {
            $data = [
                'type' => $eventEnvelope->event->type->value,
                'body' => $eventEnvelope->event->data->value,
                'metadata' => $eventEnvelope->event->metadata->value,
                'sequenceNumber' => $eventEnvelope->sequenceNumber->value,
                'streamName' => $eventEnvelope->streamName->value,
                'version' => $eventEnvelope->version->value,
                'recordedAt' => $eventEnvelope->recordedAt->format(\DATE_W3C),
            ];
            $dataJson = json_encode($data, JSON_THROW_ON_ERROR);
            yield "id: {$eventEnvelope->sequenceNumber->value}\ndata: $dataJson\n\n";

            if (++$i > $batchSize) {
                $intercepted = true;
                break;
            }
        }
        if (!$intercepted) {
            yield "event: eos\ndata: eos\n\n";
        }
    }

}
