import { getStroke } from "perfect-freehand";
import rough from "roughjs";
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";

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
	| "arrow";

interface Element {
	id: string;
	type: ElementType;
	points: Point[];
	color: string;
	width: number;
	seed: number;
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
	const [isCurrentlyDrawing, setIsCurrentlyDrawing] = createSignal(false);
	const [selectedElementId, setSelectedElementId] = createSignal<string | null>(
		null,
	);
	const [pendingDeletionIds, setPendingDeletionIds] = createSignal<Set<string>>(
		new Set<string>(),
	);

	let activeElement: Element | null = null;
	let dragStartPos: Point | null = null;
	let dragInitialPoints: Point[] = [];

	const ERASER_SIZE = 50;
	const MARKER_WIDTH = 4;

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

	const hitTest = (pos: Point) => {
		// Return the first element hit (topmost)
		const sortedElements = [...elements()].reverse();
		for (const el of sortedElements) {
			let isHit = false;
			const hitRadius = el.type === "marker" ? el.width + 10 : 15;

			if (el.type === "marker") {
				for (let i = 0; i < el.points.length - 1; i++) {
					if (distToSegment(pos, el.points[i], el.points[i + 1]) < hitRadius) {
						isHit = true;
						break;
					}
				}
			} else if (el.type === "rectangle") {
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
				if (edges.some((d) => d < 10)) isHit = true;
			} else if (el.type === "ellipse") {
				const [a, b] = el.points;
				const cx = (a.x + b.x) / 2;
				const cy = (a.y + b.y) / 2;
				const rx = Math.abs(a.x - b.x) / 2;
				const ry = Math.abs(a.y - b.y) / 2;
				const dx = pos.x - cx;
				const dy = pos.y - cy;
				const val = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
				if (val >= 0.7 && val <= 1.3) isHit = true;
			} else if (el.type === "arrow") {
				const [a, b] = el.points;
				if (distToSegment(pos, a, b) < 15) isHit = true;
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
			const id = hitTest(pos);
			setSelectedElementId(id);
			if (id) {
				const el = elements().find((e) => e.id === id);
				if (el) {
					dragStartPos = pos;
					dragInitialPoints = el.points.map((p) => ({ ...p }));
				}
			}
			redraw();
		} else if (currentTool() === "eraser") {
			setPendingDeletionIds(new Set<string>());
			checkHit(pos);
		} else {
			setSelectedElementId(null);
			activeElement = {
				id: Math.random().toString(36).substr(2, 9),
				type: currentTool(),
				points: [pos, pos],
				color: currentColor(),
				width: MARKER_WIDTH,
				seed: Math.floor(Math.random() * 2 ** 31),
			};
		}
	};

	const checkHit = (pos: Point) => {
		const hitIds = new Set(pendingDeletionIds());
		let changed = false;
		elements().forEach((el) => {
			if (hitIds.has(el.id)) return;
			const id = hitTest(pos); // Reuse hitTest logic
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
			eraserCursorRef.style.transform = `translate(${clientX - ERASER_SIZE / 2}px, ${clientY - ERASER_SIZE / 2}px)`;
		if (markerCursorRef)
			markerCursorRef.style.transform = `translate(${clientX - 4}px, ${clientY - 4}px)`;

		if (!isCurrentlyDrawing() || !isDrawingMode()) return;

		if (currentTool() === "select" && selectedElementId() && dragStartPos) {
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
				setElements([...elements(), activeElement]);
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
	};

	const renderElement = (
		ctx: CanvasRenderingContext2D,
		rc: any,
		el: Element,
		isPending: boolean,
	) => {
		if (el.points.length < 2) return;
		const scrollY = window.scrollY;
		ctx.save();

		const isSelected = selectedElementId() === el.id;
		ctx.globalAlpha = isPending ? 0.2 : 1.0;

		if (el.type === "marker") {
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
		} else {
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
			// Simple bounding box for highlight
			const xs = el.points.map((p) => p.x);
			const ys = el.points.map((p) => p.y - scrollY);
			const minX = Math.min(...xs) - 5;
			const maxX = Math.max(...xs) + 5;
			const minY = Math.min(...ys) - 5;
			const maxY = Math.max(...ys) + 5;
			ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
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

	onMount(() => {
		window.addEventListener("resize", handleResize);
		window.addEventListener("scroll", redraw);
		window.addEventListener("keydown", (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "z") {
				e.preventDefault();
				undo();
			}
		});
		handleResize();
		onCleanup(() => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("scroll", redraw);
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

	return (
		<>
			<canvas
				ref={mainCanvasRef}
				class="fixed top-0 left-0 z-8000 pointer-events-none"
			/>
			<canvas
				ref={tempCanvasRef}
				class={`fixed top-0 left-0 z-8001 ${isDrawingMode() ? "cursor-none pointer-events-auto" : "pointer-events-none"}`}
				onMouseDown={startDrawing}
				onMouseMove={draw}
				onMouseUp={stopDrawing}
				onMouseOut={stopDrawing}
				onBlur={stopDrawing}
				onTouchStart={startDrawing}
				onTouchMove={draw}
				onTouchEnd={stopDrawing}
			/>

			<Show when={isDrawingMode() && currentTool() === "eraser"}>
				<div
					ref={eraserCursorRef}
					class="fixed pointer-events-none z-8002 border border-white/50 rounded-full bg-white/10"
					style={{
						width: `${ERASER_SIZE}px`,
						height: `${ERASER_SIZE}px`,
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
