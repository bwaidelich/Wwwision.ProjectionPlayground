# Wwwision.ProjectionPlayground

Neos backend module that allows for creating and testing ESCR projections on the fly

## Usage

install via [composer](https://getcomposer.org):

```shell
composer require wwwision/projection-playground
```

> **Note**
> At the time of writing, the `neos/contentrepository-core` package is not yet available on packagist
> You can download it from GitHub to your distribution folder:
> https://github.com/neos/neos-development-collection/tree/9.0/Neos.ContentRepository.Core
> and install everything via `composer require wwwision/projection-playground neos/contentrepository-core:@dev `

Afterwards, if you log into the Neos Backend as an *Administrator*, you can navigate to the new backend module at `/neos/administration/projection-playground` and start playing.

## Projections

The projection logic can be written in JavaScript.
This package supports a subset of the [EventStoreDB](https://www.eventstore.com/) projection syntax (see [Documentation](https://developers.eventstore.com/server/v22.10/projections.html#user-defined-projections-api))

### Example projections

#### Count all events

```js
fromAll()
.when({
    $init: () => ({count: 0}),
    $any: (s, e) => {
        s.count ++;
    }
})
```

#### Count created node types

...and transform the result to order them by most used type

```js
fromAll()
.when({
    NodeAggregateWithNodeWasCreated: (s, e) => {
        const nodeType = e.body.nodeTypeName;
        s[nodeType] = (s[nodeType] ?? 0) + 1;
    }
}).transformBy(s => Object.fromEntries(Object.entries(s).sort((a, b) => b[1] - a[1])))
```

#### Aggregate events by their weekday

...and transform the result to order them by most popular day

```js
fromAll()
.when({
    $any: (s, e) => {
        const timestamp = e.metadataRaw['initiatingTimestamp'];
        if (!timestamp) {
            return;
        }
        const date = new Date(timestamp);
        const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];
        s[weekDay] = (s[weekDay] ?? 0) + 1;
    }
}).transformBy(s => Object.fromEntries(Object.entries(s).sort((a, b) => b[1] - a[1])))
```

## Disclaimer

This project is not endorsed by Event Store Ltd.
