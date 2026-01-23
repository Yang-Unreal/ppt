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
	const colorClasses = {
		yellow: {
			title: "text-yellow-400",
			tagBorder: "border-yellow-400/30",
			tagText: "text-yellow-400",
		},
		blue: {
			title: "text-blue-400",
			tagBorder: "border-blue-400/30",
			tagText: "text-blue-400",
		},
		green: {
			title: "text-green-400",
			tagBorder: "border-green-400/30",
			tagText: "text-green-400",
		},
	};

	const classes = colorClasses[color];

	return (
		<div class="glass-card p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="col-span-1">
				<h3 class={`text-2xl font-bold mb-2 ${classes.title}`}>
					{segment.title}
				</h3>
				<div class="flex flex-wrap gap-2 mb-4">
					<For each={segment.tags}>
						{(tag) => (
							<span
								class={`text-xs border ${classes.tagBorder} ${classes.tagText} px-2 py-1 rounded-full`}
							>
								{tag}
							</span>
						)}
					</For>
				</div>
				<p class="text-sm text-gray-400">{segment.features}</p>
			</div>
			<div class="col-span-2">
				{segment.details ? (
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						<For each={segment.details}>
							{(detail) => (
								<div class="bg-black/30 p-4 rounded-lg">
									<div class="text-xs text-gray-500 mb-1">{detail.label}</div>
									<div class="text-sm font-semibold">{detail.value}</div>
								</div>
							)}
						</For>
					</div>
				) : segment.insight ? (
					<div
						class={`bg-${color}-900/10 border border-${color}-500/20 p-5 rounded-lg`}
					>
						<h4 class={`text-${color}-300 text-sm font-bold uppercase mb-2`}>
							关键案例对比
						</h4>
						<p class="text-gray-300 text-sm leading-relaxed mb-4">
							{segment.insight}
						</p>
						<div class={`text-xs text-${color}-400 font-mono`}>
							{">>>"} {segment.strategy}
						</div>
					</div>
				) : segment.costComparison ? (
					<div class="flex flex-col justify-center">
						<div class="flex items-stretch gap-4 text-center">
							<div class="flex-1 bg-gray-800 p-4 rounded-lg opacity-50 flex flex-col justify-center">
								<div class="text-xs text-gray-500">燃油车成本</div>
								<div class="text-xl font-bold text-gray-300">
									{segment.costComparison.ice}
								</div>
							</div>
							<div class="text-2xl font-bold text-gray-600 self-center">VS</div>
							<div
								class={`flex-1 bg-${color}-900/30 border border-${color}-500 p-4 rounded-lg shadow-lg shadow-${color}-900/20 flex flex-col justify-center`}
							>
								<div class="text-xs text-${color}-300">电动车成本</div>
								<div class="text-2xl font-bold text-white">
									{segment.costComparison.ev}
								</div>
								<div class={`text-xs text-${color}-500 font-mono mt-1`}>
									仅为油车的 {segment.costComparison.ratio}
								</div>
							</div>
						</div>
						<div class="mt-4 text-center text-sm text-gray-400 italic">
							"{segment.conclusion}"
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
