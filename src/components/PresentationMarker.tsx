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

type StrokeStyle = "solid" | "dashed" | "dotted";

interface Element {
	id: string;
	type: ElementType;
	points: Point[];
	color: string;
	width: number;
	seed: number;
	text?: string;
	angle: number;
	strokeStyle?: StrokeStyle;
	roughness?: number;
	backgroundColor?: string;
	fillStyle?: "solid" | "hachure";
}

export default function PresentationMarker() {
	let mainCanvasRef: HTMLCanvasElement | undefined;
	let tempCanvasRef: HTMLCanvasElement | undefined;
	let eraserCursorRef: HTMLDivElement | undefined;
	let markerCursorRef: HTMLDivElement | undefined;

	const [isDrawingMode, setIsDrawingMode] = createSignal(false);
	const [currentTool, setCurrentTool] = createSignal<ElementType>("marker");
	const [currentColor, setCurrentColor] = createSignal("#ff4444");
	const [currentWidth, setCurrentWidth] = createSignal(4);
	const [currentStrokeStyle, setCurrentStrokeStyle] =
		createSignal<StrokeStyle>("solid");
	const [currentRoughness, setCurrentRoughness] = createSignal(1);
	const [elements, setElements] = createSignal<Element[]>([]);

	const strokeStyles: StrokeStyle[] = ["solid", "dashed", "dotted"];

	onMount(() => {
		const saved = localStorage.getItem("presentation_marker_elements");
		if (saved) {
			try {
				setElements(JSON.parse(saved));
				// Explicitly wait for specific fonts to load
				Promise.all([
					document.fonts.load('20px "Excalifont"'),
					document.fonts.load('20px "Xiaolai"'),
				]).then(() => {
					redraw();
					// Backup redraw in case of race conditions or font swap timing
					setTimeout(redraw, 100);
					setTimeout(redraw, 500);
				});
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
	const [selectedElementIds, setSelectedElementIds] = createSignal<Set<string>>(
		new Set(),
	);
	const [selectionBox, setSelectionBox] = createSignal<{
		start: Point;
		end: Point;
	} | null>(null);
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
	const [dragStartAngle, setDragStartAngle] = createSignal(0);

	let activeElement: Element | null = null;
	let dragStartPos: Point | null = null;
	const dragInitialState: Map<
		string,
		{ points: Point[]; angle: number; width: number }
	> = new Map();
	let potentialClickId: string | null = null;

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

	const getRotatedCorner = (
		x: number,
		y: number,
		cx: number,
		cy: number,
		angle: number,
	) => {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		return {
			x: cx + (x - cx) * cos - (y - cy) * sin,
			y: cy + (x - cx) * sin + (y - cy) * cos,
		};
	};

	const getRotatedBounds = (el: Element) => {
		const bounds = getElementBounds(el);
		if (el.angle === 0) return bounds;

		const cx = (bounds.minX + bounds.maxX) / 2;
		const cy = (bounds.minY + bounds.maxY) / 2;

		const corners = [
			getRotatedCorner(bounds.minX, bounds.minY, cx, cy, el.angle),
			getRotatedCorner(bounds.maxX, bounds.minY, cx, cy, el.angle),
			getRotatedCorner(bounds.maxX, bounds.maxY, cx, cy, el.angle),
			getRotatedCorner(bounds.minX, bounds.maxY, cx, cy, el.angle),
		];

		const xs = corners.map((p) => p.x);
		const ys = corners.map((p) => p.y);

		return {
			minX: Math.min(...xs),
			maxX: Math.max(...xs),
			minY: Math.min(...ys),
			maxY: Math.max(...ys),
		};
	};

	const getCommonBounds = (selectedIds: Set<string>) => {
		let minX = Infinity;
		let maxX = -Infinity;
		let minY = Infinity;
		let maxY = -Infinity;

		elements().forEach((el) => {
			if (selectedIds.has(el.id)) {
				const b = getRotatedBounds(el);
				if (b.minX < minX) minX = b.minX;
				if (b.maxX > maxX) maxX = b.maxX;
				if (b.minY < minY) minY = b.minY;
				if (b.maxY > maxY) maxY = b.maxY;
			}
		});

		if (minX === Infinity) return null;
		return { minX, maxX, minY, maxY };
	};

	const hitTest = (pos: Point) => {
		if (selectedElementIds().size > 1) {
			const bounds = getCommonBounds(selectedElementIds());
			if (bounds) {
				const handleSize = CONSTANTS.HANDLE_SIZE;
				// Check rotation handle
				const cx = (bounds.minX + bounds.maxX) / 2;
				const rotY = bounds.minY - CONSTANTS.ROTATION_HANDLE_OFFSET;

				if (
					pos.x >= cx - handleSize / 2 &&
					pos.x <= cx + handleSize / 2 &&
					pos.y >= rotY - handleSize / 2 &&
					pos.y <= rotY + handleSize / 2
				) {
					return "resize-rotate";
				}

				// Check resize handles
				const handles = [
					{ name: "nw", x: bounds.minX, y: bounds.minY },
					{ name: "ne", x: bounds.maxX, y: bounds.minY },
					{ name: "sw", x: bounds.minX, y: bounds.maxY },
					{ name: "se", x: bounds.maxX, y: bounds.maxY },
				];

				for (const handle of handles) {
					if (
						pos.x >= handle.x - handleSize / 2 &&
						pos.x <= handle.x + handleSize / 2 &&
						pos.y >= handle.y - handleSize / 2 &&
						pos.y <= handle.y + handleSize / 2
					) {
						return `resize-${handle.name}`;
					}
				}
			}
		}

		if (selectedElementIds().size === 1) {
			const id = Array.from(selectedElementIds())[0];
			const el = elements().find((e) => e.id === id);
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

		// If no strict hit, and we are in select mode, allow hitting the selection frame of already selected elements
		if (currentTool() === "select") {
			for (const el of sortedElements) {
				if (selectedElementIds().has(el.id)) {
					const bounds = getElementBounds(el);
					// Check if pos is within bounds.
					// We use a slightly looser check than strict shape to match the visual selection box.
					// Rotation is already handled because getElementBounds returns the axis-aligned bounding box of the rotated shape?
					// Wait, getElementBounds logic:
					// "xs = el.points.map((p) => p.x)... minX = Math.min..."
					// This logic calculates AABB of the *points*.
					// If the element is rotated, the points in `el.points` are NOT rotated in the data model (rotation is applied via `el.angle` during render).
					// BUT `hitTest` uses `rotatePoint(pos ... -el.angle)` for strict tests.
					// `getElementBounds` returns the bounds of the *unrotated* shape (local coordinates).
					// So for consistency, we should check the rotated point against these bounds?
					// YES.
					// In the strict loop above: `const localPos = rotatePoint(pos, { x: cx, y: cy }, -el.angle);`
					// We should replicate that logic.

					const cx = (bounds.minX + bounds.maxX) / 2;
					const cy = (bounds.minY + bounds.maxY) / 2;
					const localPos = rotatePoint(pos, { x: cx, y: cy }, -el.angle);

					if (
						localPos.x >= bounds.minX &&
						localPos.x <= bounds.maxX &&
						localPos.y >= bounds.minY &&
						localPos.y <= bounds.maxY
					) {
						return el.id;
					}
				}
			}
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
				if (selectedElementIds().size >= 1) {
					if (selectedElementIds().size === 1) {
						const selectedId = Array.from(selectedElementIds())[0];
						const el = elements().find((e) => e.id === selectedId);
						if (el) {
							setResizeStartBounds(getElementBounds(el));
							setDragStartAngle(el.angle);
						}
					} else {
						// Group bounds
						const commonBounds = getCommonBounds(selectedElementIds());
						setResizeStartBounds(commonBounds);
						setDragStartAngle(0);
					}

					dragInitialState.clear();
					elements().forEach((el) => {
						if (selectedElementIds().has(el.id)) {
							dragInitialState.set(el.id, {
								points: el.points.map((p) => ({ ...p })),
								angle: el.angle,
								width: el.width,
							});
						}
					});
					dragStartPos = pos;
				}
			} else {
				setResizeHandle(null);
				setResizeStartBounds(null);

				if (hitResult) {
					// Clicked on an element
					const newSelection = new Set(selectedElementIds());
					if (e.shiftKey) {
						if (newSelection.has(hitResult)) {
							newSelection.delete(hitResult);
						} else {
							newSelection.add(hitResult);
						}
						setSelectedElementIds(newSelection);
					} else {
						// If not holding shift
						if (newSelection.has(hitResult)) {
							// If clicking an already selected item, do NOT change selection yet.
							potentialClickId = hitResult;
						} else {
							// If clicking an unselected item, select it immediately (replaces group)
							setSelectedElementIds(new Set<string>([hitResult]));
						}
					}

					dragStartPos = pos;
					dragInitialState.clear();
					elements().forEach((el) => {
						if (selectedElementIds().has(el.id)) {
							dragInitialState.set(el.id, {
								points: el.points.map((p) => ({ ...p })),
								angle: el.angle,
								width: el.width,
							});
						}
					});
				} else {
					// Clicked on empty space
					if (!e.shiftKey) {
						setSelectedElementIds(new Set<string>());
					}
					// Start selection box
					setSelectionBox({ start: pos, end: pos });
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
			setSelectedElementIds(new Set<string>());
			activeElement = {
				id: Math.random().toString(36).substr(2, 9),
				type: currentTool(),
				points: [pos, pos],
				color: currentColor(),
				width: currentWidth(),
				seed: Math.floor(Math.random() * 2 ** 31),
				angle: 0,
				strokeStyle: currentStrokeStyle(),
				roughness: currentRoughness(),
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

		if (currentTool() === "select") {
			if (selectionBox()) {
				setSelectionBox((prev) => (prev ? { ...prev, end: pos } : null));
				redraw();
				return;
			}

			if (selectedElementIds().size > 0 && dragStartPos) {
				if (resizeHandle() === "rotate") {
					const startBounds = resizeStartBounds();
					if (startBounds) {
						const cx = (startBounds.minX + startBounds.maxX) / 2;
						const cy = (startBounds.minY + startBounds.maxY) / 2;

						// Angle of mouse relative to center
						const mouseAngle = Math.atan2(pos.y - cy, pos.x - cx);
						const startMouseAngle = Math.atan2(
							dragStartPos.y - cy,
							dragStartPos.x - cx,
						);
						const deltaAngle = mouseAngle - startMouseAngle;

						setElements(
							elements().map((el) => {
								if (selectedElementIds().has(el.id)) {
									const state = dragInitialState.get(el.id);
									if (state) {
										const bounds = getElementBounds({
											...el,
											points: state.points,
											angle: state.angle,
											width: state.width,
										} as Element);
										const elCx = (bounds.minX + bounds.maxX) / 2;
										const elCy = (bounds.minY + bounds.maxY) / 2;

										const newCxCy = rotatePoint(
											{ x: elCx, y: elCy },
											{ x: cx, y: cy },
											deltaAngle,
										);
										const dx = newCxCy.x - elCx;
										const dy = newCxCy.y - elCy;

										const newPoints = state.points.map((p) => ({
											x: p.x + dx,
											y: p.y + dy,
										}));

										return {
											...el,
											points: newPoints,
											angle: state.angle + deltaAngle,
										};
									}
								}
								return el;
							}),
						);
					}
				} else if (resizeHandle()) {
					const handle = resizeHandle();
					const startBounds = resizeStartBounds();

					if (handle && startBounds) {
						// 1. Calculate Center of Rotation for the resizing box
						const cx = (startBounds.minX + startBounds.maxX) / 2;
						const cy = (startBounds.minY + startBounds.maxY) / 2;
						const angle = dragStartAngle();

						// 2. Project mouse delta into local space
						const localPos = rotatePoint(pos, { x: cx, y: cy }, -angle);
						const localStart = rotatePoint(
							dragStartPos,
							{ x: cx, y: cy },
							-angle,
						);
						const dx = localPos.x - localStart.x;
						const dy = localPos.y - localStart.y;

						const newBounds = { ...startBounds };
						if (handle.includes("e")) newBounds.maxX += dx;
						if (handle.includes("w")) newBounds.minX += dx;
						if (handle.includes("s")) newBounds.maxY += dy;
						if (handle.includes("n")) newBounds.minY += dy;

						// Determine Anchor Point (Content Edge)
						// We need this early for vector projection
						const PAD = CONSTANTS.SELECTION_PADDING;
						let anchorX = 0;
						let anchorY = 0;

						if (handle.includes("w"))
							anchorX = startBounds.maxX - PAD; // Moving West -> Anchor is East Content Edge
						else if (handle.includes("e"))
							anchorX = startBounds.minX + PAD; // Moving East -> Anchor is West Content Edge
						else anchorX = (startBounds.minX + startBounds.maxX) / 2;

						if (handle.includes("n")) anchorY = startBounds.maxY - PAD;
						else if (handle.includes("s")) anchorY = startBounds.minY + PAD;
						else anchorY = (startBounds.minY + startBounds.maxY) / 2;

						const startWidth = startBounds.maxX - startBounds.minX - 2 * PAD;
						const startHeight = startBounds.maxY - startBounds.minY - 2 * PAD;
						const newWidth = newBounds.maxX - newBounds.minX - 2 * PAD;
						const newHeight = newBounds.maxY - newBounds.minY - 2 * PAD;

						// Avoid division by zero
						let scaleX = startWidth <= 0 ? 1 : newWidth / startWidth;
						let scaleY = startHeight <= 0 ? 1 : newHeight / startHeight;

						// For groups, enforce fixed aspect ratio (Uniform Scaling) to prevent distortion
						// For TEXT, also enforce fixed aspect ratio using Vector Projection to prevent jitter
						const isGroup = selectedElementIds().size > 1;
						let isText = false;
						if (selectedElementIds().size === 1) {
							const id = Array.from(selectedElementIds())[0];
							const el = elements().find((e) => e.id === id);
							if (el && el.type === "text") isText = true;
						}

						if (isGroup || isText) {
							// For Corner Handles: Use Vector Projection to avoid jitter
							if (handle.length > 1) {
								// Start Handle Position (Content Coords)
								// If anchor is minX, handle was maxX.
								// If anchor is centered, handle is centered (but this is corner, so not centered)
								let startHandleX = 0;
								let startHandleY = 0;

								if (handle.includes("e")) startHandleX = startBounds.maxX - PAD;
								else startHandleX = startBounds.minX + PAD;

								if (handle.includes("s")) startHandleY = startBounds.maxY - PAD;
								else startHandleY = startBounds.minY + PAD;

								// Vector V (Anchor -> StartHandle)
								const vx = startHandleX - anchorX;
								const vy = startHandleY - anchorY;

								// Vector M (Anchor -> CurrentHandle)
								// CurrentHandle = StartHandle + (dx, dy)
								const mx = vx + dx;
								const my = vy + dy;

								// Projection scalar = (M . V) / (V . V)
								const vMagSq = vx * vx + vy * vy;
								if (vMagSq > 0) {
									const dot = mx * vx + my * vy;
									const scale = dot / vMagSq;
									scaleX = scale;
									scaleY = scale;
								}
							} else {
								// Side Handles: Dominant axis logic is fine
								const devX = Math.abs(scaleX - 1);
								const devY = Math.abs(scaleY - 1);
								const s = devX > devY ? scaleX : scaleY;
								scaleX = s;
								scaleY = s;
							}
						}

						// 3. Calculate Global Fixed Point (Where the anchor IS currently on screen)
						const globalFixedPoint = rotatePoint(
							{ x: anchorX, y: anchorY },
							{ x: cx, y: cy },
							angle,
						);

						const isSingle = selectedElementIds().size === 1;

						// PHASE 1: Apply Scaling
						let nextElements = elements().map((el) => {
							if (selectedElementIds().has(el.id)) {
								const state = dragInitialState.get(el.id);
								if (!state) return el;

								let newPoints: Point[];
								let newElementWidth = state.width;

								if (el.type === "text") {
									const px = anchorX + (state.points[0].x - anchorX) * scaleX;
									const py = anchorY + (state.points[0].y - anchorY) * scaleY;
									newPoints = [{ x: px, y: py }];
									const devX = Math.abs(scaleX - 1);
									const devY = Math.abs(scaleY - 1);
									const s = devX > devY ? scaleX : scaleY;
									newElementWidth = state.width * s;
								} else {
									newPoints = state.points.map((p) => ({
										x: anchorX + (p.x - anchorX) * scaleX,
										y: anchorY + (p.y - anchorY) * scaleY,
									}));
									const avgScale = (Math.abs(scaleX) + Math.abs(scaleY)) / 2;
									newElementWidth = state.width * avgScale;
								}

								// Single element rotation correction (keep this as it handles local rotation well)
								if (isSingle) {
									const newElBounds = getElementBounds({
										...el,
										points: newPoints,
										width: newElementWidth,
										angle: el.angle,
									} as Element);
									const newCx = (newElBounds.minX + newElBounds.maxX) / 2;
									const newCy = (newElBounds.minY + newElBounds.maxY) / 2;

									const currentGlobalAnchor = rotatePoint(
										{ x: anchorX, y: anchorY },
										{ x: newCx, y: newCy },
										el.angle,
									);

									const driftX = currentGlobalAnchor.x - globalFixedPoint.x;
									const driftY = currentGlobalAnchor.y - globalFixedPoint.y;

									newPoints = newPoints.map((p) => ({
										x: p.x - driftX,
										y: p.y - driftY,
									}));
								}

								return {
									...el,
									points: newPoints,
									width: Math.max(0.1, newElementWidth),
								};
							}
							return el;
						});

						// PHASE 2: Group Drift Correction
						// If multiple elements, check if the group anchor drifted and correct purely by translation.
						if (!isSingle && selectedElementIds().size > 1) {
							// 1. Calculate new bounds of the group
							let minX = Infinity,
								maxX = -Infinity,
								minY = Infinity,
								maxY = -Infinity;
							nextElements.forEach((el) => {
								if (selectedElementIds().has(el.id)) {
									const b = getRotatedBounds(el);
									if (b.minX < minX) minX = b.minX;
									if (b.maxX > maxX) maxX = b.maxX;
									if (b.minY < minY) minY = b.minY;
									if (b.maxY > maxY) maxY = b.maxY;
								}
							});

							if (minX !== Infinity) {
								// 2. Identify where the anchor IS now
								let currentAnchorX = 0;
								let currentAnchorY = 0;

								// IMPORTANT: Anchor swap logic matches the setup logic
								// If handle is 'w', fixed anchor was 'e' (maxX). So we check maxX.
								if (handle.includes("w")) currentAnchorX = maxX - PAD;
								else if (handle.includes("e")) currentAnchorX = minX + PAD;
								else currentAnchorX = (minX + maxX) / 2;

								if (handle.includes("n")) currentAnchorY = maxY - PAD;
								else if (handle.includes("s")) currentAnchorY = minY + PAD;
								else currentAnchorY = (minY + maxY) / 2;

								// 3. Calculate Drift
								const driftX = currentAnchorX - globalFixedPoint.x;
								const driftY = currentAnchorY - globalFixedPoint.y;

								// 4. Apply Correction
								if (Math.abs(driftX) > 0.01 || Math.abs(driftY) > 0.01) {
									nextElements = nextElements.map((el) => {
										if (selectedElementIds().has(el.id)) {
											return {
												...el,
												points: el.points.map((p) => ({
													x: p.x - driftX,
													y: p.y - driftY,
												})),
											};
										}
										return el;
									});
								}
							}
						}

						setElements(nextElements);
					}
				} else {
					// Moving single or multiple elements
					if (potentialClickId) {
						const dist = Math.hypot(
							pos.x - dragStartPos.x,
							pos.y - dragStartPos.y,
						);
						if (dist > 5) {
							potentialClickId = null;
						}
					}

					const dx = pos.x - dragStartPos.x;
					const dy = pos.y - dragStartPos.y;
					setElements(
						elements().map((el) => {
							if (selectedElementIds().has(el.id)) {
								const state = dragInitialState.get(el.id);
								if (state) {
									return {
										...el,
										points: state.points.map((p) => ({
											x: p.x + dx,
											y: p.y + dy,
										})),
									};
								}
							}
							return el;
						}),
					);
				}
				redraw();
			}
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
			setCurrentTool("select");
			setSelectedElementIds(new Set([id]));
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

		// only edit if exactly one element is selected
		if (selectedElementIds().size !== 1) return;

		const selectedId = Array.from(selectedElementIds())[0];
		if (!selectedId) return;

		const element = elements().find((el) => el.id === selectedId);
		if (!element || element.type !== "text" || !element.text) return;

		setEditingTextId(element.id);
		setEditingTextPos(element.points[0]);
		setEditingTextValue(element.text);
	};

	const stopDrawing = () => {
		if (isCurrentlyDrawing()) {
			if (currentTool() === "select") {
				if (potentialClickId) {
					// We clicked a selected item but didn't drag it significantly.
					// This means the user intended to select JUST this item.
					setSelectedElementIds(new Set<string>([potentialClickId]));
					potentialClickId = null;
					redraw();
				}

				const box = selectionBox();
				if (box) {
					// Finalize box selection
					const minX = Math.min(box.start.x, box.end.x);
					const maxX = Math.max(box.start.x, box.end.x);
					const minY = Math.min(box.start.y, box.end.y);
					const maxY = Math.max(box.start.y, box.end.y);

					const newSelectedIds = new Set(selectedElementIds());
					elements().forEach((el) => {
						const bounds = getElementBounds(el);
						// Simple intersection check: check if element bounds overlap with selection box
						// Or containment? Usually it's containment or intersection. Intersection is friendlier.
						// Let's use intersection.
						// Rect intersection: !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top)
						const intersects = !(
							bounds.minX > maxX ||
							bounds.maxX < minX ||
							bounds.minY > maxY ||
							bounds.maxY < minY
						);

						if (intersects) {
							newSelectedIds.add(el.id);
						}
					});
					setSelectedElementIds(newSelectedIds);
					setSelectionBox(null);
					redraw();
				}
			} else if (currentTool() === "eraser") {
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
						setSelectedElementIds(new Set<string>([activeElement.id]));
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
		setSelectionBox(null);
		potentialClickId = null;
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

		const isSelected = selectedElementIds().has(el.id);
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
				roughness: el.roughness ?? 1.5,
				seed: el.seed,
				strokeLineDash:
					el.strokeStyle === "dashed"
						? [10, 10]
						: el.strokeStyle === "dotted"
							? [3, 6]
							: undefined,
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

		if (isSelected && resizeHandle() !== "rotate") {
			ctx.setLineDash([5, 5]);
			ctx.strokeStyle = "#3b82f6";
			ctx.lineWidth = 2;

			const minX = bounds.minX;
			const maxX = bounds.maxX;
			const minY = bounds.minY - scrollY;
			const maxY = bounds.maxY - scrollY;

			ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);

			if (selectedElementIds().size === 1) {
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

		// Draw group selection box and handles
		if (selectedElementIds().size > 1 && resizeHandle() !== "rotate") {
			const bounds = getCommonBounds(selectedElementIds());
			if (bounds) {
				const scrollY = window.scrollY;
				const minX = bounds.minX;
				const maxX = bounds.maxX;
				const minY = bounds.minY - scrollY;
				const maxY = bounds.maxY - scrollY;

				ctx.save();
				ctx.setLineDash([5, 5]);
				ctx.strokeStyle = "#3b82f6";
				ctx.lineWidth = 2;
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
				ctx.restore();
			}
		}

		const box = selectionBox();
		if (box) {
			const scrollY = window.scrollY;
			ctx.save();
			ctx.strokeStyle = "#00f2ff";
			ctx.lineWidth = 1;
			ctx.setLineDash([5, 5]);
			ctx.fillStyle = "rgba(0, 242, 255, 0.1)";

			const x = Math.min(box.start.x, box.end.x);
			const y = Math.min(box.start.y, box.end.y) - scrollY;
			const w = Math.abs(box.end.x - box.start.x);
			const h = Math.abs(box.end.y - box.start.y);

			ctx.fillRect(x, y, w, h);
			ctx.strokeRect(x, y, w, h);
			ctx.restore();
		}
	};

	const undo = () => {
		if (elements().length > 0) {
			const newElements = elements().slice(0, -1);
			setElements(newElements);
			// validate selection
			const newIds = new Set(newElements.map((e) => e.id));
			const currentSelection = new Set(selectedElementIds());
			let changed = false;
			currentSelection.forEach((id) => {
				if (!newIds.has(id)) {
					currentSelection.delete(id);
					changed = true;
				}
			});
			if (changed) setSelectedElementIds(currentSelection);
			redraw();
		}
	};
	const clearCanvas = () => {
		setElements([]);
		setSelectedElementIds(new Set<string>());
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
			} else if (selectedElementIds().size > 0) {
				setSelectedElementIds(new Set<string>());
				setResizeHandle(null);
				setResizeStartBounds(null);
				redraw();
			}
		}
		if (
			e.shiftKey &&
			(e.key === "Delete" || e.key === "Backspace" || e.key === "Del")
		) {
			const ids = selectedElementIds();
			if (ids.size > 0 && !editingTextId()) {
				e.preventDefault();
				setElements(elements().filter((el) => !ids.has(el.id)));
				setSelectedElementIds(new Set<string>());
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

			<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-9000 flex items-center gap-6 bg-black border border-white/10 p-3 rounded-sm shadow-2xl">
				<button
					type="button"
					onClick={() => setIsDrawingMode(!isDrawingMode())}
					class={`px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all ${isDrawingMode() ? "bg-white text-black" : "text-zinc-600 hover:text-white"}`}
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
										if (selectedElementIds().size > 0) {
											setElements(
												elements().map((el) =>
													selectedElementIds().has(el.id)
														? { ...el, color }
														: el,
												),
											);
											redraw();
										} else if (
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
					<div class="flex flex-col gap-2">
						<div class="flex items-center gap-2">
							<span class="text-[8px] text-zinc-500 uppercase w-8">Width</span>
							<input
								type="range"
								min="1"
								max="20"
								value={currentWidth()}
								onInput={(e) => {
									const val = Number(e.currentTarget.value);
									setCurrentWidth(val);
									if (selectedElementIds().size > 0) {
										setElements(
											elements().map((el) =>
												selectedElementIds().has(el.id)
													? { ...el, width: val }
													: el,
											),
										);
										redraw();
									}
								}}
								class="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
							/>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-[8px] text-zinc-500 uppercase w-8">Rough</span>
							<input
								type="range"
								min="0"
								max="3"
								step="0.5"
								value={currentRoughness()}
								onInput={(e) => {
									const val = Number(e.currentTarget.value);
									setCurrentRoughness(val);
									if (selectedElementIds().size > 0) {
										setElements(
											elements().map((el) =>
												selectedElementIds().has(el.id)
													? { ...el, roughness: val }
													: el,
											),
										);
										redraw();
									}
								}}
								class="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
							/>
						</div>
					</div>
					<div class="w-px h-6 bg-white/10" />
					<div class="flex flex-col justify-center gap-1">
						<For each={strokeStyles}>
							{(style) => (
								<button
									type="button"
									onClick={() => {
										setCurrentStrokeStyle(style);
										if (selectedElementIds().size > 0) {
											setElements(
												elements().map((el) =>
													selectedElementIds().has(el.id)
														? { ...el, strokeStyle: style }
														: el,
												),
											);
											redraw();
										}
									}}
									class={`px-1.5 py-0.5 text-[8px] uppercase rounded border border-white/10 ${
										currentStrokeStyle() === style
											? "bg-white text-black"
											: "text-zinc-500 hover:text-white"
									}`}
								>
									{style}
								</button>
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
