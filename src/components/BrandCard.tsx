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
	if (tier === 1) {
		return (
			<div class="glass-card border border-[#222] hover:border-[#14F195] transition-all duration-500 group relative">
				{/* Decoration */}
				<div class="absolute top-0 right-0 w-32 h-32 bg-[#14F195] opacity-5 rounded-full blur-2xl pointer-events-none group-hover:opacity-10 transition-opacity"></div>

				<div class="flex flex-col lg:flex-row">
					{/* Logo Section */}
					<div class="lg:w-1/3 p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#222] bg-[#0a0a0a]">
						{brand.logo ? (
							<img
								src={brand.logo}
								alt={brand.name}
								class="h-24 w-auto max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
							/>
						) : (
							<h3 class="text-5xl font-bold text-white tracking-tighter">
								{brand.name}
							</h3>
						)}
					</div>

					{/* Content Section */}
					<div class="lg:w-2/3 p-10 flex flex-col justify-between">
						<div>
							<div class="flex items-center gap-4 mb-6">
								<h3 class="text-4xl font-bold text-white tracking-tight">
									{brand.name}
								</h3>
								<div class="h-px bg-[#333] flex-1"></div>
								<div class="text-[#14F195] text-xs font-mono border border-[#14F195]/30 px-3 py-1 rounded bg-[#14F195]/10">
									LEADER
								</div>
							</div>
							<p class="text-lg text-[#9e9e9e] leading-relaxed mb-8 max-w-2xl">
								{brand.desc}
							</p>
						</div>

						{/* Metrics */}
						<div class="grid grid-cols-2 gap-8 pt-8 border-t border-[#222]">
							<div>
								<div class="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-mono">
									2025 Yield
								</div>
								<div class="text-3xl font-mono font-bold text-white">
									{brand.yield2025}
								</div>
							</div>
							<div>
								<div class="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-mono">
									2026 Plan
								</div>
								<div class="text-3xl font-mono font-bold text-[#14F195]">
									{brand.plan2026}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (tier === 2) {
		return (
			<div class="glass-card flex flex-col hover:border-[#9945FF] group h-full">
				<div class="h-32 w-full p-6 flex items-center justify-center border-b border-[#222] bg-[#0a0a0a] relative overflow-hidden">
					{/* Hover Gradient */}
					<div class="absolute inset-0 bg-linear-to-tr from-[#9945FF]/0 to-[#9945FF]/0 group-hover:from-[#9945FF]/5 group-hover:to-transparent transition-all duration-500"></div>

					{brand.logo ? (
						<img
							src={brand.logo}
							alt={brand.name}
							class="h-16 w-auto max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 relative z-10"
						/>
					) : (
						<span class="text-gray-700 font-bold text-xl relative z-10">
							NO LOGO
						</span>
					)}
				</div>

				<div class="p-8 flex-1 flex flex-col">
					<div class="flex justify-between items-start mb-4">
						<h3 class="text-2xl font-bold text-white">{brand.name}</h3>
					</div>

					<p class="text-sm text-[#9e9e9e] leading-relaxed mb-6 flex-1">
						{brand.desc}
					</p>

					<div class="flex items-center justify-between text-xs font-mono pt-4 border-t border-[#222]">
						<div class="text-gray-500">Growth Target</div>
						<div class="flex items-center gap-2">
							<span class="text-white">{brand.yield2025}</span>
							<span class="text-[#9945FF]">→</span>
							<span class="text-[#9945FF] font-bold">{brand.plan2026}</span>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (tier === 3) {
		return (
			<div class="glass-card flex flex-col hover:border-white group h-full">
				<div class="h-24 w-full p-4 flex items-center justify-center border-b border-[#222] bg-[#0a0a0a]">
					{brand.logo ? (
						<img
							src={brand.logo}
							alt={brand.name}
							class="h-12 w-auto max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
						/>
					) : (
						<span class="text-gray-800 font-bold text-lg">NO LOGO</span>
					)}
				</div>

				<div class="p-6 flex-1 flex flex-col">
					<div class="flex justify-between items-center mb-4">
						<h4 class="font-bold text-lg text-white truncate">{brand.name}</h4>
						<span class="text-[10px] font-mono text-gray-500 border border-[#333] px-2 py-px rounded">
							{brand.yield2025}
						</span>
					</div>

					<p class="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed flex-1">
						{brand.desc}
					</p>

					<div class="mt-auto text-right">
						<span class="text-white font-mono font-bold text-xs group-hover:text-[#14F195] transition-colors">
							EXP: {brand.plan2026}
						</span>
					</div>
				</div>
			</div>
		);
	}

	return null;
}
