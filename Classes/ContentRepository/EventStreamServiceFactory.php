<?php

declare(strict_types=1);

namespace Wwwision\ProjectionPlayground\ContentRepository;

use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryDependencies;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;

final class EventStreamServiceFactory implements ContentRepositoryServiceFactoryInterface {

    public function build(ContentRepositoryServiceFactoryDependencies $serviceFactoryDependencies): EventStreamService
    {
        return new EventStreamService($serviceFactoryDependencies->eventStore);
    }
}
