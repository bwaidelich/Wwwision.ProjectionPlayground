import App from './components/App.svelte';

const container = document.getElementById('app');
const app = new App({
  target: container,
	props: {
		contentRepositoryId: container.dataset.contentrepositoryid,
		workspaces: JSON.parse(container.dataset.workspaces),
	}
});

export default app;
