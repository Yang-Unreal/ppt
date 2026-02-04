import { For } from "solid-js";

interface Model {
	name: string;
	price: string;
	rmbPrice?: string;
	spec: string;
	speedRange: string;
	image: string;
	note?: string;
}

interface Brand {
	name: string;
	logo?: string;
	desc: string;
	yield2025: string;
	plan2026: string;
	models?: Model[];
	tag?: string;
}

interface BrandCardProps {
	brand: Brand;
	tier: 1 | 2 | 3;
}

export default function BrandCard({ brand, tier }: BrandCardProps) {
	// Tier 1: Dominant
	if (tier === 1) {
		return (
			<div class="col-span-1 md:col-span-2 lg:col-span-3 swiss-card p-10 flex flex-col md:flex-row gap-12 items-start group hover:border-gray-400 relative">
				{brand.tag && (
					<span class="absolute top-6 right-6 px-2 py-1 bg-[#d3fd50] text-black rounded text-xs font-bold uppercase tracking-widest leading-none">
						{brand.tag}
					</span>
				)}
				<div class="shrink-0 w-full md:w-64 h-full flex flex-col justify-between">
					<div class="w-full h-32 bg-white border border-gray-200 rounded flex items-center justify-start mb-8 p-6">
						{brand.logo ? (
							<img
								src={brand.logo}
								alt={brand.name}
								class="h-full w-auto object-contain object-left mix-blend-multiply"
							/>
						) : (
							<span class="text-4xl font-bold tracking-tighter">
								{brand.name.charAt(0)}
							</span>
						)}
					</div>
					<div>
						<span class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
							实体
						</span>
						<h3 class="text-3xl font-medium tracking-tighter text-black">
							{brand.name}
						</h3>
					</div>
				</div>

				<div class="flex-1 flex flex-col justify-between h-full pt-2">
					<p class="text-gray-600 text-base font-light leading-relaxed max-w-2xl mb-10">
						{brand.desc}
					</p>

					<div class="flex items-center gap-16 border-t border-gray-100 pt-8 mt-auto">
						<div>
							<span class="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">
								当前产量
							</span>
							<span class="text-2xl font-mono text-black">
								{brand.yield2025}
							</span>
						</div>
						<div>
							<span class="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">
								2026目标
							</span>
							<span class="text-2xl font-mono text-black">
								{brand.plan2026}
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Tier 2: Challenger
	if (tier === 2) {
		return (
			<div class="swiss-card p-8 flex flex-col h-full hover:border-black transition-colors duration-300">
				<div class="flex justify-between items-start mb-8">
					<div class="w-48 h-20 bg-white border border-gray-200 rounded flex items-center justify-start px-4">
						{brand.logo ? (
							<img
								src={brand.logo}
								alt={brand.name}
								class="h-full w-auto object-contain object-left mix-blend-multiply"
							/>
						) : (
							<span class="text-xl font-bold">
								{brand.name.substring(0, 1)}
							</span>
						)}
					</div>
					{/* Accent Usage: Tier Badge */}
					<span class="px-2 py-1 bg-[#d3fd50] text-black rounded text-xs font-bold uppercase tracking-widest">
						{brand.tag || "挑战者"}
					</span>
				</div>

				<h3 class="text-xl font-medium tracking-tight text-black mb-3">
					{brand.name}
				</h3>
				<p class="text-gray-500 text-base leading-relaxed mb-8 font-light">
					{brand.desc}
				</p>

				<div class="mt-auto pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
					<div>
						<span class="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">
							产量
						</span>
						<span class="text-sm font-mono text-black">{brand.yield2025}</span>
					</div>
					<div class="text-right">
						<span class="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">
							规划
						</span>
						<span class="text-sm font-mono text-black">{brand.plan2026}</span>
					</div>
				</div>
			</div>
		);
	}

	// Tier 3: Compact
	return (
		<div class="swiss-card p-6 flex items-center justify-between group hover:bg-gray-50 transition-colors">
			<div class="flex items-center gap-6">
				<div class="w-32 h-14 rounded bg-gray-100 flex items-center justify-start text-sm font-bold text-gray-400 overflow-hidden border border-gray-100 p-2">
					{brand.logo ? (
						<img
							src={brand.logo}
							alt={brand.name}
							class="h-full w-auto object-contain object-left mix-blend-multiply"
						/>
					) : (
						<span class="text-lg">{brand.name.substring(0, 1)}</span>
					)}
				</div>
				<div>
					<h4 class="text-sm font-medium text-black">{brand.name}</h4>
					<span class="text-xs text-gray-400 font-mono tracking-wide block">
						{brand.desc}
					</span>
				</div>
			</div>
			<div class="text-right">
				<span class="block text-sm font-mono text-black">
					{brand.yield2025}
				</span>
				<span class="block text-xs text-gray-400 font-mono">
					目标: {brand.plan2026}
				</span>
			</div>
		</div>
	);
}
