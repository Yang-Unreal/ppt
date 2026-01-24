import { For } from "solid-js";

interface Segment {
	title: string;
	tags: string[];
	features: string;
	details?: { label: string; value: string }[];
	insight?: string;
	strategy?: string;
	costComparison?: {
		ice: string;
		ev: string;
		ratio: string;
	};
	conclusion?: string;
}

interface SegmentCardProps {
	segment: Segment;
	color: "yellow" | "blue" | "green";
}

export default function SegmentCard({ segment, color }: SegmentCardProps) {
	const colorMap = {
		yellow: {
			text: "text-[#FFD512]",
			bg: "bg-[#FFD512]",
			border: "border-[#FFD512]",
			shadow: "shadow-[#FFD512]",
		},
		blue: {
			text: "text-cyan-400",
			bg: "bg-cyan-400",
			border: "border-cyan-400",
			shadow: "shadow-cyan-400",
		},
		green: {
			text: "text-[#14F195]",
			bg: "bg-[#14F195]",
			border: "border-[#14F195]",
			shadow: "shadow-[#14F195]",
		},
	};

	const theme = colorMap[color];

	return (
		<div class="glass-card p-10 grid grid-cols-1 md:grid-cols-12 gap-10 hover:border-gray-700 transition-colors duration-500">
			{/* Left Column: Header & Features */}
			<div class="md:col-span-4 flex flex-col">
				<div class="mb-6">
					<h3 class={`text-3xl font-bold mb-4 text-white tracking-tight`}>
						{segment.title}
					</h3>
					<div class="flex flex-wrap gap-2">
						<For each={segment.tags}>
							{(tag) => (
								<span
									class={`text-[10px] font-mono uppercase tracking-wider border ${theme.border}/30 ${theme.text} px-3 py-1 rounded bg-${color}-500/5`}
								>
									{tag}
								</span>
							)}
						</For>
					</div>
				</div>
				<div class="w-10 h-1 bg-[#333] mb-6"></div>
				<p class="text-gray-400 text-sm leading-relaxed">{segment.features}</p>
			</div>

			{/* Right Column: Data & Insights */}
			<div class="md:col-span-8 border-t md:border-t-0 md:border-l border-[#222] pt-8 md:pt-0 md:pl-10">
				{segment.details ? (
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
						<For each={segment.details}>
							{(detail) => (
								<div class="bg-[#0a0a0a] p-5 rounded border border-[#222] hover:border-[#444] transition-colors">
									<div class="text-xs text-gray-500 mb-2 uppercase tracking-wider font-mono">
										{detail.label}
									</div>
									<div class="text-lg font-bold text-white shadow-2xl">
										{detail.value}
									</div>
								</div>
							)}
						</For>
					</div>
				) : segment.insight ? (
					<div class="h-full flex flex-col justify-center">
						<div
							class={`bg-[#0a0a0a] border border-[#222] p-6 rounded relative overflow-hidden group`}
						>
							<div class={`absolute top-0 left-0 w-1 h-full ${theme.bg}`}></div>
							<h4
								class={`${theme.text} text-xs font-bold uppercase mb-4 tracking-widest`}
							>
								关键洞察
							</h4>
							<p class="text-gray-300 text-base leading-relaxed mb-6 font-display">
								"{segment.insight}"
							</p>
							<div class="flex items-center gap-3">
								<div class={`w-2 h-2 rounded-full ${theme.bg}`}></div>
								<div class="text-xs text-gray-400 font-mono">
									STRATEGY: <span class="text-white">{segment.strategy}</span>
								</div>
							</div>
						</div>
					</div>
				) : segment.costComparison ? (
					<div class="flex flex-col h-full justify-center">
						<div class="flex items-center gap-4 text-center mb-6">
							<div class="flex-1 bg-[#0a0a0a]/50 p-6 rounded-xl border border-[#222] opacity-50">
								<div class="text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono">
									ICE Cost
								</div>
								<div class="text-2xl font-bold text-gray-500 font-mono">
									{segment.costComparison.ice}
								</div>
							</div>

							<div class="text-sm font-bold text-[#333] uppercase font-mono tracking-tighter">
								vs
							</div>

							<div
								class={`flex-1 bg-linear-to-br from-[#111] to-black border border-[#333] p-6 rounded-xl relative group transition-all duration-500 hover:border-gray-600`}
								style={{
									"box-shadow": `0 0 40px -10px ${color === "green" ? "rgba(20, 241, 149, 0.15)" : color === "blue" ? "rgba(34, 211, 238, 0.15)" : "rgba(255, 213, 18, 0.15)"}`,
								}}
							>
								{/* Accent Glow Trace */}
								<div
									class={`absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-${color === "green" ? "[#14F195]" : color === "blue" ? "cyan-400" : "[#FFD512]"}/30 to-transparent`}
								></div>

								<div
									class={`text-[10px] ${theme.text} mb-2 uppercase tracking-widest font-mono font-bold`}
								>
									EV Cost
								</div>
								<div class="text-3xl font-bold text-white font-mono tracking-tight">
									{segment.costComparison.ev}
								</div>
							</div>
						</div>
						<div
							class={`text-center text-xs font-mono flex items-center justify-center gap-2`}
						>
							<div class="h-px w-8 bg-[#222]"></div>
							<div class={theme.text}>
								<span class="opacity-50">SAVINGS RATIO:</span>{" "}
								{segment.costComparison.ratio}
							</div>
							<div class="h-px w-8 bg-[#222]"></div>
						</div>
						<div class="mt-4 text-center text-sm text-gray-500 italic font-display">
							"{segment.conclusion}"
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
