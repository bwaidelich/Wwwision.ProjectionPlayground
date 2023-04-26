import * as Comlink from 'comlink';

import scope from './eventStore/1Prelude';

const commands = {};
let sources;
let emitCallback;
let stateCallback;

const globalEval = eval;
const safeEval = (code, scope) => {
    self._scope = scope;
    globalEval(`with (_scope) { ${code} }`);
    delete self._scope;
}
const on = (commandName, callback) => {
    commands[commandName] = callback;
}
const notify = (type, payload) => {
    if (type !== 'emit') {
        console.error('unsupported notify type', type)
        return
    }
    emitCallback(payload);
    console.log('NOTIFY', payload);
    //window.parent.postMessage({name: 'emit', body: payload}, '*');
}

const notifyStateListeners = state => {
    if (stateCallback) {
        stateCallback(state)
    }
}

function eventPasses(event) {
    //console.log('cat', event.category);
    if ((sources.allStreams || sources.streams.includes(event.streamId))
        && (sources.allEvents || sources.events.includes(event.eventType))) {
        return true;
    }
    if (sources.categories.includes(event.category)) {
        return true;
    }
    //console.log('Declined', sources, event.category)
    return false;
}

const adapter = {

    onEmit: callback => {
        emitCallback = callback;
    },

    onStateChange: callback => {
        //callback('{"foo": "bar"}')
        stateCallback = callback;
    },

    setCode: async code => {
        safeEval(code, scope(on, notify));
        sources = JSON.parse(commands['get_sources']());
        commands['initialize']();
        notifyStateListeners(commands['debugging_get_state']());
    },

    resetState: () => {
        commands['initialize']();
        notifyStateListeners(commands['debugging_get_state']());
    },

    processEvent: event => {
        event.category = event.streamId.substring(0, event.streamId.indexOf('-'))
        if (!eventPasses(event)) {
            return;
        }
        if (sources.byCustomPartitions) {
            event.partition = commands['get_state_partition'](event.body, event.isJson, event.streamId, event.eventType, event.category, event.sequenceNumber, event.metadata, event.linkMetadata)
        }
        commands['process_event'](event.body, event.isJson, event.streamId, event.eventType, event.category, event.sequenceNumber, event.metadata, event.linkMetadata, event.partition);
				const projectionState = commands['transform_state_to_result']();
        // JSON.parse(commands['transform_state_to_result']())
        notifyStateListeners(projectionState)
    }

}

Comlink.expose(adapter);
