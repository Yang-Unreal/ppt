import { getStroke } from "perfect-freehand";
import rough from "roughjs";
import {
	createEffect,
	createSignal,
	For,
	onCleanup,
	onMount,
	Show,
} from "solid-js";

interface Point {
	x: number;
	y: number;
}

type ElementType =
	| "select"
	| "marker"
	| "eraser"
	| "rectangle"
	| "ellipse"
	| "arrow"
	| "text";

interface Element {
	id: string;
	type: ElementType;
	points: Point[];
	color: string;
	width: number;
	seed: number;
	text?: string;
	angle: number;
}

export default function PresentationMarker() {
	let mainCanvasRef: HTMLCanvasElement | undefined;
	let tempCanvasRef: HTMLCanvasElement | undefined;
	let eraserCursorRef: HTMLDivElement | undefined;
	let markerCursorRef: HTMLDivElement | undefined;

	const [isDrawingMode, setIsDrawingMode] = createSignal(false);
	const [currentTool, setCurrentTool] = createSignal<ElementType>("marker");
	const [currentColor, setCurrentColor] = createSignal("#ff4444");
	const [elements, setElements] = createSignal<Element[]>([]);

	onMount(() => {
		const saved = localStorage.getItem("presentation_marker_elements");
		if (saved) {
			try {
				setElements(JSON.parse(saved));
				redraw();
			} catch (e) {
				console.error("Failed to parse saved elements", e);
			}
		}

		createEffect(() => {
			localStorage.setItem(
				"presentation_marker_elements",
				JSON.stringify(elements()),
			);
		});
	});

	const [isCurrentlyDrawing, setIsCurrentlyDrawing] = createSignal(false);
	const [selectedElementId, setSelectedElementId] = createSignal<string | null>(
		null,
	);
	const [pendingDeletionIds, setPendingDeletionIds] = createSignal<Set<string>>(
		new Set<string>(),
	);
	const [editingTextId, setEditingTextId] = createSignal<string | null>(null);
	const [editingTextValue, setEditingTextValue] = createSignal("");
	const [editingTextPos, setEditingTextPos] = createSignal<Point | null>(null);
	const [resizeHandle, setResizeHandle] = createSignal<string | null>(null);
	const [resizeStartBounds, setResizeStartBounds] = createSignal<{
		minX: number;
		maxX: number;
		minY: number;
		maxY: number;
	} | null>(null);
	const [resizeInitialWidth, setResizeInitialWidth] = createSignal(0);
	const [dragStartAngle, setDragStartAngle] = createSignal(0);

	let activeElement: Element | null = null;
	let dragStartPos: Point | null = null;
	let dragInitialPoints: Point[] = [];

	const CONSTANTS = {
		ERASER_SIZE: 50,
		MARKER_WIDTH: 4,
		FONT_SIZE_MULTIPLIER: 6,
		LINE_HEIGHT: 1.25,
		SELECTION_PADDING: 5,
		HIT_RADIUS_MARKER: 10,
		HIT_RADIUS_DEFAULT: 15,
		ARROW_HEAD_SIZE: 15,
		TEXT_BASELINE_OFFSET: 0.875,
		HANDLE_SIZE: 10,
		ROTATION_HANDLE_OFFSET: 25,
	} as const;

	// High-DPI Scaling Utility
	const setupCanvas = (canvas: HTMLCanvasElement) => {
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const dpr = window.devicePixelRatio || 1;
		const width = window.innerWidth;
		const height = window.innerHeight;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		ctx.scale(dpr, dpr);
		return ctx;
	};

	const handleResize = () => {
		if (mainCanvasRef) setupCanvas(mainCanvasRef);
		if (tempCanvasRef) setupCanvas(tempCanvasRef);
		redraw();
	};

	const getPos = (e: MouseEvent | TouchEvent) => {
		if (!tempCanvasRef) return { x: 0, y: 0 };
		const rect = tempCanvasRef.getBoundingClientRect();
		let clientX: number, clientY: number;
		if ("touches" in e) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}
		return {
			x: clientX - rect.left,
			y: clientY - rect.top + window.scrollY,
		};
	};

	const rotatePoint = (p: Point, center: Point, angle: number): Point => {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		return {
			x: center.x + (p.x - center.x) * cos - (p.y - center.y) * sin,
			y: center.y + (p.x - center.x) * sin + (p.y - center.y) * cos,
		};
	};

	const distToSegment = (p: Point, a: Point, b: Point) => {
		const v = { x: b.x - a.x, y: b.y - a.y };
		const w = { x: p.x - a.x, y: p.y - a.y };
		const c1 = w.x * v.x + w.y * v.y;
		if (c1 <= 0) return Math.sqrt(w.x * w.x + w.y * w.y);
		const c2 = v.x * v.x + v.y * v.y;
		if (c2 <= c1) {
			const d = { x: p.x - b.x, y: p.y - b.y };
			return Math.sqrt(d.x * d.x + d.y * d.y);
		}
		const b2 = c1 / c2;
		const pb = { x: a.x + b2 * v.x, y: a.y + b2 * v.y };
		const dpb = { x: p.x - pb.x, y: p.y - pb.y };
		return Math.sqrt(dpb.x * dpb.x + dpb.y * dpb.y);
	};

	const hitTestMarker = (el: Element, pos: Point) => {
		for (let i = 0; i < el.points.length - 1; i++) {
			if (
				distToSegment(pos, el.points[i], el.points[i + 1]) <
				el.width + CONSTANTS.HIT_RADIUS_MARKER
			) {
				return true;
			}
		}
		return false;
	};

	const hitTestRectangle = (el: Element, pos: Point) => {
		const [a, b] = el.points;
		const minX = Math.min(a.x, b.x);
		const maxX = Math.max(a.x, b.x);
		const minY = Math.min(a.y, b.y);
		const maxY = Math.max(a.y, b.y);
		const edges = [
			distToSegment(pos, { x: minX, y: minY }, { x: maxX, y: minY }),
			distToSegment(pos, { x: maxX, y: minY }, { x: maxX, y: maxY }),
			distToSegment(pos, { x: maxX, y: maxY }, { x: minX, y: maxY }),
			distToSegment(pos, { x: minX, y: maxY }, { x: minX, y: minY }),
		];
		return edges.some((d) => d < CONSTANTS.HIT_RADIUS_DEFAULT);
	};

	const hitTestEllipse = (el: Element, pos: Point) => {
		const [a, b] = el.points;
		const cx = (a.x + b.x) / 2;
		const cy = (a.y + b.y) / 2;
		const rx = Math.abs(a.x - b.x) / 2;
		const ry = Math.abs(a.y - b.y) / 2;
		const dx = pos.x - cx;
		const dy = pos.y - cy;
		const val = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
		return val >= 0.7 && val <= 1.3;
	};

	const hitTestArrow = (el: Element, pos: Point) => {
		const [a, b] = el.points;
		return distToSegment(pos, a, b) < CONSTANTS.HIT_RADIUS_DEFAULT;
	};

	const measureElementText = (text: string, fontSize: number) => {
		if (!mainCanvasRef) return 0;
		const ctx = mainCanvasRef.getContext("2d");
		if (!ctx) return 0;
		ctx.save();
		ctx.font = `${fontSize}px "Excalifont", "Xiaolai", sans-serif`;
		const lines = text.split("\n");
		let maxWidth = 0;
		lines.forEach((line) => {
			const w = ctx.measureText(line).width;
			if (w > maxWidth) maxWidth = w;
		});
		ctx.restore();
		return maxWidth;
	};

	const getElementBounds = (el: Element) => {
		let minX: number, maxX: number, minY: number, maxY: number;
		if (el.type === "text" && el.text) {
			const [p] = el.points;
			const fontSize = el.width * CONSTANTS.FONT_SIZE_MULTIPLIER;
			const lineHeight = fontSize * CONSTANTS.LINE_HEIGHT;
			const lines = el.text.split("\n");
			const totalHeight = lines.length * lineHeight;
			const textWidth = measureElementText(el.text, fontSize);

			minX = p.x - CONSTANTS.SELECTION_PADDING;
			maxX = p.x + textWidth + CONSTANTS.SELECTION_PADDING;
			minY = p.y - CONSTANTS.SELECTION_PADDING;
			maxY = p.y + totalHeight + CONSTANTS.SELECTION_PADDING;
		} else {
			const xs = el.points.map((p) => p.x);
			const ys = el.points.map((p) => p.y);
			minX = Math.min(...xs) - CONSTANTS.SELECTION_PADDING;
			maxX = Math.max(...xs) + CONSTANTS.SELECTION_PADDING;
			minY = Math.min(...ys) - CONSTANTS.SELECTION_PADDING;
			maxY = Math.max(...ys) + CONSTANTS.SELECTION_PADDING;
		}
		return { minX, maxX, minY, maxY };
	};

	const hitTestText = (el: Element, pos: Point) => {
		if (!el.text) return false;
		const bounds = getElementBounds(el);
		const tolerance = 5;
		return (
			pos.x >= bounds.minX - tolerance &&
			pos.x <= bounds.maxX + tolerance &&
			pos.y >= bounds.minY - tolerance &&
			pos.y <= bounds.maxY + tolerance
		);
	};

	const hitTestResizeHandle = (el: Element, localPos: Point) => {
		const bounds = getElementBounds(el);
		const handleSize = CONSTANTS.HANDLE_SIZE;
		const handles = [
			{ name: "nw", x: bounds.minX, y: bounds.minY },
			{ name: "ne", x: bounds.maxX, y: bounds.minY },
			{ name: "sw", x: bounds.minX, y: bounds.maxY },
			{ name: "se", x: bounds.maxX, y: bounds.maxY },
		];

		for (const handle of handles) {
			if (
				localPos.x >= handle.x - handleSize / 2 &&
				localPos.x <= handle.x + handleSize / 2 &&
				localPos.y >= handle.y - handleSize / 2 &&
				localPos.y <= handle.y + handleSize / 2
			) {
				return handle.name;
			}
		}

		const cx = (bounds.minX + bounds.maxX) / 2;
		const rotY = bounds.minY - CONSTANTS.ROTATION_HANDLE_OFFSET;
		if (
			localPos.x >= cx - handleSize / 2 &&
			localPos.x <= cx + handleSize / 2 &&
			localPos.y >= rotY - handleSize / 2 &&
			localPos.y <= rotY + handleSize / 2
		) {
			return "rotate";
		}

		return null;
	};

	const hitTest = (pos: Point) => {
		if (selectedElementId()) {
			const el = elements().find((e) => e.id === selectedElementId());
			if (el) {
				const bounds = getElementBounds(el);
				const cx = (bounds.minX + bounds.maxX) / 2;
				const cy = (bounds.minY + bounds.maxY) / 2;
				const localPos = rotatePoint(pos, { x: cx, y: cy }, -el.angle);
				const handle = hitTestResizeHandle(el, localPos);
				if (handle) return `resize-${handle}`;
			}
		}

		const sortedElements = [...elements()].reverse();
		for (const el of sortedElements) {
			let isHit = false;
			const bounds = getElementBounds(el);
			const cx = (bounds.minX + bounds.maxX) / 2;
			const cy = (bounds.minY + bounds.maxY) / 2;
			const localPos = rotatePoint(pos, { x: cx, y: cy }, -el.angle);

			switch (el.type) {
				case "marker":
					isHit = hitTestMarker(el, localPos);
					break;
				case "rectangle":
					isHit = hitTestRectangle(el, localPos);
					break;
				case "ellipse":
					isHit = hitTestEllipse(el, localPos);
					break;
				case "arrow":
					isHit = hitTestArrow(el, localPos);
					break;
				case "text":
					isHit = hitTestText(el, localPos);
					break;
			}
			if (isHit) return el.id;
		}
		return null;
	};

	const startDrawing = (e: MouseEvent | TouchEvent) => {
		if (!isDrawingMode()) return;
		const pos = getPos(e);
		setIsCurrentlyDrawing(true);

		if (currentTool() === "select") {
			const hitResult = hitTest(pos);
			if (hitResult?.startsWith("resize-")) {
				const handle = hitResult.split("-")[1];
				setResizeHandle(handle);
				const selectedId = selectedElementId();
				if (selectedId) {
					const el = elements().find((e) => e.id === selectedId);
					if (el) {
						setResizeStartBounds(getElementBounds(el));
						dragInitialPoints = el.points.map((p) => ({ ...p }));
						setResizeInitialWidth(el.width);
						setDragStartAngle(el.angle);
						dragStartPos = pos;
					}
				}
			} else {
				setSelectedElementId(hitResult);
				setResizeHandle(null);
				setResizeStartBounds(null);
				if (hitResult) {
					const el = elements().find((e) => e.id === hitResult);
					if (el) {
						dragStartPos = pos;
						dragInitialPoints = el.points.map((p) => ({ ...p }));
					}
				}
			}
			redraw();
		} else if (currentTool() === "eraser") {
			setPendingDeletionIds(new Set<string>());
			checkHit(pos);
		} else if (currentTool() === "text") {
			// If we are currently editing text, committing it takes precedence.
			// Return immediately after commit to avoid creating a new text box.
			if (editingTextId()) {
				commitText();
				return;
			}
			const id = Math.random().toString(36).substr(2, 9);
			setEditingTextId(id);
			setEditingTextPos(pos);
			setEditingTextValue("");
			setIsCurrentlyDrawing(false);
		} else {
			setSelectedElementId(null);
			activeElement = {
				id: Math.random().toString(36).substr(2, 9),
				type: currentTool(),
				points: [pos, pos],
				color: currentColor(),
				width: CONSTANTS.MARKER_WIDTH,
				seed: Math.floor(Math.random() * 2 ** 31),
				angle: 0,
			};
		}
	};

	const checkHit = (pos: Point) => {
		const hitIds = new Set(pendingDeletionIds());
		let changed = false;
		elements().forEach((el) => {
			if (hitIds.has(el.id)) return;
			const id = hitTest(pos);
			if (id === el.id) {
				hitIds.add(el.id);
				changed = true;
			}
		});
		if (changed) {
			setPendingDeletionIds(hitIds);
			redraw();
		}
	};

	const draw = (e: MouseEvent | TouchEvent) => {
		const pos = getPos(e);
		let clientX: number, clientY: number;
		if ("touches" in e) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		if (eraserCursorRef)
			eraserCursorRef.style.transform = `translate(${clientX - CONSTANTS.ERASER_SIZE / 2}px, ${clientY - CONSTANTS.ERASER_SIZE / 2}px)`;
		if (markerCursorRef)
			markerCursorRef.style.transform = `translate(${clientX - 4}px, ${clientY - 4}px)`;

		if (!isCurrentlyDrawing() || !isDrawingMode()) return;

		if (currentTool() === "select" && selectedElementId() && dragStartPos) {
			if (resizeHandle() === "rotate") {
				setElements(
					elements().map((el) => {
						if (el.id === selectedElementId()) {
							const bounds = getElementBounds(el);
							const cx = (bounds.minX + bounds.maxX) / 2;
							const cy = (bounds.minY + bounds.maxY) / 2;
							const angle = Math.atan2(pos.y - cy, pos.x - cx) + Math.PI / 2;
							return { ...el, angle };
						}
						return el;
					}),
				);
			} else if (resizeHandle()) {
				const handle = resizeHandle();
				const startBounds = resizeStartBounds();

				if (handle && startBounds) {
					const cx = (startBounds.minX + startBounds.maxX) / 2;
					const cy = (startBounds.minY + startBounds.maxY) / 2;

					const dragStartAngleVal = dragStartAngle();
					const localPos = rotatePoint(
						pos,
						{ x: cx, y: cy },
						-dragStartAngleVal,
					);
					const localStartPos = rotatePoint(
						dragStartPos,
						{ x: cx, y: cy },
						-dragStartAngleVal,
					);

					const dx = localPos.x - localStartPos.x;
					const dy = localPos.y - localStartPos.y;

					const newBounds = { ...startBounds };
					if (handle.includes("e")) newBounds.maxX = startBounds.maxX + dx;
					if (handle.includes("w")) newBounds.minX = startBounds.minX + dx;
					if (handle.includes("s")) newBounds.maxY = startBounds.maxY + dy;
					if (handle.includes("n")) newBounds.minY = startBounds.minY + dy;

					const minSize = 20;
					if (newBounds.maxX - newBounds.minX < minSize) {
						if (handle.includes("e")) newBounds.maxX = newBounds.minX + minSize;
						else if (handle.includes("w"))
							newBounds.minX = newBounds.maxX - minSize;
					}
					if (newBounds.maxY - newBounds.minY < minSize) {
						if (handle.includes("s")) newBounds.maxY = newBounds.minY + minSize;
						else if (handle.includes("n"))
							newBounds.minY = newBounds.maxY - minSize;
					}

					setElements(
						elements().map((el) => {
							if (el.id === selectedElementId()) {
								const oldWidth = startBounds.maxX - startBounds.minX;
								const oldHeight = startBounds.maxY - startBounds.minY;
								const newWidth = newBounds.maxX - newBounds.minX;
								const newHeight = newBounds.maxY - newBounds.minY;
								const safeOldWidth = oldWidth === 0 ? 1 : oldWidth;
								const safeOldHeight = oldHeight === 0 ? 1 : oldHeight;

								const scaleX = newWidth / safeOldWidth;
								const scaleY = newHeight / safeOldHeight;

								if (el.type === "rectangle" || el.type === "ellipse") {
									return {
										...el,
										points: [
											{
												x: newBounds.minX + CONSTANTS.SELECTION_PADDING,
												y: newBounds.minY + CONSTANTS.SELECTION_PADDING,
											},
											{
												x: newBounds.maxX - CONSTANTS.SELECTION_PADDING,
												y: newBounds.maxY - CONSTANTS.SELECTION_PADDING,
											},
										],
									};
								} else if (
									el.type === "marker" ||
									el.type === "arrow" ||
									el.type === "text"
								) {
									let newPoints: Point[];
									let newElementWidth = el.width;

									if (el.type === "text") {
										const PADDING = CONSTANTS.SELECTION_PADDING;
										const startWidth = startBounds.maxX - startBounds.minX;
										const startHeight = startBounds.maxY - startBounds.minY;
										const startContentWidth = Math.max(
											1,
											startWidth - 2 * PADDING,
										);
										const startContentHeight = Math.max(
											1,
											startHeight - 2 * PADDING,
										);
										const newRawWidth = Math.max(
											1,
											newBounds.maxX - newBounds.minX - 2 * PADDING,
										);
										const newRawHeight = Math.max(
											1,
											newBounds.maxY - newBounds.minY - 2 * PADDING,
										);
										const sx = newRawWidth / startContentWidth;
										const sy = newRawHeight / startContentHeight;
										let scale = 1;
										if (handle.includes("n") || handle.includes("s"))
											scale = sy;
										else if (handle === "e" || handle === "w") scale = sx;
										else scale = Math.abs(sx - 1) > Math.abs(sy - 1) ? sx : sy;

										const finalContentWidth = startContentWidth * scale;
										const finalContentHeight = startContentHeight * scale;
										const finalWidth = finalContentWidth + 2 * PADDING;
										const finalHeight = finalContentHeight + 2 * PADDING;

										let newMinX = newBounds.minX;
										let newMinY = newBounds.minY;
										if (handle.includes("w"))
											newMinX = startBounds.maxX - finalWidth;
										else if (handle.includes("e")) newMinX = startBounds.minX;
										if (handle.includes("n"))
											newMinY = startBounds.maxY - finalHeight;
										else if (handle.includes("s")) newMinY = startBounds.minY;
										if (handle === "w" || handle === "e")
											newMinY = startBounds.minY;
										if (handle === "n" || handle === "s")
											newMinX = startBounds.minX;

										newPoints = [
											{ x: newMinX + PADDING, y: newMinY + PADDING },
										];
										newElementWidth = resizeInitialWidth() * scale;
									} else {
										newPoints = dragInitialPoints.map((p) => ({
											x:
												newBounds.minX +
												((p.x - startBounds.minX) / safeOldWidth) * newWidth,
											y:
												newBounds.minY +
												((p.y - startBounds.minY) / safeOldHeight) * newHeight,
										}));
										newElementWidth =
											resizeInitialWidth() * ((scaleX + scaleY) / 2);
									}
									return {
										...el,
										points: newPoints,
										width: Math.max(1, newElementWidth),
									};
								}
							}
							return el;
						}),
					);
				}
			} else {
				const dx = pos.x - dragStartPos.x;
				const dy = pos.y - dragStartPos.y;
				setElements(
					elements().map((el) => {
						if (el.id === selectedElementId()) {
							return {
								...el,
								points: dragInitialPoints.map((p) => ({
									x: p.x + dx,
									y: p.y + dy,
								})),
							};
						}
						return el;
					}),
				);
			}
			redraw();
		} else if (currentTool() === "eraser") {
			checkHit(pos);
		} else if (activeElement) {
			if (activeElement.type === "marker") {
				activeElement.points.push(pos);
			} else {
				activeElement.points[1] = pos;
			}
			updateTempCanvas();
		}
	};

	const commitText = () => {
		const id = editingTextId();
		const pos = editingTextPos();
		const text = editingTextValue().trim();

		if (id && pos && text) {
			const existingElement = elements().find((el) => el.id === id);
			if (existingElement) {
				setElements(
					elements().map((el) =>
						el.id === id
							? { ...el, points: [{ ...pos }], text, color: currentColor() }
							: el,
					),
				);
			} else {
				const newElement: Element = {
					id,
					type: "text",
					points: [{ ...pos }],
					color: currentColor(),
					width: CONSTANTS.MARKER_WIDTH,
					seed: Math.floor(Math.random() * 2 ** 31),
					text,
					angle: 0,
				};
				setElements([...elements(), newElement]);
			}
			// Automatically switch to Select tool and select the created text
			// This matches standard diagramming tool behavior
			setCurrentTool("select");
			setSelectedElementId(id);
			redraw();
		} else {
			// If text was empty or cancelled, ensure we leave text mode to avoid confusion
			setCurrentTool("select");
		}

		setEditingTextId(null);
		setEditingTextPos(null);
		setEditingTextValue("");
	};

	const handleDoubleClick = () => {
		if (!isDrawingMode() || currentTool() !== "select") return;

		const selectedId = selectedElementId();
		if (!selectedId) return;

		const element = elements().find((el) => el.id === selectedId);
		if (!element || element.type !== "text" || !element.text) return;

		setEditingTextId(element.id);
		setEditingTextPos(element.points[0]);
		setEditingTextValue(element.text);
	};

	const stopDrawing = () => {
		if (isCurrentlyDrawing()) {
			if (currentTool() === "eraser") {
				const ids = pendingDeletionIds();
				if (ids.size > 0) {
					setElements(elements().filter((el) => !ids.has(el.id)));
					setPendingDeletionIds(new Set<string>());
					redraw();
				}
			} else if (activeElement) {
				let shouldAdd = false;
				if (
					activeElement.type === "rectangle" ||
					activeElement.type === "ellipse" ||
					activeElement.type === "arrow"
				) {
					const [p1, p2] = activeElement.points;
					const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
					if (dist > 5) shouldAdd = true;
				} else if (activeElement.type === "marker") {
					const p1 = activeElement.points[0];
					const pLast = activeElement.points[activeElement.points.length - 1];
					const dist = Math.hypot(pLast.x - p1.x, pLast.y - p1.y);
					if (activeElement.points.length > 2 || dist > 5) shouldAdd = true;
				} else {
					shouldAdd = true;
				}

				if (shouldAdd) {
					setElements([...elements(), activeElement]);

					if (["rectangle", "ellipse", "arrow"].includes(activeElement.type)) {
						setCurrentTool("select");
						setSelectedElementId(activeElement.id);
					}
				}
				activeElement = null;
				if (tempCanvasRef) {
					const ctx = tempCanvasRef.getContext("2d");
					if (ctx) {
						ctx.save();
						ctx.setTransform(1, 0, 0, 1, 0, 0);
						ctx.clearRect(0, 0, tempCanvasRef.width, tempCanvasRef.height);
						ctx.restore();
					}
				}
				redraw();
			}
		}
		setIsCurrentlyDrawing(false);
		dragStartPos = null;
		setResizeHandle(null);
		setResizeStartBounds(null);
	};

	const renderElement = (
		ctx: CanvasRenderingContext2D,
		rc: ReturnType<typeof rough.canvas>,
		el: Element,
		isPending: boolean,
	) => {
		if (el.points.length < 1) return;
		const scrollY = window.scrollY;
		ctx.save();

		const isSelected = selectedElementId() === el.id;
		ctx.globalAlpha = isPending ? 0.2 : 1.0;

		const bounds = getElementBounds(el);
		const cx = (bounds.minX + bounds.maxX) / 2;
		const cy = (bounds.minY + bounds.maxY) / 2;

		ctx.translate(cx, cy - scrollY);
		ctx.rotate(el.angle);
		ctx.translate(-cx, -(cy - scrollY));

		if (el.type === "marker") {
			if (el.points.length < 2) return;
			const viewportPoints = el.points.map((p) => [p.x, p.y - scrollY]);
			const stroke = getStroke(viewportPoints, {
				size: el.width,
				thinning: 0.5,
				smoothing: 0.5,
				streamline: 0.5,
			});
			if (stroke.length > 0) {
				ctx.beginPath();
				ctx.fillStyle = el.color;
				ctx.moveTo(stroke[0][0], stroke[0][1]);
				for (let i = 1; i < stroke.length; i++)
					ctx.lineTo(stroke[i][0], stroke[i][1]);
				ctx.closePath();
				ctx.fill();
			}
		} else if (el.type === "text" && el.text) {
			const [p] = el.points;
			const fontSize = el.width * 6;
			const lineHeight = fontSize * CONSTANTS.LINE_HEIGHT;

			ctx.font = `${fontSize}px "Excalifont", "Xiaolai", sans-serif`;
			ctx.textBaseline = "alphabetic";
			ctx.fillStyle = el.color;

			const lines = el.text.split("\n");
			const verticalOffset = fontSize * CONSTANTS.TEXT_BASELINE_OFFSET;

			lines.forEach((line, i) => {
				ctx.fillText(
					line,
					p.x,
					p.y - scrollY + i * lineHeight + verticalOffset,
				);
			});
		} else if (el.points.length >= 2) {
			const [p1, p2] = el.points;
			const options = {
				stroke: el.color,
				strokeWidth: el.width,
				roughness: 1.5,
				seed: el.seed,
			};
			const y1 = p1.y - scrollY;
			const y2 = p2.y - scrollY;

			if (el.type === "rectangle")
				rc.rectangle(p1.x, y1, p2.x - p1.x, y2 - y1, options);
			else if (el.type === "ellipse") {
				const cw = Math.abs(p2.x - p1.x);
				const ch = Math.abs(y2 - y1);
				rc.ellipse((p1.x + p2.x) / 2, (y1 + y2) / 2, cw, ch, options);
			} else if (el.type === "arrow") {
				rc.line(p1.x, y1, p2.x, y2, options);
				const angle = Math.atan2(y2 - y1, p2.x - p1.x);
				const h = 15;
				rc.line(
					p2.x,
					y2,
					p2.x - h * Math.cos(angle - Math.PI / 6),
					y2 - h * Math.sin(angle - Math.PI / 6),
					options,
				);
				rc.line(
					p2.x,
					y2,
					p2.x - h * Math.cos(angle + Math.PI / 6),
					y2 - h * Math.sin(angle + Math.PI / 6),
					options,
				);
			}
		}

		if (isSelected) {
			ctx.setLineDash([5, 5]);
			ctx.strokeStyle = "#3b82f6";
			ctx.lineWidth = 2;

			const minX = bounds.minX;
			const maxX = bounds.maxX;
			const minY = bounds.minY - scrollY;
			const maxY = bounds.maxY - scrollY;

			ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);

			ctx.setLineDash([]);
			ctx.fillStyle = "#3b82f6";
			ctx.strokeStyle = "#ffffff";
			ctx.lineWidth = 1;
			const handleSize = CONSTANTS.HANDLE_SIZE;
			const handles = [
				[minX, minY], // top-left
				[maxX, minY], // top-right
				[minX, maxY], // bottom-left
				[maxX, maxY], // bottom-right
			];
			handles.forEach(([hx, hy]) => {
				ctx.fillRect(
					hx - handleSize / 2,
					hy - handleSize / 2,
					handleSize,
					handleSize,
				);
				ctx.strokeRect(
					hx - handleSize / 2,
					hy - handleSize / 2,
					handleSize,
					handleSize,
				);
			});

			const rotX = (minX + maxX) / 2;
			const rotY = minY - CONSTANTS.ROTATION_HANDLE_OFFSET;

			ctx.beginPath();
			ctx.moveTo(rotX, minY);
			ctx.lineTo(rotX, rotY);
			ctx.stroke();

			ctx.fillRect(
				rotX - handleSize / 2,
				rotY - handleSize / 2,
				handleSize,
				handleSize,
			);
			ctx.strokeRect(
				rotX - handleSize / 2,
				rotY - handleSize / 2,
				handleSize,
				handleSize,
			);
		}

		ctx.restore();
	};

	const updateTempCanvas = () => {
		if (!tempCanvasRef || !activeElement) return;
		const ctx = tempCanvasRef.getContext("2d");
		if (!ctx) return;
		const rc = rough.canvas(tempCanvasRef);
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, tempCanvasRef.width, tempCanvasRef.height);
		ctx.restore();
		renderElement(ctx, rc, activeElement, false);
	};

	const redraw = () => {
		if (!mainCanvasRef) return;
		const ctx = mainCanvasRef.getContext("2d");
		if (!ctx) return;
		const rc = rough.canvas(mainCanvasRef);
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, mainCanvasRef.width, mainCanvasRef.height);
		ctx.restore();
		const pIds = pendingDeletionIds();
		elements().forEach((el) => {
			renderElement(ctx, rc, el, pIds.has(el.id));
		});
	};

	const undo = () => {
		if (elements().length > 0) {
			setElements(elements().slice(0, -1));
			redraw();
		}
	};
	const clearCanvas = () => {
		setElements([]);
		redraw();
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "z") {
			e.preventDefault();
			undo();
		}
		if (e.key === "Enter" && e.ctrlKey && editingTextId()) {
			e.preventDefault();
			// commitText now handles tool switching, no need to duplicate logic here
			commitText();
		}
		if (e.key === "Escape") {
			if (editingTextId()) {
				setEditingTextId(null);
				setEditingTextPos(null);
				setEditingTextValue("");
			} else if (selectedElementId()) {
				setSelectedElementId(null);
				setResizeHandle(null);
				setResizeStartBounds(null);
				redraw();
			}
		}
		if (
			e.shiftKey &&
			(e.key === "Delete" || e.key === "Backspace" || e.key === "Del")
		) {
			const id = selectedElementId();
			if (id && !editingTextId()) {
				e.preventDefault();
				setElements(elements().filter((el) => el.id !== id));
				setSelectedElementId(null);
				setResizeHandle(null);
				setResizeStartBounds(null);
				redraw();
			}
		}
	};

	onMount(() => {
		window.addEventListener("resize", handleResize);
		window.addEventListener("scroll", redraw);
		window.addEventListener("keydown", handleKeyDown);
		handleResize();
		onCleanup(() => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("scroll", redraw);
			window.removeEventListener("keydown", handleKeyDown);
		});
	});

	const tools: ElementType[] = [
		"select",
		"marker",
		"rectangle",
		"ellipse",
		"arrow",
		"text",
		"eraser",
	];

	return (
		<>
			<canvas
				ref={mainCanvasRef}
				class="fixed top-0 left-0 z-8000 pointer-events-none"
			/>
			<Show when={editingTextPos()}>
				{(pos) => (
					<textarea
						value={editingTextValue()}
						class="drawing-text-area fixed"
						style={{
							left: `${pos().x}px`,
							top: `${pos().y - window.scrollY}px`,
							color: currentColor(),
							"font-size": `${CONSTANTS.MARKER_WIDTH * CONSTANTS.FONT_SIZE_MULTIPLIER}px`,
							"min-width": "1px",
							"min-height": "1em",
						}}
						onInput={(e) => {
							setEditingTextValue(e.currentTarget.value);
							const target = e.currentTarget;
							target.style.height = "1px";
							target.style.height = `${target.scrollHeight}px`;
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" && e.ctrlKey) {
								e.preventDefault();
								commitText();
							}
							if (e.key === "Escape") {
								setEditingTextId(null);
								setEditingTextPos(null);
								setEditingTextValue("");
							}
						}}
						onBlur={commitText}
						ref={(el) => {
							setTimeout(() => {
								el.focus();
								el.style.height = "1px";
								el.style.height = `${el.scrollHeight}px`;
							}, 0);
						}}
					/>
				)}
			</Show>
			<canvas
				ref={tempCanvasRef}
				class={`fixed top-0 left-0 z-8001 ${isDrawingMode() ? "cursor-none pointer-events-auto" : "pointer-events-none"}`}
				onMouseDown={startDrawing}
				onMouseMove={draw}
				onMouseUp={stopDrawing}
				onMouseOut={stopDrawing}
				onBlur={stopDrawing}
				onDblClick={handleDoubleClick}
				onTouchStart={startDrawing}
				onTouchMove={draw}
				onTouchEnd={stopDrawing}
			/>

			<Show when={isDrawingMode() && currentTool() === "eraser"}>
				<div
					ref={eraserCursorRef}
					class="fixed pointer-events-none z-8002 border border-white/50 rounded-full bg-white/10"
					style={{
						width: `${CONSTANTS.ERASER_SIZE}px`,
						height: `${CONSTANTS.ERASER_SIZE}px`,
						top: "0",
						left: "0",
						"will-change": "transform",
					}}
				/>
			</Show>

			<Show when={isDrawingMode() && currentTool() !== "eraser"}>
				<div
					ref={markerCursorRef}
					class="fixed pointer-events-none z-8002 border border-white/50 rounded-full"
					style={{
						width: "8px",
						height: "8px",
						"background-color":
							currentTool() === "select" ? "#3b82f6" : currentColor(),
						top: "0",
						left: "0",
						"will-change": "transform",
					}}
				/>
			</Show>

			<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-9000 flex items-center gap-4 bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
				<button
					type="button"
					onClick={() => setIsDrawingMode(!isDrawingMode())}
					class={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDrawingMode() ? "bg-cyan-500 text-black" : "text-zinc-400 hover:text-white"}`}
				>
					{isDrawingMode() ? "Mode: Drawing" : "Mode: Viewing"}
				</button>
				<div class="w-px h-6 bg-white/10" />
				<Show when={isDrawingMode()}>
					<div class="flex gap-1 bg-black/40 p-1 rounded-xl">
						<For each={tools}>
							{(tool) => (
								<button
									type="button"
									onClick={() => setCurrentTool(tool)}
									class={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all ${currentTool() === tool ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
								>
									{tool}
								</button>
							)}
						</For>
					</div>
					<div class="w-px h-6 bg-white/10" />
					<div class="flex gap-2 px-2">
						<For
							each={[
								"#ff4444",
								"#44ff44",
								"#4444ff",
								"#00f2ff",
								"#ffff44",
								"#ffffff",
							]}
						>
							{(color) => (
								<button
									type="button"
									onClick={() => {
										setCurrentColor(color);
										if (
											currentTool() === "eraser" ||
											currentTool() === "select"
										)
											setCurrentTool("marker");
									}}
									class={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-125 ${currentColor() === color ? "border-white scale-110" : "border-transparent"}`}
									style={{ "background-color": color }}
								/>
							)}
						</For>
					</div>
					<div class="w-px h-6 bg-white/10" />
					<div class="flex gap-1">
						<button
							type="button"
							onClick={undo}
							class="px-3 py-2 text-xs text-zinc-400 hover:text-white"
						>
							Undo
						</button>
						<button
							type="button"
							onClick={clearCanvas}
							class="px-3 py-2 text-xs text-zinc-400 hover:text-red-400"
						>
							Clear
						</button>
					</div>
				</Show>
			</div>
		</>
	);
}
