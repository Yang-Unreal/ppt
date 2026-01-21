import { createSignal, For, onCleanup, onMount, Show } from "solid-js";

interface Path {
	points: { x: number; y: number }[];
	color: string;
	width: number;
	isEraser: boolean;
}

export default function PresentationMarker() {
	let canvasRef: HTMLCanvasElement | undefined;
	const [isDrawingMode, setIsDrawingMode] = createSignal(false);
	const [currentTool, setCurrentTool] = createSignal<"marker" | "eraser">(
		"marker",
	);
	const [currentColor, setCurrentColor] = createSignal("#ff4444");
	const [paths, setPaths] = createSignal<Path[]>([]);
	const [isCurrentlyDrawing, setIsCurrentlyDrawing] = createSignal(false);

	const colors = [
		"#ff4444",
		"#44ff44",
		"#4444ff",
		"#00f2ff",
		"#ffff44",
		"#ffffff",
	];

	const handleResize = () => {
		if (canvasRef) {
			canvasRef.width = window.innerWidth;
			// Set height to full document scroll height to allow drawing across all content
			canvasRef.height = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight,
				window.innerHeight,
			);
			redraw();
		}
	};

	const getPos = (e: MouseEvent | TouchEvent) => {
		if (!canvasRef) return { x: 0, y: 0 };
		const rect = canvasRef.getBoundingClientRect();
		// Get coordinates relative to the viewport
		let clientX: number, clientY: number;
		if ("touches" in e) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		// Convert viewport coordinates to canvas/document coordinates
		// Since the canvas is absolute at top-0 left-0, its rect.left/top
		// will be -window.scrollX/Y.
		return {
			x: clientX - rect.left,
			y: clientY - rect.top,
		};
	};

	const startDrawing = (e: MouseEvent | TouchEvent) => {
		if (!isDrawingMode()) return;
		setIsCurrentlyDrawing(true);
		const pos = getPos(e);
		const newPath: Path = {
			points: [pos],
			color: currentColor(),
			width: currentTool() === "eraser" ? 20 : 4,
			isEraser: currentTool() === "eraser",
		};
		setPaths([...paths(), newPath]);
	};

	const draw = (e: MouseEvent | TouchEvent) => {
		if (!isCurrentlyDrawing() || !isDrawingMode()) return;
		const pos = getPos(e);
		const currentPaths = paths();
		const lastPath = currentPaths[currentPaths.length - 1];
		if (lastPath) {
			lastPath.points.push(pos);
			setPaths([...currentPaths]);
			updateCanvas();
		}
	};

	const stopDrawing = () => {
		setIsCurrentlyDrawing(false);
	};

	const updateCanvas = () => {
		if (!canvasRef) return;
		const ctx = canvasRef.getContext("2d");
		if (!ctx) return;

		const currentPaths = paths();
		const lastPath = currentPaths[currentPaths.length - 1];
		if (!lastPath || lastPath.points.length < 2) return;

		const p1 = lastPath.points[lastPath.points.length - 2];
		const p2 = lastPath.points[lastPath.points.length - 1];

		ctx.beginPath();
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		if (lastPath.isEraser) {
			ctx.globalCompositeOperation = "destination-out";
			ctx.lineWidth = lastPath.width;
		} else {
			ctx.globalCompositeOperation = "source-over";
			ctx.strokeStyle = lastPath.color;
			ctx.lineWidth = lastPath.width;
			ctx.shadowBlur = 2;
			ctx.shadowColor = lastPath.color;
		}

		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.stroke();
	};

	const redraw = () => {
		if (!canvasRef) return;
		const ctx = canvasRef.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

		paths().forEach((path) => {
			if (path.points.length < 2) return;
			ctx.beginPath();
			ctx.lineCap = "round";
			ctx.lineJoin = "round";

			if (path.isEraser) {
				ctx.globalCompositeOperation = "destination-out";
				ctx.lineWidth = path.width;
			} else {
				ctx.globalCompositeOperation = "source-over";
				ctx.strokeStyle = path.color;
				ctx.lineWidth = path.width;
			}

			ctx.moveTo(path.points[0].x, path.points[0].y);
			for (let i = 1; i < path.points.length; i++) {
				ctx.lineTo(path.points[i].x, path.points[i].y);
			}
			ctx.stroke();
		});
	};

	const clearCanvas = () => {
		setPaths([]);
		if (!canvasRef) return;
		const ctx = canvasRef.getContext("2d");
		ctx?.clearRect(0, 0, canvasRef.width, canvasRef.height);
	};

	onMount(() => {
		window.addEventListener("resize", handleResize);
		handleResize();
		onCleanup(() => window.removeEventListener("resize", handleResize));
	});

	return (
		<>
			<canvas
				ref={canvasRef}
				class={`absolute top-0 left-0 z-8000 ${isDrawingMode() ? "cursor-crosshair pointer-events-auto" : "pointer-events-none"}`}
				onMouseDown={startDrawing}
				onMouseMove={draw}
				onMouseUp={stopDrawing}
				onMouseOut={stopDrawing}
				onBlur={stopDrawing}
				onTouchStart={startDrawing}
				onTouchMove={draw}
				onTouchEnd={stopDrawing}
			/>

			<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-9000 flex items-center gap-4 bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
				{/* Mode Toggle */}
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
					{/* Tools */}
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

					{/* Colors */}
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

					{/* Actions */}
					<button
						type="button"
						onClick={clearCanvas}
						class="px-3 py-2 text-xs text-zinc-400 hover:text-red-400 transition-colors"
					>
						Clear All
					</button>
				</Show>
			</div>
		</>
	);
}
