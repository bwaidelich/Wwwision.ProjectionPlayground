export const eventDefinitions = [
	{
    name: "NodeAggregateWithNodeWasCreated",
    properties: [
      { name: "contentStreamId", type: "string" },
      { name: "nodeAggregateId", type: "string" },
      { name: "nodeTypeName", type: "string" },
      { name: "originDimensionSpacePoint", type: "object" },
      { name: "coveredDimensionSpacePoints", type: "array" },
      { name: "parentNodeAggregateId", type: "string" },
      { name: "nodeName", type: "string" },
      { name: "initialPropertyValues", type: "array" },
      { name: "nodeAggregateClassification", type: "string" },
      { name: "succeedingNodeAggregateId", type: "string" },
    ],
  },
	{
    name: "NodePropertiesWereSet",
    properties: [
      { name: "contentStreamId", type: "string" },
      { name: "nodeAggregateId", type: "string" },
      { name: "originDimensionSpacePoint", type: "object" },
      { name: "propertyValues", type: "array" },
    ],
  },
	{
    name: "NodeAggregateWasRemoved",
    properties: [
      { name: "contentStreamId", type: "string" },
      { name: "nodeAggregateId", type: "string" },
      { name: "affectedOccupiedDimensionSpacePoints", type: "array" },
      { name: "affectedCoveredDimensionSpacePoints", type: "array" },
      { name: "removalAttachmentPoint", type: "string" },
    ],
  },
	{
    name: "ContentStreamWasCreated",
    properties: [
      { name: "contentStreamId", type: "string" },
    ],
  },
	{
    name: "ContentStreamWasForked",
    properties: [
      { name: "newContentStreamId", type: "string" },
      { name: "sourceContentStreamId", type: "string" },
      { name: "versionOfSourceContentStream", type: "number" },
    ],
  },
	{
    name: "ContentStreamWasRemoved",
    properties: [
      { name: "contentStreamId", type: "string" },
    ],
  },
	{
    name: "DimensionShineThroughWasAdded",
    properties: [
      { name: "contentStreamId", type: "string" },
			{ name: "source", type: "object" },
			{ name: "target", type: "object" },
    ],
  },
	{
    name: "DimensionSpacePointWasMoved",
    properties: [
      { name: "contentStreamId", type: "string" },
			{ name: "source", type: "object" },
			{ name: "target", type: "object" },
    ],
  },
	{
    name: "NodeAggregateWasDisabled",
    properties: [
      { name: "contentStreamId", type: "string" },
			{ name: "nodeAggregateId", type: "string" },
			{ name: "affectedDimensionSpacePoints", type: "array" },
    ],
  },
	{
    name: "NodeAggregateWasEnabled",
    properties: [
      { name: "contentStreamId", type: "string" },
			{ name: "nodeAggregateId", type: "string" },
			{ name: "affectedDimensionSpacePoints", type: "array" },
    ],
  },
	{
    name: "NodeAggregateWasMoved",
    properties: [
      { name: "contentStreamId", type: "string" },
			{ name: "nodeAggregateId", type: "string" },
			{ name: "nodeMoveMappings", type: "array" },
    ],
  },
	{
    name: "NodeReferencesWereSet",
    properties: [
      { name: "contentStreamId", type: "string" },
			{ name: "sourceNodeAggregateId", type: "string" },
			{ name: "affectedSourceOriginDimensionSpacePoints", type: "array" },
			{ name: "referenceName", type: "string" },
			{ name: "references", type: "array" },
    ],
  },
	{
    name: "NodeAggregateNameWasChanged",
    properties: [
      { name: "contentStreamId", type: "string" },
			{ name: "nodeAggregateId", type: "string" },
			{ name: "newNodeName", type: "string" },
    ],
  },
	{
    name: "NodeAggregateTypeWasChanged",
    properties: [
      { name: "contentStreamId", type: "string" },
			{ name: "nodeAggregateId", type: "string" },
			{ name: "newNodeTypeName", type: "string" },
    ],
  },
	{
    name: "NodeGeneralizationVariantWasCreated",
    properties: [
      { name: "contentStreamId", type: "string" },
			{ name: "nodeAggregateId", type: "string" },
			{ name: "sourceOrigin", type: "object" },
			{ name: "generalizationOrigin", type: "object" },
			{ name: "generalizationCoverage", type: "array" },
    ],
  },
	{
    name: "NodePeerVariantWasCreated",
    properties: [
      { name: "contentStreamId", type: "string" },
			{ name: "nodeAggregateId", type: "string" },
			{ name: "sourceOrigin", type: "object" },
			{ name: "peerOrigin", type: "object" },
			{ name: "peerCoverage", type: "array" },
    ],
  },
	{
    name: "NodeSpecializationVariantWasCreated",
    properties: [
      { name: "contentStreamId", type: "string" },
			{ name: "nodeAggregateId", type: "string" },
			{ name: "sourceOrigin", type: "object" },
			{ name: "specializationOrigin", type: "object" },
			{ name: "specializationCoverage", type: "array" },
    ],
  },
	{
    name: "RootNodeAggregateDimensionsWereUpdated",
    properties: [
      { name: "contentStreamId", type: "string" },
			{ name: "nodeAggregateId", type: "string" },
			{ name: "coveredDimensionSpacePoints", type: "array" },
    ],
  },
	{
    name: "RootNodeAggregateWithNodeWasCreated",
    properties: [
      { name: "contentStreamId", type: "string" },
			{ name: "nodeAggregateId", type: "string" },
			{ name: "nodeTypeName", type: "string" },
			{ name: "coveredDimensionSpacePoints", type: "array" },
			{ name: "nodeAggregateClassification", type: "string" },
    ],
  },
	{
    name: "RootWorkspaceWasCreated",
    properties: [
      { name: "workspaceName", type: "string" },
			{ name: "workspaceTitle", type: "string" },
			{ name: "workspaceDescription", type: "string" },
			{ name: "newContentStreamId", type: "string" },
    ],
  },
	{
    name: "WorkspaceWasCreated",
    properties: [
      { name: "workspaceName", type: "string" },
      { name: "baseWorkspaceName", type: "string" },
			{ name: "workspaceTitle", type: "string" },
			{ name: "workspaceDescription", type: "string" },
			{ name: "newContentStreamId", type: "string" },
			{ name: "workspaceOwner", type: "string" },
    ],
  },
	{
    name: "WorkspaceBaseWorkspaceWasChanged",
    properties: [
      { name: "workspaceName", type: "string" },
      { name: "baseWorkspaceName", type: "string" },
			{ name: "contentStreamId", type: "string" },
    ],
  },
	{
    name: "WorkspaceOwnerWasChanged",
    properties: [
      { name: "workspaceName", type: "string" },
			{ name: "newWorkspaceOwner", type: "string" },
    ],
  },
	{
    name: "WorkspaceWasRemoved",
    properties: [
      { name: "workspaceName", type: "string" },
    ],
  },
	{
    name: "WorkspaceWasRenamed",
    properties: [
      { name: "workspaceName", type: "string" },
			{ name: "workspaceTitle", type: "string" },
			{ name: "workspaceDescription", type: "string" },
    ],
  },
	{
    name: "WorkspaceWasDiscarded",
    properties: [
      { name: "workspaceName", type: "string" },
			{ name: "newContentStreamId", type: "string" },
			{ name: "previousContentStreamId", type: "string" },
    ],
  },
	{
    name: "WorkspaceWasPartiallyDiscarded",
    properties: [
      { name: "workspaceName", type: "string" },
			{ name: "newContentStreamId", type: "string" },
			{ name: "previousContentStreamId", type: "string" },
			{ name: "discardedNodes", type: "array" },
    ],
  },
	{
    name: "WorkspaceWasPartiallyPublished",
    properties: [
      { name: "sourceWorkspaceName", type: "string" },
      { name: "targetWorkspaceName", type: "string" },
			{ name: "newSourceContentStreamId", type: "string" },
			{ name: "previousSourceContentStreamId", type: "string" },
			{ name: "publishedNodes", type: "array" },
    ],
  },
	{
    name: "WorkspaceWasPublished",
    properties: [
      { name: "sourceWorkspaceName", type: "string" },
      { name: "targetWorkspaceName", type: "string" },
			{ name: "newSourceContentStreamId", type: "string" },
			{ name: "previousSourceContentStreamId", type: "string" },
    ],
  },
	{
    name: "WorkspaceRebaseFailed",
    properties: [
      { name: "workspaceName", type: "string" },
      { name: "candidateContentStreamId", type: "string" },
			{ name: "sourceContentStreamId", type: "string" },
			{ name: "errors", type: "array" },
    ],
  },
	{
    name: "WorkspaceWasRebased",
    properties: [
      { name: "workspaceName", type: "string" },
      { name: "newContentStreamId", type: "string" },
			{ name: "previousContentStreamId", type: "string" },
    ],
  },
];
