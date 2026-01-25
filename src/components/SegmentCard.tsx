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

export default function SegmentCard({ segment }: { segment: Segment }) {
	return (
		<div class="bg-black p-12 grid grid-cols-1 md:grid-cols-12 gap-16 group hover:bg-zinc-950 transition-colors">
			{/* Left Column: Header & Features */}
			<div class="md:col-span-5 flex flex-col">
				<div class="mb-10">
					<h3 class="text-3xl font-bold mb-6 text-white tracking-tight">
						{segment.title}
					</h3>
					<div class="flex flex-wrap gap-2 pt-5">
						<For each={segment.tags}>
							{(tag) => (
								<span class="text-[10px] font-mono uppercase tracking-widest border border-zinc-800 text-zinc-500 px-3 py-1 rounded-sm">
									{tag}
								</span>
							)}
						</For>
					</div>
				</div>
				<p class="text-zinc-500 text-sm leading-relaxed font-light">
					{segment.features}
				</p>
			</div>

			{/* Right Column: Data & Insights */}
			<div class="md:col-span-7 pt-12 md:pt-0">
				{segment.details ? (
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900">
						<For each={segment.details}>
							{(detail) => (
								<div class="bg-black p-6">
									<div class="text-[10px] text-zinc-600 mb-3 uppercase tracking-[0.2em] font-mono">
										{detail.label}
									</div>
									<div class="text-xl font-bold text-white tracking-tight">
										{detail.value}
									</div>
								</div>
							)}
						</For>
					</div>
				) : segment.insight ? (
					<div class="h-full flex flex-col justify-center">
						<div class="bg-zinc-950/50 border border-zinc-900 p-8 rounded-sm relative">
							<div class="absolute top-0 right-0 w-8 h-8 flex items-center justify-center">
								<div class="w-1 h-1 bg-zinc-700"></div>
							</div>
							<h4 class="text-zinc-600 text-[10px] font-bold uppercase mb-6 tracking-[0.3em]">
								Strategic Insight
							</h4>
							<p class="text-zinc-300 text-md leading-relaxed mb-8 pt-5">
								"{segment.insight}"
							</p>
							<div class="flex items-center gap-4 pt-6 border-t border-zinc-900">
								<span class="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold">
									Strategy:
								</span>
								<span class="text-white text-xs font-mono">
									{segment.strategy}
								</span>
							</div>
						</div>
					</div>
				) : segment.costComparison ? (
					<div class="flex flex-col h-full justify-center">
						<div class="flex items-center gap-4 text-center mb-10">
							<div class="flex-1 bg-zinc-950 p-8 border border-zinc-900 opacity-30">
								<div class="text-[10px] text-zinc-600 mb-4 uppercase tracking-widest font-mono">
									ICE Cost
								</div>
								<div class="text-2xl font-bold text-zinc-500 font-mono tracking-tighter">
									{segment.costComparison.ice}
								</div>
							</div>

							<div class="text-xs font-bold text-zinc-800 uppercase font-mono tracking-widest px-4">
								vs
							</div>

							<div class="flex-1 bg-black border border-zinc-800 p-8">
								<div class="text-[10px] text-zinc-500 mb-4 uppercase tracking-widest font-mono">
									EV Cost
								</div>
								<div class="text-2xl font-bold text-white font-mono tracking-tighter">
									{segment.costComparison.ev}
								</div>
							</div>
						</div>

						<div class="flex items-center justify-between pt-8 border-t border-zinc-900">
							<div class="text-[10px] font-mono text-zinc-700 tracking-[0.3em] uppercase">
								Savings Efficiency Ratio
							</div>
							<div class="text-xl font-bold text-white font-mono">
								{segment.costComparison.ratio || "1/8"}
							</div>
						</div>

						<div class="mt-8 text-center text-xs text-zinc-500 italic font-light tracking-tight">
							"{segment.conclusion}"
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
