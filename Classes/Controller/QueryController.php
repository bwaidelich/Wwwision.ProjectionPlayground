<?php

declare(strict_types=1);

namespace Wwwision\ProjectionPlayground\Controller;

use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Fusion\View\FusionView;
use Neos\Neos\Controller\Module\AbstractModuleController;
use Neos\Neos\FrontendRouting\SiteDetection\SiteDetectionResult;

final class QueryController extends AbstractModuleController
{
    protected $defaultViewObjectName = FusionView::class;

    public function __construct(
        private readonly ContentRepositoryRegistry $contentRepositoryRegistry,
    ) {
    }

    public function indexAction(): void
    {
        $siteDetectionResult = SiteDetectionResult::fromRequest($this->request->getHttpRequest());
        $contentRepository = $this->contentRepositoryRegistry->get($siteDetectionResult->contentRepositoryId);

        $this->view->assignMultiple([
            'contentRepositoryId' => $siteDetectionResult->contentRepositoryId,
            'workspaces' => $contentRepository->getWorkspaceFinder()->findAll(),
        ]);
    }
}
