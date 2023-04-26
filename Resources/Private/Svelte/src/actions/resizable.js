export function resizable(node, options) {
	node.style.resize = 'both';
	node.style.overflow = 'hidden';
	let contentRect = null;

	let resizeObserver = new ResizeObserver(entries => {
		contentRect = entries[0].contentRect;
	});

	function handleMouseup() {
		if (contentRect) {
			node.dispatchEvent(new CustomEvent('resizeend', { detail: contentRect }));
		}
	}

	resizeObserver.observe(node);
	node.addEventListener('mouseup', handleMouseup);

	return {
		destroy() {
			node.removeEventListener('mouseup', handleMouseup);
			resizeObserver.disconnect();
		}
	};
}
