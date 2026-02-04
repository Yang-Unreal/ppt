import { getStroke } from "perfect-freehand";
import rough from "roughjs";
import {
	createSignal,
	For,
	type JSX,
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
	fillStyle?: "solid" | "hachure" | "cross-hatch" | "dots";
	strokeWidth?: number;
	opacity?: number;
	startBinding?: { elementId: string; focus: number; gap: number };
	endBinding?: { elementId: string; focus: number; gap: number };
}

interface DragState {
	points: Point[];
	angle: number;
	globalAnchor?: Point;
	dragStartWorldPos?: Point;
	worldPointsAtStart?: Point[];
	groupCenter?: Point;
	initialSelectionBox?: SelectionBox;
}

interface SelectionBox {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
	angle: number;
	cx: number;
	cy: number;
}

const CONSTANTS = {
	ERASER_SIZE: 20,
	HANDLE_SIZE: 10,
	ROTATION_HANDLE_OFFSET: 30,
	FONT_SIZE_MULTIPLIER: 2,
	LINE_HEIGHT: 1.2,
	TEXT_BASELINE_OFFSET: 0.8,
	SELECTION_PADDING: 10,
	MARKER_WIDTH: 4,
};

// --- Helper Functions ---

const distance = (a: Point, b: Point) =>
	Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const getBoundsFromPoints = (points: Point[]) => {
	const xList = points.map((p) => p.x);
	const yList = points.map((p) => p.y);
	if (xList.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
	return {
		minX: Math.min(...xList),
		minY: Math.min(...yList),
		maxX: Math.max(...xList),
		maxY: Math.max(...yList),
	};
};

const getElementBounds = (element: Element) =>
	getBoundsFromPoints(element.points);

const hitTest = (pos: Point, elements: Element[]): string | null => {
	for (let i = elements.length - 1; i >= 0; i--) {
		const el = elements[i];
		const bounds = getElementBounds(el);
		if (
			pos.x >= bounds.minX - 10 &&
			pos.x <= bounds.maxX + 10 &&
			pos.y >= bounds.minY - 10 &&
			pos.y <= bounds.maxY + 10
		) {
			return el.id;
		}
	}
	return null;
};

const getCollectiveBounds = (els: Element[]) => {
	if (els.length === 0) return null;
	let minX = Infinity,
		minY = Infinity,
		maxX = -Infinity,
		maxY = -Infinity;
	els.forEach((el) => {
		const b = getElementBounds(el);
		const cx = (b.minX + b.maxX) / 2;
		const cy = (b.minY + b.maxY) / 2;
		const corners = [
			{ x: b.minX, y: b.minY },
			{ x: b.maxX, y: b.minY },
			{ x: b.minX, y: b.maxY },
			{ x: b.maxX, y: b.maxY },
		];
		corners.forEach((p) => {
			const r = rotatePoint(p, { x: cx, y: cy }, el.angle);
			minX = Math.min(minX, r.x);
			minY = Math.min(minY, r.y);
			maxX = Math.max(maxX, r.x);
			maxY = Math.max(maxY, r.y);
		});
	});
	return { minX, minY, maxX, maxY };
};

const rotatePoint = (p: Point, center: Point, angle: number) => {
	return {
		x:
			(p.x - center.x) * Math.cos(angle) -
			(p.y - center.y) * Math.sin(angle) +
			center.x,
		y:
			(p.x - center.x) * Math.sin(angle) +
			(p.y - center.y) * Math.cos(angle) +
			center.y,
	};
};

// --- Component ---

export default function PresentationMarker(props: { children?: JSX.Element }) {
	let mainCanvasRef: HTMLCanvasElement | undefined;
	let tempCanvasRef: HTMLCanvasElement | undefined;
	let containerRef: HTMLDivElement | undefined;

	const [view, setView] = createSignal({ x: 0, y: 0, z: 1 });
	const [isPanning, setIsPanning] = createSignal(false);
	const [isDrawingMode, setIsDrawingMode] = createSignal(false);

	// Tools State
	const [currentTool, setCurrentTool] = createSignal<ElementType>("marker");
	const [currentColor, setCurrentColor] = createSignal("#ff4444");
	const [currentWidth, setCurrentWidth] = createSignal(4);
	const [currentOpacity, setCurrentOpacity] = createSignal(100);
	const [currentStrokeStyle, setCurrentStrokeStyle] =
		createSignal<StrokeStyle>("solid");
	const [currentRoughness, setCurrentRoughness] = createSignal(1);

	const [elements, setElements] = createSignal<Element[]>([]);
	const [selectedElementIds, setSelectedElementIds] = createSignal(
		new Set<string>(),
	);

	// Interaction State
	const [isCurrentlyDrawing, setIsCurrentlyDrawing] = createSignal(false);
	const [interactionType, setInteractionType] = createSignal<
		"none" | "draw" | "move" | "resize" | "rotate" | "selection"
	>("none");
	const [selectionEnd, setSelectionEnd] = createSignal<Point | null>(null);
	const [selectionRotation, setSelectionRotation] = createSignal(0);
	const [resizeHandle, setResizeHandle] = createSignal<string | null>(null);
	const [activeMenu, setActiveMenu] = createSignal<string | null>(null);

	let activeElement: Element | null = null;
	let dragStartPos: Point | null = null;
	let lastMousePos: Point | null = null;
	const dragInitialState = new Map<string, DragState>();

	// --- Infinite Canvas Logic ---

	const screenToWorld = (sx: number, sy: number) => {
		const v = view();
		return {
			x: (sx - v.x) / v.z,
			y: (sy - v.y) / v.z,
		};
	};

	const handleWheel = (e: WheelEvent) => {
		e.preventDefault();
		const v = view();

		if (e.ctrlKey || e.metaKey) {
			const delta = e.deltaY;
			const scaleFactor = Math.exp(-delta * 0.001);
			const newZ = Math.max(0.1, Math.min(5, v.z * scaleFactor));

			const rect = containerRef?.getBoundingClientRect();
			if (!rect) return;
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			const wx = (mouseX - v.x) / v.z;
			const wy = (mouseY - v.y) / v.z;

			const newX = mouseX - wx * newZ;
			const newY = mouseY - wy * newZ;

			setView({ x: newX, y: newY, z: newZ });
		} else {
			setView((prev) => ({
				...prev,
				x: prev.x - e.deltaX,
				y: prev.y - e.deltaY,
			}));
		}
		redraw();
	};

	const getSelectionBox = (): SelectionBox | null => {
		const selected = elements().filter((el) => selectedElementIds().has(el.id));
		if (selected.length === 0) return null;

		if (selected.length === 1) {
			const el = selected[0];
			const b = getElementBounds(el);
			return {
				minX: b.minX,
				minY: b.minY,
				maxX: b.maxX,
				maxY: b.maxY,
				angle: el.angle,
				cx: (b.minX + b.maxX) / 2,
				cy: (b.minY + b.maxY) / 2,
			};
		}

		const angle = selectionRotation();
		// STABLE CENTER: Centroid of all elements' centers
		let cx = 0;
		let cy = 0;
		selected.forEach((el) => {
			const b = getElementBounds(el);
			cx += (b.minX + b.maxX) / 2;
			cy += (b.minY + b.maxY) / 2;
		});
		cx /= selected.length;
		cy /= selected.length;

		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		selected.forEach((el) => {
			const elBounds = getElementBounds(el);
			const elCx = (elBounds.minX + elBounds.maxX) / 2;
			const elCy = (elBounds.minY + elBounds.maxY) / 2;
			const corners = [
				{ x: elBounds.minX, y: elBounds.minY },
				{ x: elBounds.maxX, y: elBounds.minY },
				{ x: elBounds.minX, y: elBounds.maxY },
				{ x: elBounds.maxX, y: elBounds.maxY },
			].map((p) => rotatePoint(p, { x: elCx, y: elCy }, el.angle));

			corners.forEach((p) => {
				const lp = rotatePoint(p, { x: cx, y: cy }, -angle);
				minX = Math.min(minX, lp.x);
				minY = Math.min(minY, lp.y);
				maxX = Math.max(maxX, lp.x);
				maxY = Math.max(maxY, lp.y);
			});
		});

		return {
			minX,
			minY,
			maxX,
			maxY,
			angle,
			cx,
			cy,
		};
	};

	const getHandleAtPosition = (
		pos: Point,
	): { handle: string; box: SelectionBox } | null => {
		const v = view();
		const pad = 10 / v.z;
		const box = getSelectionBox();
		if (!box) return null;

		const { minX, minY, maxX, maxY, angle, cx, cy } = box;
		const handles = [
			{ x: minX, y: minY, name: "nw" },
			{ x: maxX, y: minY, name: "ne" },
			{ x: minX, y: maxY, name: "sw" },
			{ x: maxX, y: maxY, name: "se" },
			{
				x: cx,
				y: minY - CONSTANTS.ROTATION_HANDLE_OFFSET / v.z,
				name: "rotate",
			},
		];

		for (const h of handles) {
			const rotatedH = rotatePoint(h, { x: cx, y: cy }, angle);
			if (distance(pos, rotatedH) < pad) {
				return { handle: h.name, box };
			}
		}
		return null;
	};

	const handleMouseDown = (e: MouseEvent | TouchEvent) => {
		let clientX: number, clientY: number;
		if ("touches" in e) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = (e as MouseEvent).clientX;
			clientY = (e as MouseEvent).clientY;
		}

		const rect = containerRef?.getBoundingClientRect();
		if (!rect) return;
		const mx = clientX - rect.left;
		const my = clientY - rect.top;
		const worldPos = screenToWorld(mx, my);

		if (
			("button" in e && e.button === 1) ||
			e.shiftKey ||
			(!isDrawingMode() && !e.ctrlKey)
		) {
			setIsPanning(true);
			lastMousePos = { x: mx, y: my };
			return;
		}

		if (!isDrawingMode()) return;

		dragStartPos = worldPos;

		if (currentTool() === "select") {
			const handleHit = getHandleAtPosition(worldPos);
			if (handleHit) {
				const { handle, box } = handleHit;
				setInteractionType(handle === "rotate" ? "rotate" : "resize");
				setResizeHandle(handle);

				selectedElementIds().forEach((id) => {
					const el = elements().find((e) => e.id === id);
					if (el) {
						const b = getElementBounds(el);
						const cx_el = (b.minX + b.maxX) / 2;
						const cy_el = (b.minY + b.maxY) / 2;

						let localAnchor = { x: 0, y: 0 };
						if (handle === "nw") localAnchor = { x: box.maxX, y: box.maxY };
						if (handle === "se") localAnchor = { x: box.minX, y: box.minY };
						if (handle === "ne") localAnchor = { x: box.minX, y: box.maxY };
						if (handle === "sw") localAnchor = { x: box.maxX, y: box.minY };

						const globalAnchor = rotatePoint(
							localAnchor,
							{ x: box.cx, y: box.cy },
							box.angle,
						);

						const worldPointsAtStart = el.points.map((p) =>
							rotatePoint(p, { x: cx_el, y: cy_el }, el.angle),
						);

						dragInitialState.set(id, {
							points: el.points.map((p) => ({ ...p })),
							angle: el.angle,
							globalAnchor, // group anchor
							dragStartWorldPos: worldPos,
							worldPointsAtStart,
							groupCenter: { x: box.cx, y: box.cy },
							initialSelectionBox: box,
						});
					}
				});
			} else {
				const hitId = hitTest(worldPos, elements());
				if (hitId) {
					setInteractionType("move");
					if (!selectedElementIds().has(hitId)) {
						setSelectedElementIds(new Set([hitId]));
						setSelectionRotation(0);
					}
					selectedElementIds().forEach((id) => {
						const el = elements().find((e) => e.id === id);
						if (el) {
							dragInitialState.set(id, {
								points: el.points.map((p) => ({ ...p })),
								angle: el.angle,
							});
						}
					});
				} else {
					setSelectedElementIds(new Set<string>());
					setSelectionRotation(0);
					setInteractionType("selection");
					setSelectionEnd(worldPos);
				}
			}
			setIsCurrentlyDrawing(true);
			redraw();
		} else if (currentTool() === "eraser") {
			const hitId = hitTest(worldPos, elements());
			if (hitId) {
				setElements(elements().filter((el) => el.id !== hitId));
				redraw();
			}
		} else if (currentTool() === "marker") {
			setInteractionType("draw");
			setIsCurrentlyDrawing(true);
			activeElement = {
				id: Math.random().toString(36).substr(2, 9),
				type: "marker",
				points: [worldPos],
				color: currentColor(),
				width: currentWidth(),
				seed: Math.floor(Math.random() * 2 ** 31),
				angle: 0,
				opacity: currentOpacity(),
				roughness: currentRoughness(),
				strokeStyle: currentStrokeStyle(),
			};
		} else if (["rectangle", "ellipse", "arrow"].includes(currentTool())) {
			setInteractionType("draw");
			setIsCurrentlyDrawing(true);
			activeElement = {
				id: Math.random().toString(36).substr(2, 9),
				type: currentTool(),
				points: [worldPos, worldPos],
				color: currentColor(),
				width: currentWidth(),
				seed: Math.floor(Math.random() * 2 ** 31),
				angle: 0,
				opacity: currentOpacity(),
				roughness: currentRoughness(),
				strokeStyle: currentStrokeStyle(),
			};
		}
	};

	const handleMouseMove = (e: MouseEvent | TouchEvent) => {
		let clientX: number, clientY: number;
		if ("touches" in e) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = (e as MouseEvent).clientX;
			clientY = (e as MouseEvent).clientY;
		}
		const rect = containerRef?.getBoundingClientRect();
		if (!rect) return;
		const mx = clientX - rect.left;
		const my = clientY - rect.top;
		const worldPos = screenToWorld(mx, my);

		if (isPanning() && lastMousePos) {
			const dx = mx - lastMousePos.x;
			const dy = my - lastMousePos.y;
			setView((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
			lastMousePos = { x: mx, y: my };
			redraw();
			return;
		}

		if (
			isDrawingMode() &&
			currentTool() === "eraser" &&
			(e as MouseEvent).buttons === 1
		) {
			const hitId = hitTest(worldPos, elements());
			if (hitId) {
				setElements(elements().filter((el) => el.id !== hitId));
				redraw();
			}
			return;
		}

		if (isCurrentlyDrawing()) {
			if (interactionType() === "move" && dragStartPos) {
				const dx = worldPos.x - dragStartPos.x;
				const dy = worldPos.y - dragStartPos.y;
				setElements(
					elements().map((el) => {
						const state = dragInitialState.get(el.id);
						if (state) {
							return {
								...el,
								points: state.points.map((p: Point) => ({
									x: p.x + dx,
									y: p.y + dy,
								})),
							};
						}
						return el;
					}),
				);
				redraw();
			} else if (interactionType() === "rotate" && dragStartPos) {
				const firstId = Array.from(selectedElementIds())[0];
				const firstState = dragInitialState.get(firstId);
				const box = firstState?.initialSelectionBox;

				if (box) {
					const startAngle = Math.atan2(
						dragStartPos.y - box.cy,
						dragStartPos.x - box.cx,
					);
					const currentAngle = Math.atan2(
						worldPos.y - box.cy,
						worldPos.x - box.cx,
					);
					const deltaAngle = currentAngle - startAngle;
					const finalGroupAngle = box.angle + deltaAngle;

					if (selectedElementIds().size > 1) {
						setSelectionRotation(finalGroupAngle);
					}

					setElements(
						elements().map((el) => {
							const state = dragInitialState.get(el.id);
							if (state && state.worldPointsAtStart && state.groupCenter) {
								// 1. Rotate whole element world-points around the group center
								const finalPointsWorld = state.worldPointsAtStart.map((p) =>
									rotatePoint(p, state.groupCenter as Point, deltaAngle),
								);

								// 2. We need to store points back in the element's local model space (axis-aligned around its own center)
								// The current angle is el.angle + deltaAngle.
								const currentAngle = state.angle + deltaAngle;
								const bUntilted = getBoundsFromPoints(
									finalPointsWorld.map((p) =>
										rotatePoint(p, { x: 0, y: 0 }, -currentAngle),
									),
								);
								const cx_new = (bUntilted.minX + bUntilted.maxX) / 2;
								const cy_new = (bUntilted.minY + bUntilted.maxY) / 2;
								const center_new = rotatePoint(
									{ x: cx_new, y: cy_new },
									{ x: 0, y: 0 },
									currentAngle,
								);
								const finalPoints = finalPointsWorld.map((p) =>
									rotatePoint(p, center_new, -currentAngle),
								);

								return {
									...el,
									points: finalPoints,
									angle: currentAngle,
								};
							}
							return el;
						}),
					);
				}
				redraw();
			} else if (
				interactionType() === "resize" &&
				dragStartPos &&
				resizeHandle()
			) {
				const firstId = Array.from(selectedElementIds())[0];
				const firstState = dragInitialState.get(firstId);
				const box = firstState?.initialSelectionBox;

				if (box) {
					setElements(
						elements().map((el) => {
							const state = dragInitialState.get(el.id);
							if (
								state?.globalAnchor &&
								state.dragStartWorldPos &&
								state.worldPointsAtStart
							) {
								const anchor = state.globalAnchor;
								const angle = box.angle;

								// 1. Mouse relative to anchor
								const mouseRel = {
									x: worldPos.x - anchor.x,
									y: worldPos.y - anchor.y,
								};
								const mouseLocal = rotatePoint(
									mouseRel,
									{ x: 0, y: 0 },
									-angle,
								);

								// 2. Start handle relative to anchor in local space
								const handleRel = {
									x: state.dragStartWorldPos.x - anchor.x,
									y: state.dragStartWorldPos.y - anchor.y,
								};
								const handleLocal = rotatePoint(
									handleRel,
									{ x: 0, y: 0 },
									-angle,
								);

								// 3. Scale factors
								const scaleX =
									handleLocal.x === 0 ? 1 : mouseLocal.x / handleLocal.x;
								const scaleY =
									handleLocal.y === 0 ? 1 : mouseLocal.y / handleLocal.y;

								// 4. Scale points relative to anchor (which is 0,0 in this space)
								const scaledPointsWorld = state.worldPointsAtStart.map(
									(p: Point) => {
										const pRel = { x: p.x - anchor.x, y: p.y - anchor.y };
										const pLocal = rotatePoint(pRel, { x: 0, y: 0 }, -angle);
										const pScaled = {
											x: pLocal.x * scaleX,
											y: pLocal.y * scaleY,
										};
										const pRotated = rotatePoint(
											pScaled,
											{ x: 0, y: 0 },
											angle,
										);
										return {
											x: pRotated.x + anchor.x,
											y: pRotated.y + anchor.y,
										};
									},
								);

								// 5. Calculate new center in world space to revert to local model space
								const bUntilted = getBoundsFromPoints(
									scaledPointsWorld.map((p) =>
										rotatePoint(p, { x: 0, y: 0 }, -state.angle),
									),
								);
								const cx_new = (bUntilted.minX + bUntilted.maxX) / 2;
								const cy_new = (bUntilted.minY + bUntilted.maxY) / 2;
								const center_new = rotatePoint(
									{ x: cx_new, y: cy_new },
									{ x: 0, y: 0 },
									state.angle,
								);
								const finalPoints = scaledPointsWorld.map((p) =>
									rotatePoint(p, center_new, -state.angle),
								);

								return { ...el, points: finalPoints };
							}
							return el;
						}),
					);
				}
				redraw();
			} else if (interactionType() === "draw" && activeElement) {
				if (activeElement.type === "marker") {
					activeElement.points.push(worldPos);
				} else {
					activeElement.points[1] = worldPos;
				}
				updateTempCanvas();
			} else if (interactionType() === "selection") {
				setSelectionEnd(worldPos);
				updateTempCanvas();
			}
		}
	};

	const handleMouseUp = () => {
		if (isPanning()) {
			setIsPanning(false);
			lastMousePos = null;
			return;
		}

		if (isCurrentlyDrawing()) {
			if (interactionType() === "draw" && activeElement) {
				const el = activeElement;
				let isValid = false;
				if (el.type === "marker") {
					const startPoint = el.points[0];
					isValid =
						el.points.length > 1 &&
						el.points.some((p) => distance(p, startPoint) > 2);
				} else if (["rectangle", "ellipse"].includes(el.type)) {
					const p1 = el.points[0];
					const p2 = el.points[1];
					// Ensure shapes have a minimum width and height
					isValid = Math.abs(p2.x - p1.x) > 5 && Math.abs(p2.y - p1.y) > 5;
				} else if (el.type === "arrow") {
					const p1 = el.points[0];
					const p2 = el.points[1];
					// Ensure arrows have a minimum length
					isValid = distance(p1, p2) > 15;
				}

				if (isValid) {
					setElements([...elements(), el]);
					// Auto-switch to selection tool for shapes and arrows
					if (["rectangle", "ellipse", "arrow"].includes(el.type)) {
						setCurrentTool("select");
						setSelectedElementIds(new Set([el.id]));
					}
				}
				activeElement = null;
			}
			if (tempCanvasRef) {
				const ctx = tempCanvasRef.getContext("2d");
				ctx?.clearRect(0, 0, tempCanvasRef.width, tempCanvasRef.height);
			}
			setIsCurrentlyDrawing(false);
			const currentSelectionEnd = selectionEnd();
			if (
				interactionType() === "selection" &&
				dragStartPos &&
				currentSelectionEnd
			) {
				const end = currentSelectionEnd;
				const minX = Math.min(dragStartPos.x, end.x);
				const maxX = Math.max(dragStartPos.x, end.x);
				const minY = Math.min(dragStartPos.y, end.y);
				const maxY = Math.max(dragStartPos.y, end.y);

				const hitIds = new Set<string>();
				elements().forEach((el) => {
					const b = getElementBounds(el);
					// Check if element's bounding box intersects with selection box
					if (
						b.minX <= maxX &&
						b.maxX >= minX &&
						b.minY <= maxY &&
						b.maxY >= minY
					) {
						hitIds.add(el.id);
					}
				});
				setSelectedElementIds(hitIds);
				setSelectionEnd(null);
			}
			setInteractionType("none");
			setResizeHandle(null);
			dragInitialState.clear();
			redraw();
		}
	};

	// --- Rendering ---

	const redraw = () => {
		if (!mainCanvasRef) return;
		const ctx = mainCanvasRef.getContext("2d");
		if (!ctx) return;
		const rc = rough.canvas(mainCanvasRef);
		const v = view();

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, mainCanvasRef.width, mainCanvasRef.height);

		ctx.translate(v.x, v.y);
		ctx.scale(v.z, v.z);

		elements().forEach((el) => {
			renderElement(ctx, rc, el);
		});

		// Draw Selection UI
		const box = getSelectionBox();
		if (box) {
			const { minX, minY, maxX, maxY, angle, cx, cy } = box;
			ctx.save();
			ctx.translate(cx, cy);
			ctx.rotate(angle);
			ctx.translate(-cx, -cy);

			ctx.strokeStyle = "#3b82f6";
			ctx.lineWidth = 2 / v.z;
			ctx.setLineDash([5 / v.z, 5 / v.z]);
			ctx.strokeRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);

			// Handles
			ctx.setLineDash([]);
			ctx.fillStyle = "white";
			const s = CONSTANTS.HANDLE_SIZE / v.z;
			const drawHandle = (x: number, y: number) => {
				ctx.fillRect(x - s / 2, y - s / 2, s, s);
				ctx.strokeRect(x - s / 2, y - s / 2, s, s);
			};
			drawHandle(minX, minY);
			drawHandle(maxX, minY);
			drawHandle(minX, maxY);
			drawHandle(maxX, maxY);
			// Rotation
			const rx = cx;
			const ry = minY - CONSTANTS.ROTATION_HANDLE_OFFSET / v.z;
			ctx.beginPath();
			ctx.moveTo(cx, minY);
			ctx.lineTo(rx, ry);
			ctx.stroke();
			drawHandle(rx, ry);
			ctx.restore();
		}

		ctx.restore();
	};

	const updateTempCanvas = () => {
		if (!tempCanvasRef) return;
		const ctx = tempCanvasRef.getContext("2d");
		if (!ctx) return;
		const rc = rough.canvas(tempCanvasRef);
		const v = view();

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, tempCanvasRef.width, tempCanvasRef.height);

		ctx.translate(v.x, v.y);
		ctx.scale(v.z, v.z);

		if (activeElement) {
			renderElement(ctx, rc, activeElement);
		}

		const end = selectionEnd();
		if (interactionType() === "selection" && dragStartPos && end) {
			drawSelectionBox(ctx, dragStartPos, end);
		}

		ctx.restore();
	};

	const drawSelectionBox = (
		ctx: CanvasRenderingContext2D,
		start: Point,
		end: Point,
	) => {
		const v = view();
		ctx.save();
		ctx.strokeStyle = "#3b82f6";
		ctx.lineWidth = 1 / v.z;
		ctx.setLineDash([5 / v.z, 5 / v.z]);
		const x = Math.min(start.x, end.x);
		const y = Math.min(start.y, end.y);
		const w = Math.abs(end.x - start.x);
		const h = Math.abs(end.y - start.y);
		ctx.strokeRect(x, y, w, h);

		ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
		ctx.fillRect(x, y, w, h);
		ctx.restore();
	};

	const renderElement = (
		ctx: CanvasRenderingContext2D,
		rc: ReturnType<typeof rough.canvas>,
		el: Element,
	) => {
		ctx.save();
		const b = getElementBounds(el);
		const cx = (b.minX + b.maxX) / 2;
		const cy = (b.minY + b.maxY) / 2;
		ctx.translate(cx, cy);
		ctx.rotate(el.angle);
		ctx.translate(-cx, -cy);

		if (el.type === "marker") {
			if (el.points.length < 2) return;
			const pts = el.points.map((p) => [p.x, p.y]);
			const stroke = getStroke(pts, { size: el.width });
			if (stroke.length > 0) {
				ctx.beginPath();
				ctx.fillStyle = el.color;
				ctx.moveTo(stroke[0][0], stroke[0][1]);
				for (let i = 1; i < stroke.length; i++)
					ctx.lineTo(stroke[i][0], stroke[i][1]);
				ctx.closePath();
				ctx.fill();
			}
		} else if (el.type === "rectangle") {
			const [p1, p2] = el.points;
			rc.rectangle(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y, {
				stroke: el.color,
				strokeWidth: el.width,
				roughness: el.roughness,
				seed: el.seed,
			});
		} else if (el.type === "ellipse") {
			const [p1, p2] = el.points;
			const w = Math.abs(p2.x - p1.x);
			const h = Math.abs(p2.y - p1.y);
			rc.ellipse((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, w, h, {
				stroke: el.color,
				strokeWidth: el.width,
				roughness: el.roughness,
				seed: el.seed,
			});
		} else if (el.type === "arrow") {
			const [p1, p2] = el.points;
			rc.line(p1.x, p1.y, p2.x, p2.y, {
				stroke: el.color,
				strokeWidth: el.width,
				roughness: el.roughness,
				seed: el.seed,
			});
			const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
			const headLen = 20;
			rc.line(
				p2.x,
				p2.y,
				p2.x - headLen * Math.cos(angle - Math.PI / 6),
				p2.y - headLen * Math.sin(angle - Math.PI / 6),
				{
					stroke: el.color,
					strokeWidth: el.width,
					roughness: el.roughness,
					seed: el.seed,
				},
			);
			rc.line(
				p2.x,
				p2.y,
				p2.x - headLen * Math.cos(angle + Math.PI / 6),
				p2.y - headLen * Math.sin(angle + Math.PI / 6),
				{
					stroke: el.color,
					strokeWidth: el.width,
					roughness: el.roughness,
					seed: el.seed,
				},
			);
		}
		ctx.restore();
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Backspace" || e.key === "Delete") {
			const selected = selectedElementIds();
			if (selected.size > 0) {
				e.preventDefault();
				setElements(elements().filter((el) => !selected.has(el.id)));
				setSelectedElementIds(new Set<string>());
				redraw();
			}
		}
	};

	onMount(() => {
		const resize = () => {
			if (mainCanvasRef) {
				mainCanvasRef.width = window.innerWidth;
				mainCanvasRef.height = window.innerHeight;
			}
			if (tempCanvasRef) {
				tempCanvasRef.width = window.innerWidth;
				tempCanvasRef.height = window.innerHeight;
			}
			redraw();
		};
		window.addEventListener("resize", resize);
		window.addEventListener("keydown", handleKeyDown);
		resize();
		onCleanup(() => {
			window.removeEventListener("resize", resize);
			window.removeEventListener("keydown", handleKeyDown);
		});
	});

	const tools: ElementType[] = [
		"select",
		"marker",
		"rectangle",
		"ellipse",
		"arrow",
		"eraser",
	];

	const strokeStyles: StrokeStyle[] = ["solid", "dashed", "dotted"];

	const undo = () => {
		if (elements().length > 0) {
			const newElements = elements().slice(0, -1);
			setElements(newElements);
			redraw();
		}
	};

	const clearCanvas = () => {
		setElements([]);
		redraw();
	};

	const resetZoom = () => {
		setView({ x: 0, y: 0, z: 1 });
		redraw();
	};

	return (
		<div
			ref={containerRef}
			class="fixed inset-0 overflow-hidden bg-white select-none"
			tabindex="0"
			role="application"
			onWheel={handleWheel}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onTouchStart={handleMouseDown}
			onTouchMove={handleMouseMove}
			onTouchEnd={handleMouseUp}
		>
			<div
				style={{
					transform: `translate(${view().x}px, ${view().y}px) scale(${view().z})`,
					"transform-origin": "0 0",
					width: "100%",
					"min-height": "100vh",
				}}
			>
				{props.children}
			</div>

			<canvas
				ref={mainCanvasRef}
				class="fixed inset-0 pointer-events-none z-10"
			/>
			<canvas
				ref={tempCanvasRef}
				class="fixed inset-0 pointer-events-none z-11"
			/>

			<fieldset
				class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
				onMouseDown={(e) => e.stopPropagation()}
				onWheel={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					onClick={resetZoom}
					class="px-2 py-1 bg-black text-white text-[10px] font-mono rounded border border-white/10 hover:bg-zinc-900 transition-colors shadow-xl"
					title="Reset Zoom"
				>
					{Math.round(view().z * 100)}%
				</button>
				<Show when={!isDrawingMode()}>
					<button
						type="button"
						onClick={() => setIsDrawingMode(true)}
						class="w-12 h-12 bg-black border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-zinc-900 shadow-2xl transition-transform hover:scale-105"
						title="Open Presentation Tools"
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<title>Open Presentation Tools</title>
							<line x1="3" y1="12" x2="21" y2="12" />
							<line x1="3" y1="6" x2="21" y2="6" />
							<line x1="3" y1="18" x2="21" y2="18" />
						</svg>
					</button>
				</Show>

				<Show when={isDrawingMode()}>
					<div class="flex items-center h-12 bg-black border border-white/10 px-2 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-2">
						{/* Close Button */}
						<button
							type="button"
							onClick={() => setIsDrawingMode(false)}
							class="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
							title="Hide Tools"
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>

						<div class="w-px h-4 bg-white/10 mx-1" />

						{/* Tools */}
						<div class="flex gap-0.5">
							<For each={tools}>
								{(tool) => (
									<button
										type="button"
										onClick={() => setCurrentTool(tool)}
										class={`h-8 px-2.5 rounded-full text-[9px] uppercase font-bold transition-all ${
											currentTool() === tool
												? "bg-[#d3fd50] text-black"
												: "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
										}`}
									>
										{tool}
									</button>
								)}
							</For>
						</div>

						<div class="w-px h-4 bg-white/10 mx-1" />

						{/* Color Button with Popover */}
						<div class="relative">
							<button
								type="button"
								onClick={() =>
									setActiveMenu(activeMenu() === "color" ? null : "color")
								}
								class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 relative"
								title="Color Picker"
							>
								<div
									class="w-4 h-4 rounded-full border border-white/20"
									style={{ "background-color": currentColor() }}
								/>
							</button>
							<Show when={activeMenu() === "color"}>
								<div class="absolute bottom-14 right-0 bg-zinc-900 border border-white/10 p-3 rounded-xl shadow-2xl min-w-[124px] grid grid-cols-5 gap-2">
									<For
										each={[
											"#ff4444",
											"#44ff44",
											"#4444ff",
											"#00f2ff",
											"#ffff44",
											"#ff00ff",
											"#000000",
											"#ffffff",
											"#808080",
											"#ffa500",
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
													) {
														setCurrentTool("marker");
													}
													setActiveMenu(null);
												}}
												class={`w-5 h-5 rounded-full border transition-transform hover:scale-110 ${currentColor() === color ? "border-white" : "border-transparent"}`}
												style={{ "background-color": color }}
											/>
										)}
									</For>
									<div class="col-span-1 flex items-center justify-center">
										<input
											type="color"
											value={currentColor()}
											onInput={(e) => {
												const color = e.currentTarget.value;
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
												}
											}}
											class="w-5 h-5 rounded overflow-hidden cursor-pointer border-none p-0 bg-transparent"
										/>
									</div>
								</div>
							</Show>
						</div>

						{/* Settings/Sliders Button with Popover */}
						<div class="relative">
							<button
								type="button"
								onClick={() =>
									setActiveMenu(activeMenu() === "settings" ? null : "settings")
								}
								class={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors ${activeMenu() === "settings" ? "text-white" : "text-zinc-500"}`}
								title="Settings"
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<title>Settings</title>
									<circle cx="12" cy="12" r="3" />
									<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
								</svg>
							</button>
							<Show when={activeMenu() === "settings"}>
								<div class="absolute bottom-14 right-0 bg-zinc-900 border border-white/10 p-4 rounded-xl shadow-2xl min-w-[200px] flex flex-col gap-4">
									{/* Size Slider */}
									<div class="flex flex-col gap-1.5">
										<div class="flex justify-between items-center">
											<span class="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">
												Size
											</span>
											<span class="text-[9px] text-zinc-400 font-mono">
												{currentWidth()}px
											</span>
										</div>
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
											class="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#d3fd50]"
										/>
									</div>
									{/* Roughness Slider */}
									<div class="flex flex-col gap-1.5">
										<div class="flex justify-between items-center">
											<span class="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">
												Rough
											</span>
											<span class="text-[9px] text-zinc-400 font-mono">
												{currentRoughness()}
											</span>
										</div>
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
											class="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#d3fd50]"
										/>
									</div>
									{/* Opacity Slider */}
									<div class="flex flex-col gap-1.5">
										<div class="flex justify-between items-center">
											<span class="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">
												Opac
											</span>
											<span class="text-[9px] text-zinc-400 font-mono">
												{currentOpacity()}%
											</span>
										</div>
										<input
											type="range"
											min="10"
											max="100"
											step="10"
											value={currentOpacity()}
											onInput={(e) => {
												const val = Number(e.currentTarget.value);
												setCurrentOpacity(val);
												if (selectedElementIds().size > 0) {
													setElements(
														elements().map((el) =>
															selectedElementIds().has(el.id)
																? { ...el, opacity: val }
																: el,
														),
													);
													redraw();
												}
											}}
											class="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#d3fd50]"
										/>
									</div>

									<div class="h-px bg-white/5" />

									{/* Stroke Styles */}
									<div class="flex gap-1.5">
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
													class={`flex-1 py-1.5 text-[8px] uppercase font-bold rounded-lg border transition-all ${
														currentStrokeStyle() === style
															? "bg-white text-black border-white"
															: "text-zinc-500 border-white/10 hover:border-white/30 hover:text-white"
													}`}
												>
													{style}
												</button>
											)}
										</For>
									</div>
								</div>
							</Show>
						</div>

						<div class="w-px h-4 bg-white/10 mx-1" />

						{/* History Tools */}
						<div class="flex items-center">
							<button
								type="button"
								onClick={undo}
								class="h-8 px-3 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors"
								title="Undo"
							>
								Undo
							</button>
							<button
								type="button"
								onClick={clearCanvas}
								class="h-8 px-3 text-[10px] font-bold text-zinc-500 hover:text-red-400 transition-colors"
								title="Clear All"
							>
								Clear
							</button>
						</div>
					</div>
				</Show>
			</fieldset>
		</div>
	);
}
