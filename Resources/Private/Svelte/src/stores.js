import { writable } from 'svelte/store';

function createProjectionStore(key) {

	const { subscribe, set, get, update } = writable([]);

	return {
		subscribe,
		add: (projection) => update(projections => {
			let i = projections.findIndex(p => p.id === projection.id);
			if (i !== -1) {
				throw 'Projection with id ' + projection.id + ' already exists!';
			}
			projections.push({ ...projection })
			return projections;
		}),
		update: (projection) => update(projections => {
			let i = projections.findIndex(p => p.id === projection.id);
			if (i === -1) {
				throw 'Projection with id ' + projection.id + ' does not exist!';
			}
			projections[i] = projection;
			return projections;
		}),
		remove: (projectionId) => update(projections => projections.filter(p => p.id !== projectionId)),
		reset: () => set([]),
		useLocalStorage: () => {
			const json = localStorage.getItem(key);
			if (json) {
				set(JSON.parse(json));
			}

			subscribe(current => {
				localStorage.setItem(key, JSON.stringify(current));
			});
		}
	};
}
export const projections = createProjectionStore('projections');
