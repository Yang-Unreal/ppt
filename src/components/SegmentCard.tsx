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
		<div class="bg-black p-8 lg:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 group hover:bg-[#0a0a0a] transition-all duration-500 relative overflow-hidden">
			{/* Decorative background number or icon could go here */}
			<div class="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
				<h4 class="text-[8rem] lg:text-[12rem] font-bold leading-none tracking-tighter select-none">
					{segment.title.substring(0, 1)}
				</h4>
			</div>

			{/* Left Column: Header & Features */}
			<div class="md:col-span-5 flex flex-col relative z-10">
				<div class="mb-8">
					<div class="flex items-center gap-3 mb-4">
						<span class="w-2 h-2 bg-zinc-800 rounded-full group-hover:bg-white transition-colors duration-500"></span>
						<h3 class="text-3xl lg:text-4xl font-bold text-white tracking-tighter">
							{segment.title}
						</h3>
					</div>
					<div class="flex flex-wrap gap-2">
						<For each={segment.tags}>
							{(tag) => (
								<span class="text-[8px] lg:text-[9px] font-mono uppercase tracking-widest border border-zinc-800 bg-zinc-950 text-zinc-500 px-3 py-1 group-hover:border-zinc-700 group-hover:text-zinc-300 transition-colors">
									{tag}
								</span>
							)}
						</For>
					</div>
				</div>
				<p class="text-zinc-400 text-base lg:text-lg leading-relaxed font-light italic border-l-2 border-zinc-900 pl-6 py-1 lg:pl-8 lg:py-2 group-hover:border-zinc-700 transition-colors">
					{segment.features}
				</p>
			</div>

			{/* Right Column: Data & Insights */}
			<div class="md:col-span-7 pt-8 md:pt-0 relative z-10">
				{segment.details ? (
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900 shadow-2xl">
						<For each={segment.details}>
							{(detail) => (
								<div class="bg-black p-6 lg:p-8 group/item hover:bg-zinc-950 transition-colors">
									<div class="text-[9px] lg:text-[10px] text-zinc-600 mb-4 uppercase tracking-[0.2em] font-mono font-bold group-hover/item:text-zinc-400">
										{detail.label}
									</div>
									<div class="text-xl lg:text-2xl font-bold text-white tracking-tight group-hover/item:translate-x-1 transition-transform">
										{detail.value}
									</div>
								</div>
							)}
						</For>
					</div>
				) : segment.insight ? (
					<div class="h-full flex flex-col justify-center">
						<div class="bg-zinc-950 border border-zinc-900 p-8 lg:p-10 relative group/insight">
							<div class="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-zinc-800 group-hover/insight:border-white transition-colors duration-700"></div>

							<h4 class="text-zinc-700 text-[9px] font-bold uppercase mb-6 tracking-[0.4em] font-mono">
								Core Strategic Insight
							</h4>
							<p class="text-zinc-300 text-lg lg:text-xl leading-snug mb-8 font-display">
								"{segment.insight}"
							</p>

							<div class="flex flex-col gap-1 pt-8 border-t border-zinc-900">
								<span class="text-[8px] text-zinc-600 font-mono uppercase tracking-widest">
									Deployment Strategy
								</span>
								<span class="text-white text-xs lg:text-sm font-mono tracking-tight">
									{segment.strategy}
								</span>
							</div>
						</div>
					</div>
				) : segment.costComparison ? (
					<div class="flex flex-col h-full justify-center">
						<div class="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 lg:gap-6 mb-8 lg:mb-10">
							<div class="sm:col-span-5 bg-zinc-950 p-6 lg:p-8 border border-zinc-900 text-center relative overflow-hidden group/cost">
								<div class="text-[8px] lg:text-[9px] text-zinc-700 mb-3 uppercase tracking-[0.2em] font-mono font-bold">
									ICE Operational
								</div>
								<div class="text-xl lg:text-2xl font-bold text-zinc-600 font-mono tracking-tighter">
									{segment.costComparison.ice}
								</div>
								<div class="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-900"></div>
							</div>

							<div class="sm:col-span-2 text-center py-2 sm:py-0">
								<div class="w-8 h-8 lg:w-10 lg:h-10 border border-zinc-800 rounded-full flex items-center justify-center mx-auto bg-black shadow-[0_0_20px_rgba(0,0,0,1)]">
									<span class="text-[8px] lg:text-[9px] font-bold text-zinc-600 font-mono">
										VS
									</span>
								</div>
							</div>

							<div class="sm:col-span-5 bg-black border border-zinc-700 p-6 lg:p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] group/cost relative">
								<div class="text-[8px] lg:text-[9px] text-zinc-400 mb-3 uppercase tracking-[0.2em] font-mono font-bold">
									EV Operational
								</div>
								<div class="text-2xl lg:text-3xl font-bold text-white font-mono tracking-tighter">
									{segment.costComparison.ev}
								</div>
								<div class="absolute bottom-0 left-0 w-full h-1 bg-white scale-x-75 group-hover:scale-x-100 transition-transform duration-700"></div>
							</div>
						</div>

						<div class="bg-zinc-900/30 p-6 lg:p-8 border border-zinc-900 flex items-center justify-between">
							<div class="flex flex-col gap-1">
								<span class="text-[8px] lg:text-[9px] font-mono text-zinc-600 tracking-[0.3em] uppercase font-bold">
									Efficiency Index
								</span>
								<p class="text-[9px] text-zinc-700 font-mono">
									Operational cost reduction factor
								</p>
							</div>
							<div class="text-3xl lg:text-4xl font-bold text-white font-mono tracking-tighter">
								{segment.costComparison.ratio}
							</div>
						</div>

						<div class="mt-8 text-right">
							<p class="text-[10px] lg:text-xs text-zinc-600 italic font-light tracking-wide inline-block border-b border-zinc-900 pb-1 lg:pb-2">
								"
								{segment.conclusion ||
									"Significant economic shift in logistics sector."}
								"
							</p>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
