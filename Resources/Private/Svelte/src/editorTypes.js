export const eventStoreTypes = `
// see https://github.com/EventStore/EventStore/blob/master/src/EventStore.Projections.Core/Prelude/1Prelude.js
declare type AbstractEvent = {
    streamId: string,
    isJson: boolean,
    data: any,
    body: any,
    bodyRaw: string,
    sequenceNumber: number,
    metadataRaw: any,
    linkMetadataRaw: string,
    partition: string,
    eventType: string
}

declare type Options = {
    resultStreamName: string,
    $includeLinks: boolean,
    processingLag: number,
    reorderEvents: boolean,
}

//declare type State = any
interface State {
    [prop: string]: any
}


interface EventHandler {
    (state: State, event: AbstractEvent): State|void
}

interface PredefinedHandlers {
    $init?: () => State,
    $initShared?: () => State,
    $any?: EventHandler,
    $deleted?: () => State,
    $created?: () => State,
}
/*
interface CustomHandlers {
    [eventName: string]: EventHandler,
}
*/

declare type Handlers = CustomHandlers & PredefinedHandlers

interface DefinesStateTransform {
    $defines_state_transform(): object
}
interface TransformBy {
    transformBy(by:(state:State) => object): TransformBy & FilterBy & OutputState & OutputTo
}
interface FilterBy {
    filterBy(by:(state:State) => boolean): TransformBy & FilterBy & OutputState & OutputTo
}
interface OutputTo {
    outputTo(resultStream: string, partitionResultStreamPattern?: string): void
}
interface OutputState {
    outputState(): TransformBy & FilterBy & OutputTo
}
interface When {
    when(handlers: Handlers): DefinesStateTransform & TransformBy & FilterBy & OutputTo & OutputState
}
interface ForeachStream {
    foreachStream(): When
}
interface PartitionBy {
    partitionBy(by:(event:AbstractEvent) => string): When
}`

export const eventStoreScope = `
export { }

declare global {
    function log(message: any): void

    //function on_any(): void
    //function on_raw(): void

    function fromAll(): PartitionBy & When & ForeachStream & OutputState
    function fromCategory(category: string): PartitionBy & When & ForeachStream & OutputState
    function fromStream(streamId: string): PartitionBy & When & OutputState
    function fromStreams(streams: string[]): PartitionBy & When & OutputState
    function fromCategories(categories: string[]): PartitionBy & When & OutputState

    function options(options:Options): void
    //function emit(streamId: string, eventName: string, eventBody: object, metadata: any): void
    function linkTo(streamId: string, event: AbstractEvent, metadata: object): void
    function copyTo(streamId: string, event: AbstractEvent, metadata: object): void
    function linkStreamTo(streamId: string, linkedStreamId: string, metadata: object): void
    //function require(): void
}`;

// export const customTypes = (eventTypes) => {
//     let customEventInterfaces = [];
//     let customHandlers = [];
//     for (let [eventType, properties] of Object.entries(eventTypes)) {
//         let propertyTypes = [];
//         for (let [propertyName, propertyType] of Object.entries(properties)) {
//             propertyTypes.push(`${propertyName}: ${propertyType}`)
//         }
//         customEventInterfaces.push(`interface ${eventType}EventBody {
//       ${propertyTypes.join(",\n")}
//     }`);
//         customEventInterfaces.push(`interface ${eventType}Event extends AbstractEvent {
//       body: ${eventType}EventBody
//     }`);
//         customHandlers.push(`${eventType}?: (state: State, event: ${eventType}Event) => State|void`);
//     }

//     return `${customEventInterfaces.join("\n")}
//     interface CustomHandlers {
//       ${customHandlers.join(",\n")}
//     }`
// }

export const customTypes = (typeDefinitions) => {
    let customTypes = [];
    for (let typeDefinition of typeDefinitions) {
        customTypes.push(`type ${typeDefinition.name} = ${typeDefinition.baseType} & { __brand: "${typeDefinition.name}" };`);
    }
    return customTypes.join("\n");
}

export const customEventDefinitionTypes = (eventDefinitions) => {
    let customEventInterfaces = [];
    let customHandlers = [];
    for (let eventDefintion of eventDefinitions) {
        let propertyTypes = [];
        //('eventDefintion.properties', eventDefintion.properties)
        for (let propertyDefinition of eventDefintion.properties) {
            propertyTypes.push(`${propertyDefinition.name}: ${propertyDefinition.type}`)
        }
        customEventInterfaces.push(`interface ${eventDefintion.name}EventBody {
            ${propertyTypes.join(",\n")}
        }`);
        customEventInterfaces.push(`interface ${eventDefintion.name}Event extends AbstractEvent {
            body: ${eventDefintion.name}EventBody
        }`);
        customHandlers.push(`${eventDefintion.name}?: (state: State, event: ${eventDefintion.name}Event) => State|void`);
    }

    return `${customEventInterfaces.join("\n")}
        interface CustomHandlers {
            ${customHandlers.join(",\n")}
        }`
}

// export const customEmits = (eventTypes) => {
//     let customEmits = [];
//     for (let [eventType] of Object.entries(eventTypes)) {
//         customEmits.push(`function emit(streamId: string, eventName: '${eventType}', eventBody: ${eventType}EventBody, metadata?: object): void`)
//     }

//     return `export {}
//     declare global {
//         ${customEmits.join("\n")}
//     }`
// }

export const customEmits = (eventDefinitions) => {
    let customEmits = [];
    for (let eventDefinition of eventDefinitions) {
        customEmits.push(`function emit(streamId: string, eventName: '${eventDefinition.name}', eventBody: ${eventDefinition.name}EventBody, metadata?: object): void`)
    }

    return `export {}
    declare global {
        ${customEmits.join("\n")}
    }`
}
