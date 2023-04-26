
export function selectable(node) {

	function handleMousedown(event) {
		node.style.zIndex = maxZIndex() + 1;
	}

	function maxZIndex() {
		return Array.from(document.querySelectorAll('article'))
			.filter(e => e !== node)
			.map(a => parseFloat(window.getComputedStyle(a).zIndex))
			.filter(a => !isNaN(a))
			.sort()
			.pop() || 0;
	}

	node.addEventListener('mousedown', handleMousedown);

	return {
		destroy() {
			node.removeEventListener('mousedown', handleMousedown);
		}
	};
}
