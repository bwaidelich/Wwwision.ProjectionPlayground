export function draggable(node, options) {
	let startX, startY, offsetX, offsetY, x, y;
	const handle = options.handleSelector ? node.querySelector(options.handleSelector) : node;

	function handleMousedown(event) {
		startX = event.clientX;
		startY = event.clientY;
		offsetX = node.offsetLeft;
		offsetY = node.offsetTop;
		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('mouseup', handleMouseup);
		node.dispatchEvent(new CustomEvent('dragstart'));
	}

	function handleMousemove(event) {
		x = event.clientX - startX + offsetX;
		y = event.clientY - startY + offsetY;
		node.style.left = x + 'px';
		node.style.top = y + 'px';
		node.dispatchEvent(new CustomEvent('dragging', { detail: { x, y } }));
	}

	function handleMouseup(event) {
		window.removeEventListener('mousemove', handleMousemove);
		window.removeEventListener('mouseup', handleMouseup);
		node.dispatchEvent(new CustomEvent('dragend', { detail: { x, y } }));
	}

	handle.addEventListener('mousedown', handleMousedown);

	return {
		destroy() {
			handle.removeEventListener('mousedown', handleMousedown);
		}
	};
}