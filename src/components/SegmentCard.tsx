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
		<div class="swiss-card p-0 grid grid-cols-1 lg:grid-cols-12 min-h-[320px]">
			{/* Header Column */}
			<div class="lg:col-span-4 p-8 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/30 flex flex-col">
				<div class="mb-6">
					<div class="flex flex-wrap gap-2 mb-4">
						<For each={segment.tags}>
							{(tag) => (
								<span class="text-[9px] font-mono uppercase tracking-widest border border-gray-200 text-gray-500 px-2 py-1 rounded-full bg-white">
									{tag}
								</span>
							)}
						</For>
					</div>
					<h3 class="text-3xl font-semibold tracking-tight text-gray-900 leading-tight">
						{segment.title}
					</h3>
				</div>
				<p class="text-sm text-gray-600 leading-relaxed mt-auto border-l border-gray-200 pl-4">
					{segment.features}
				</p>
			</div>

			{/* Content Area - Modular */}
			<div class="lg:col-span-8 p-8 flex flex-col justify-center">
				{segment.details ? (
					<div class="grid grid-cols-2 gap-4">
						<For each={segment.details}>
							{(detail) => (
								<div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
									<div class="text-[10px] text-gray-400 uppercase tracking-widest font-mono mb-2">
										{detail.label}
									</div>
									<div class="text-2xl font-medium tracking-tight text-gray-900">
										{detail.value}
									</div>
								</div>
							)}
						</For>
					</div>
				) : segment.insight ? (
					<div class="relative pl-8">
						<div class="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
						<div class="mb-6">
							<span class="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2 block">
								Core Insight
							</span>
							<p class="text-xl text-gray-900 font-light leading-relaxed">
								{segment.insight}
							</p>
						</div>
						<div class="bg-gray-900 text-white p-4 rounded-lg inline-block">
							<span class="text-[10px] font-mono uppercase tracking-widest opacity-60 block mb-1">
								Strategy
							</span>
							<span class="text-sm font-medium tracking-tight">
								{segment.strategy}
							</span>
						</div>
					</div>
				) : segment.costComparison ? (
					<div class="w-full">
						<div class="flex items-end justify-between mb-8 pb-8 border-b border-gray-100">
							<div>
								<span class="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1 block">
									ICE Operational
								</span>
								<span class="text-2xl font-mono text-gray-300 line-through decoration-gray-300">
									{segment.costComparison.ice}
								</span>
							</div>
							<div class="text-right">
								<span class="text-[10px] font-mono uppercase tracking-widest text-green-600 mb-1 block">
									EV Optimized
								</span>
								<span class="text-4xl font-mono font-medium text-gray-900">
									{segment.costComparison.ev}
								</span>
							</div>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-xs text-gray-500">{segment.conclusion}</span>
							<span class="px-3 py-1 bg-gray-100 rounded-full text-xs font-mono font-bold text-gray-900">
								{segment.costComparison.ratio} Ratio
							</span>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
