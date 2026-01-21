import { getStroke } from "perfect-freehand";
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";

interface Point {
	x: number;
	y: number;
}

interface Path {
	id: string;
	points: Point[];
	color: string;
	width: number;
	isEraser: boolean;
}

export default function PresentationMarker() {
	let mainCanvasRef: HTMLCanvasElement | undefined;
	let tempCanvasRef: HTMLCanvasElement | undefined;
	let eraserCursorRef: HTMLDivElement | undefined;
	let markerCursorRef: HTMLDivElement | undefined;

	const [isDrawingMode, setIsDrawingMode] = createSignal(false);
	const [currentTool, setCurrentTool] = createSignal<"marker" | "eraser">(
		"marker",
	);
	const [currentColor, setCurrentColor] = createSignal("#ff4444");
	const [paths, setPaths] = createSignal<Path[]>([]);
	const [isCurrentlyDrawing, setIsCurrentlyDrawing] = createSignal(false);
	const [pendingDeletionIds, setPendingDeletionIds] = createSignal<Set<string>>(
		new Set(),
	);

	let activePath: Path | null = null;
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

	// Distance from point P to segment AB
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

	const checkHit = (pos: Point) => {
		const hitIds = new Set(pendingDeletionIds());
		let changed = false;

		paths().forEach((path) => {
			if (hitIds.has(path.id)) return;
			// Check distance to all segments of the path
			for (let i = 0; i < path.points.length - 1; i++) {
				const dist = distToSegment(pos, path.points[i], path.points[i + 1]);
				if (dist < ERASER_SIZE / 2 + path.width / 2) {
					hitIds.add(path.id);
					changed = true;
					break;
				}
			}
		});

		if (changed) {
			setPendingDeletionIds(hitIds);
			redraw();
		}
	};

	const startDrawing = (e: MouseEvent | TouchEvent) => {
		if (!isDrawingMode()) return;
		const pos = getPos(e);

		if (currentTool() === "eraser") {
			setIsCurrentlyDrawing(true);
			setPendingDeletionIds(new Set());
			checkHit(pos);
		} else {
			setIsCurrentlyDrawing(true);
			activePath = {
				id: Math.random().toString(36).substr(2, 9),
				points: [pos],
				color: currentColor(),
				width: MARKER_WIDTH,
				isEraser: false,
			};
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

		if (eraserCursorRef) {
			eraserCursorRef.style.transform = `translate(${clientX - ERASER_SIZE / 2}px, ${clientY - ERASER_SIZE / 2}px)`;
		}
		if (markerCursorRef) {
			markerCursorRef.style.transform = `translate(${clientX - 4}px, ${clientY - 4}px)`;
		}

		if (!isCurrentlyDrawing() || !isDrawingMode()) return;

		if (currentTool() === "eraser") {
			checkHit(pos);
		} else if (activePath) {
			activePath.points.push(pos);
			updateTempCanvas();
		}
	};

	const stopDrawing = () => {
		if (isCurrentlyDrawing()) {
			if (currentTool() === "eraser") {
				const idsToDelete = pendingDeletionIds();
				if (idsToDelete.size > 0) {
					setPaths(paths().filter((p) => !idsToDelete.has(p.id)));
					setPendingDeletionIds(new Set());
					redraw();
				}
			} else if (activePath) {
				setPaths([...paths(), activePath]);
				activePath = null;
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
	};

	const drawPath = (
		ctx: CanvasRenderingContext2D,
		path: Path,
		isPendingDeletion: boolean,
	) => {
		if (path.points.length < 2) return;

		const scrollY = window.scrollY;
		const viewportPoints = path.points.map((p) => [p.x, p.y - scrollY]);

		const stroke = getStroke(viewportPoints, {
			size: path.width,
			thinning: 0.5,
			smoothing: 0.5,
			streamline: 0.5,
		});

		if (stroke.length === 0) return;

		ctx.beginPath();
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = path.color;

		if (isPendingDeletion) {
			ctx.globalAlpha = 0.2;
		} else {
			ctx.globalAlpha = 1.0;
		}

		ctx.moveTo(stroke[0][0], stroke[0][1]);
		for (let i = 1; i < stroke.length; i++) {
			ctx.lineTo(stroke[i][0], stroke[i][1]);
		}
		ctx.closePath();
		ctx.fill();
		ctx.globalAlpha = 1.0; // Reset
	};

	const updateTempCanvas = () => {
		if (!tempCanvasRef || !activePath) return;
		const ctx = tempCanvasRef.getContext("2d");
		if (!ctx) return;

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, tempCanvasRef.width, tempCanvasRef.height);
		ctx.restore();

		drawPath(ctx, activePath, false);
	};

	const redraw = () => {
		if (!mainCanvasRef) return;
		const ctx = mainCanvasRef.getContext("2d");
		if (!ctx) return;

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, mainCanvasRef.width, mainCanvasRef.height);
		ctx.restore();

		const pendingIds = pendingDeletionIds();
		paths().forEach((path) => {
			drawPath(ctx, path, pendingIds.has(path.id));
		});
	};

	const clearCanvas = () => {
		setPaths([]);
		redraw();
	};

	const undo = () => {
		const currentPaths = paths();
		if (currentPaths.length === 0) return;
		setPaths(currentPaths.slice(0, -1));
		redraw();
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "z") {
			e.preventDefault();
			undo();
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

	const colors = [
		"#ff4444",
		"#44ff44",
		"#4444ff",
		"#00f2ff",
		"#ffff44",
		"#ffffff",
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

			<Show when={isDrawingMode() && currentTool() === "marker"}>
				<div
					ref={markerCursorRef}
					class="fixed pointer-events-none z-8002 border border-white/50 rounded-full"
					style={{
						width: "8px",
						height: "8px",
						"background-color": currentColor(),
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
					class={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
						isDrawingMode()
							? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]"
							: "text-zinc-400 hover:text-white hover:bg-white/5"
					}`}
				>
					{isDrawingMode() ? "Mode: Drawing" : "Mode: Viewing"}
				</button>

				<div class="w-px h-6 bg-white/10" />

				<Show when={isDrawingMode()}>
					<div class="flex gap-1 bg-black/40 p-1 rounded-xl">
						<button
							type="button"
							onClick={() => setCurrentTool("marker")}
							class={`px-3 py-1.5 rounded-lg text-xs transition-all ${
								currentTool() === "marker"
									? "bg-white/10 text-white"
									: "text-zinc-500 hover:text-zinc-300"
							}`}
						>
							Marker
						</button>
						<button
							type="button"
							onClick={() => setCurrentTool("eraser")}
							class={`px-3 py-1.5 rounded-lg text-xs transition-all ${
								currentTool() === "eraser"
									? "bg-white/10 text-white"
									: "text-zinc-500 hover:text-zinc-300"
							}`}
						>
							Eraser
						</button>
					</div>

					<div class="w-px h-6 bg-white/10" />

					<div class="flex gap-2 px-2">
						<For each={colors}>
							{(color) => (
								<button
									type="button"
									onClick={() => {
										setCurrentColor(color);
										setCurrentTool("marker");
									}}
									class={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-125 ${
										currentColor() === color && currentTool() === "marker"
											? "border-white scale-110"
											: "border-transparent"
									}`}
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
							class="px-3 py-2 text-xs text-zinc-400 hover:text-white transition-colors"
							title="Undo (Ctrl+Z)"
						>
							Undo
						</button>
						<button
							type="button"
							onClick={clearCanvas}
							class="px-3 py-2 text-xs text-zinc-400 hover:text-red-400 transition-colors"
						>
							Clear All
						</button>
					</div>
				</Show>
			</div>
		</>
	);
}
