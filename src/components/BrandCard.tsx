interface Brand {
	name: string;
	logo?: string;
	desc: string;
	yield2025: string;
	plan2026: string;
}

interface BrandCardProps {
	brand: Brand;
	tier: 1 | 2 | 3;
}

export default function BrandCard({ brand, tier }: BrandCardProps) {
	// Tier 1: Dominant / Full Width Bento
	if (tier === 1) {
		return (
			<div class="col-span-1 md:col-span-2 lg:col-span-3 swiss-card swiss-card-shadow p-8 flex flex-col md:flex-row gap-8 items-start group hover:border-gray-400 transition-colors duration-300">
				<div class="flex-shrink-0 w-full md:w-64 h-full flex flex-col justify-between">
					<div class="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center mb-6">
						{brand.logo ? (
							<img
								src={brand.logo}
								alt={brand.name}
								class="h-8 w-auto object-contain mix-blend-multiply opacity-80"
							/>
						) : (
							<span class="text-xl font-bold tracking-tighter">
								{brand.name.charAt(0)}
							</span>
						)}
					</div>
					<div>
						<span class="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1 block">
							Entity
						</span>
						<h3 class="text-2xl font-semibold tracking-tight text-gray-900">
							{brand.name}
						</h3>
					</div>
				</div>

				<div class="flex-1 flex flex-col justify-between h-full pt-2">
					<p class="text-gray-500 text-lg font-normal leading-relaxed max-w-2xl mb-8">
						{brand.desc}
					</p>

					<div class="flex items-center gap-12 border-t border-gray-100 pt-6 mt-auto">
						<div>
							<span class="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-1">
								Current Yield
							</span>
							<span class="text-xl font-mono font-medium text-gray-900">
								{brand.yield2025}
							</span>
						</div>
						<div>
							<span class="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-1">
								2026 Target
							</span>
							<span class="text-xl font-mono font-medium text-gray-900">
								{brand.plan2026}
							</span>
						</div>
					</div>
				</div>

				{/* Decorative ID */}
				<div class="absolute top-4 right-4 text-[9px] font-mono text-gray-300">
					T1.01
				</div>
			</div>
		);
	}

	// Tier 2: Vertical Card
	if (tier === 2) {
		return (
			<div class="swiss-card p-6 flex flex-col h-full hover:shadow-md transition-all duration-300">
				<div class="flex justify-between items-start mb-6">
					<div class="w-10 h-10 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center">
						{brand.logo ? (
							<img
								src={brand.logo}
								alt={brand.name}
								class="h-4 w-auto object-contain opacity-80"
							/>
						) : (
							<span class="text-sm font-bold">
								{brand.name.substring(0, 2)}
							</span>
						)}
					</div>
					<span class="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-[10px] font-mono text-gray-400 uppercase tracking-wider">
						Challenger
					</span>
				</div>

				<h3 class="text-lg font-semibold tracking-tight text-gray-900 mb-2">
					{brand.name}
				</h3>
				<p class="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
					{brand.desc}
				</p>

				<div class="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
					<div>
						<span class="text-[9px] font-mono uppercase tracking-widest text-gray-400 block mb-1">
							Vol
						</span>
						<span class="text-sm font-mono font-medium text-gray-900">
							{brand.yield2025}
						</span>
					</div>
					<div class="text-right">
						<span class="text-[9px] font-mono uppercase tracking-widest text-gray-400 block mb-1">
							Plan
						</span>
						<span class="text-sm font-mono font-medium text-gray-900">
							{brand.plan2026}
						</span>
					</div>
				</div>
			</div>
		);
	}

	// Tier 3: Compact Row / Tile
	return (
		<div class="swiss-card p-5 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
			<div class="flex items-center gap-4">
				<div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
					{brand.name.substring(0, 1)}
				</div>
				<div>
					<h4 class="text-sm font-semibold text-gray-900">{brand.name}</h4>
					<span class="text-[10px] text-gray-400 font-mono">
						Dynamic Player
					</span>
				</div>
			</div>
			<div class="text-right">
				<span class="block text-sm font-mono font-medium text-gray-900">
					{brand.yield2025}
				</span>
			</div>
		</div>
	);
}
