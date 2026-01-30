import { For } from "solid-js";

interface Segment {
	title: string;
	tags: string[];
	features: string;
	images?: string[];
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
		<div class="swiss-card p-0 grid grid-cols-1 lg:grid-cols-12 min-h-[340px]">
			{/* Header Column */}
			<div class="lg:col-span-3 p-10 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col bg-gray-50/50">
				<div class="mb-8">
					<div class="flex flex-wrap gap-2 mb-6">
						<For each={segment.tags}>
							{(tag) => (
								/* Accent Usage: Tags */
								<span class="text-xs font-bold uppercase tracking-widest bg-[#d3fd50] text-black px-2 py-1 rounded">
									{tag}
								</span>
							)}
						</For>
					</div>
					<h3 class="text-2xl font-medium tracking-tight text-black leading-tight">
						{segment.title}
					</h3>
				</div>
				<p class="text-base text-gray-500 leading-relaxed mt-auto font-light">
					{segment.features}
				</p>
			</div>

			{/* Content Area */}
			<div class="lg:col-span-9 p-10 flex flex-col justify-center bg-white gap-8">
				{segment.details && (
					<div class="grid grid-cols-2 gap-6">
						<For each={segment.details}>
							{(detail) => (
								<div class="p-4 border-l border-gray-200 pl-6">
									<div class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
										{detail.label}
									</div>
									<div class="text-lg font-medium tracking-tight text-black leading-snug">
										{detail.value}
									</div>
								</div>
							)}
						</For>
					</div>
				)}

				{segment.images && (
					<div class="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
						<For each={segment.images}>
							{(img) => (
								<div class="flex-none w-80 h-80 rounded-xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center p-4 hover:border-gray-200 transition-all hover:shadow-sm group">
									<img
										src={img}
										alt=""
										class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
									/>
								</div>
							)}
						</For>
					</div>
				)}

				{segment.insight && (
					<div class="relative pl-8 border-l-2 border-[#d3fd50]">
						<div class="mb-8">
							<span class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 block">
								核心洞察
							</span>
							<p class="text-2xl text-black font-light leading-relaxed">
								{segment.insight}
							</p>
						</div>
						<div class="bg-black text-white px-5 py-3 rounded inline-block">
							<span class="text-xs font-bold uppercase tracking-widest opacity-60 block mb-1">
								战略
							</span>
							<span class="text-sm font-medium tracking-wide">
								{segment.strategy}
							</span>
						</div>
					</div>
				)}

				{segment.costComparison && (
					<div class="w-full">
						<div class="flex items-end justify-between mb-8 pb-8 border-b border-gray-100">
							<div>
								<span class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
									油车运营
								</span>
								<span class="text-2xl font-mono text-gray-300 line-through decoration-gray-300">
									{segment.costComparison.ice}
								</span>
							</div>
							<div class="text-right">
								<span class="text-xs font-bold uppercase tracking-widest text-black mb-2 block">
									电车优化
								</span>
								{/* Accent Usage: Highlighted Cost */}
								<span class="text-5xl font-mono font-medium text-black bg-[#d3fd50] px-2 -mr-2">
									{segment.costComparison.ev}
								</span>
							</div>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-xs font-medium text-gray-500">
								{segment.conclusion}
							</span>
							<div class="text-right">
								<span class="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">
									成本比
								</span>
								<span class="px-3 py-1 bg-black text-white rounded-full text-xs font-bold tracking-wide">
									{segment.costComparison.ratio} 效率
								</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
