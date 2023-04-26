<?php

declare(strict_types=1);

namespace Wwwision\ProjectionPlayground\Http;

use Neos\ContentRepository\Core\Factory\ContentRepositoryId;
use Neos\ContentRepository\Core\SharedModel\Workspace\ContentStreamId;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\EventStore\Model\Event\SequenceNumber;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Security\Context;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Wwwision\ProjectionPlayground\ContentRepository\EventStreamService;
use Wwwision\ProjectionPlayground\ContentRepository\EventStreamServiceFactory;

final class EventStreamMiddleware implements MiddlewareInterface
{

    public function __construct(
        private readonly ContentRepositoryRegistry $contentRepositoryRegistry,
        private readonly Context $securityContext,
    ) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if ($request->getUri()->getPath() !== '/neos/__eventstream') {
            return $handler->handle($request);
        }
        $fakeActionRequest = ActionRequest::fromHttpRequest($request);
        $fakeActionRequest->setControllerPackageKey('Neos.Neos');
        $fakeActionRequest->setControllerName('Frontend\\Node');
        $this->securityContext->setRequest($fakeActionRequest);
        $this->securityContext->initialize();

        $queryParams = $request->getQueryParams();
        $contentRepositoryId = ContentRepositoryId::fromString($queryParams['contentRepository'] ?? 'default');
        $contentStreamId = !empty($queryParams['contentStream']) ? ContentStreamId::fromString($queryParams['contentStream']) : null;
        $lastSequenceNumber = $request->hasHeader('Last-Event-ID') ? SequenceNumber::fromInteger((int)$request->getHeaderLine('Last-Event-ID')): null;

        /** @var EventStreamService $eventStreamService */
        $eventStreamService = $this->contentRepositoryRegistry->getService($contentRepositoryId, new EventStreamServiceFactory());
        $eventStream = $eventStreamService->loadEvents($contentStreamId, $lastSequenceNumber, 3000);
        header('Cache-Control: no-store');
        header('Content-Type: text/event-stream');
        header('Access-Control-Allow-Origin: *');

        foreach ($eventStream as $event) {
            echo $event;
            if (ob_get_length() > 0) {
                ob_end_flush();
            }
            flush();
        }
        exit;
    }
}
