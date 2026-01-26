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
		<div class="bg-white p-8 lg:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 group hover:bg-gray-50 transition-all duration-500 relative overflow-hidden border-b border-gray-100 last:border-b-0">
			{/* Decorative background number or icon could go here */}
			<div class="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
				<h4 class="text-[8rem] lg:text-[12rem] font-bold leading-none tracking-tighter select-none text-gray-900">
					{segment.title.substring(0, 1)}
				</h4>
			</div>

			{/* Left Column: Header & Features */}
			<div class="md:col-span-5 flex flex-col relative z-10">
				<div class="mb-8">
					<div class="flex items-center gap-3 mb-4">
						<span class="w-2 h-2 bg-gray-200 rounded-full group-hover:bg-gray-900 transition-colors duration-500"></span>
						<h3 class="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tighter">
							{segment.title}
						</h3>
					</div>
					<div class="flex flex-wrap gap-2">
						<For each={segment.tags}>
							{(tag) => (
								<span class="text-[8px] lg:text-[9px] font-mono uppercase tracking-widest border border-gray-200 bg-gray-50 text-gray-500 px-3 py-1 group-hover:border-gray-300 group-hover:text-gray-700 transition-colors rounded">
									{tag}
								</span>
							)}
						</For>
					</div>
				</div>
				<p class="text-gray-500 text-base lg:text-lg leading-relaxed font-light italic border-l-2 border-gray-200 pl-6 py-1 lg:pl-8 lg:py-2 group-hover:border-gray-400 transition-colors">
					{segment.features}
				</p>
			</div>

			{/* Right Column: Data & Insights */}
			<div class="md:col-span-7 pt-8 md:pt-0 relative z-10">
				{segment.details ? (
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100 border border-gray-200 shadow-sm rounded-xl overflow-hidden">
						<For each={segment.details}>
							{(detail) => (
								<div class="bg-white p-6 lg:p-8 group/item hover:bg-gray-50 transition-colors">
									<div class="text-[9px] lg:text-[10px] text-gray-400 mb-4 uppercase tracking-[0.2em] font-mono font-bold group-hover/item:text-gray-600">
										{detail.label}
									</div>
									<div class="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight group-hover/item:translate-x-1 transition-transform">
										{detail.value}
									</div>
								</div>
							)}
						</For>
					</div>
				) : segment.insight ? (
					<div class="h-full flex flex-col justify-center">
						<div class="bg-gray-50 border border-gray-200 p-8 lg:p-10 relative group/insight rounded-xl">
							<div class="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-gray-200 group-hover/insight:border-gray-900 transition-colors duration-700 rounded-tl-lg"></div>

							<h4 class="text-gray-400 text-[9px] font-bold uppercase mb-6 tracking-[0.4em] font-mono">
								Core Strategic Insight
							</h4>
							<p class="text-gray-700 text-lg lg:text-xl leading-snug mb-8 font-display">
								"{segment.insight}"
							</p>

							<div class="flex flex-col gap-1 pt-8 border-t border-gray-200">
								<span class="text-[8px] text-gray-400 font-mono uppercase tracking-widest">
									Deployment Strategy
								</span>
								<span class="text-gray-900 text-xs lg:text-sm font-mono tracking-tight">
									{segment.strategy}
								</span>
							</div>
						</div>
					</div>
				) : segment.costComparison ? (
					<div class="flex flex-col h-full justify-center">
						<div class="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 lg:gap-6 mb-8 lg:mb-10">
							<div class="sm:col-span-5 bg-gray-50 p-6 lg:p-8 border border-gray-200 text-center relative overflow-hidden group/cost rounded-xl">
								<div class="text-[8px] lg:text-[9px] text-gray-400 mb-3 uppercase tracking-[0.2em] font-mono font-bold">
									ICE Operational
								</div>
								<div class="text-xl lg:text-2xl font-bold text-gray-500 font-mono tracking-tighter">
									{segment.costComparison.ice}
								</div>
								<div class="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200"></div>
							</div>

							<div class="sm:col-span-2 text-center py-2 sm:py-0">
								<div class="w-8 h-8 lg:w-10 lg:h-10 border border-gray-200 rounded-full flex items-center justify-center mx-auto bg-white shadow-sm">
									<span class="text-[8px] lg:text-[9px] font-bold text-gray-400 font-mono">
										VS
									</span>
								</div>
							</div>

							<div class="sm:col-span-5 bg-white border border-gray-300 p-6 lg:p-8 text-center shadow-md group/cost relative rounded-xl">
								<div class="text-[8px] lg:text-[9px] text-gray-500 mb-3 uppercase tracking-[0.2em] font-mono font-bold">
									EV Operational
								</div>
								<div class="text-2xl lg:text-3xl font-bold text-gray-900 font-mono tracking-tighter">
									{segment.costComparison.ev}
								</div>
								<div class="absolute bottom-0 left-0 w-full h-1 bg-gray-900 scale-x-75 group-hover:scale-x-100 transition-transform duration-700 rounded-b-xl"></div>
							</div>
						</div>

						<div class="bg-gray-50 p-6 lg:p-8 border border-gray-200 flex items-center justify-between rounded-xl">
							<div class="flex flex-col gap-1">
								<span class="text-[8px] lg:text-[9px] font-mono text-gray-400 tracking-[0.3em] uppercase font-bold">
									Efficiency Index
								</span>
								<p class="text-[9px] text-gray-400 font-mono">
									Operational cost reduction factor
								</p>
							</div>
							<div class="text-3xl lg:text-4xl font-bold text-gray-900 font-mono tracking-tighter">
								{segment.costComparison.ratio}
							</div>
						</div>

						<div class="mt-8 text-right">
							<p class="text-[10px] lg:text-xs text-gray-500 italic font-light tracking-wide inline-block border-b border-gray-200 pb-1 lg:pb-2">
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
