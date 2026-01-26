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
			<div class="border border-zinc-900 bg-black hover:border-zinc-700 transition-all duration-300 group overflow-hidden relative">
				{/* Background accent */}
				<div class="absolute top-0 right-0 w-32 h-32 bg-zinc-900/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-zinc-800/20 transition-all"></div>

				<div class="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-zinc-900 font-display relative z-10">
					{/* Logo Section */}
					<div class="lg:w-1/3 p-12 flex items-center justify-center bg-white group-hover:bg-zinc-50 transition-colors">
						{brand.logo ? (
							<img
								src={brand.logo}
								alt={brand.name}
								class="h-24 w-auto max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
							/>
						) : (
							<h3 class="text-4xl font-bold text-black tracking-tighter">
								{brand.name}
							</h3>
						)}
					</div>

					{/* Content Section */}
					<div class="lg:w-2/3 p-8 lg:p-12">
						<div class="mb-10">
							<div class="flex items-center gap-4 mb-4">
								<span class="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">
									Market Dominant / T1
								</span>
								<span class="w-8 h-px bg-zinc-800"></span>
							</div>
							<h3 class="text-4xl lg:text-5xl font-bold text-white tracking-tighter mb-6 group-hover:translate-x-1 transition-transform">
								{brand.name}
							</h3>
							<div class="space-y-4">
								<p class="text-zinc-400 leading-relaxed font-light text-lg lg:text-xl max-w-2xl">
									{brand.desc.split("。")[0]}。
								</p>
								<div class="bg-zinc-950/80 border-l-2 border-zinc-800 p-4 lg:p-6 backdrop-blur-sm">
									<p class="text-zinc-500 text-sm italic font-light leading-relaxed">
										{brand.desc.split("。").slice(1).join("。")}
									</p>
								</div>
							</div>
						</div>

						{/* Metrics */}
						<div class="grid grid-cols-2 gap-8 lg:gap-12 pt-8 lg:pt-12 border-t border-zinc-900">
							<div class="group/metric">
								<div class="text-[10px] text-zinc-600 uppercase tracking-widest mb-2 font-mono group-hover/metric:text-zinc-400 transition-colors">
									2025 Current
								</div>
								<div class="text-3xl lg:text-4xl font-mono font-bold text-white tracking-tighter flex items-baseline gap-2">
									{brand.yield2025}
									<span class="text-[9px] text-zinc-800 font-normal">
										UNITS
									</span>
								</div>
							</div>
							<div class="group/metric">
								<div class="text-[10px] text-zinc-600 uppercase tracking-widest mb-2 font-mono group-hover/metric:text-zinc-400 transition-colors">
									2026 Target
								</div>
								<div class="text-3xl lg:text-4xl font-mono font-bold text-white tracking-tighter flex items-baseline gap-2">
									{brand.plan2026}
									<span class="text-[9px] text-zinc-800 font-normal">PLAN</span>
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
			<div class="flex flex-col border border-zinc-900 bg-black group hover:border-zinc-700 transition-all duration-300 relative overflow-hidden">
				<div class="h-40 w-full p-8 flex items-center justify-center border-b border-zinc-900 bg-white group-hover:bg-zinc-50 transition-colors">
					{brand.logo ? (
						<img
							src={brand.logo}
							alt={brand.name}
							class="h-16 w-auto max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
						/>
					) : (
						<span class="text-zinc-400 font-bold text-base font-mono tracking-widest">
							{brand.name}
						</span>
					)}
				</div>

				<div class="p-6 lg:p-8 flex-1 flex flex-col relative z-10">
					<div class="mb-8">
						<header class="flex justify-between items-center mb-4">
							<h3 class="text-2xl font-bold text-white tracking-tighter group-hover:text-zinc-200 transition-colors truncate mr-2">
								{brand.name}
							</h3>
							<span class="text-[9px] font-mono text-zinc-600 bg-zinc-950 px-2 py-0.5 border border-zinc-900 uppercase tracking-widest shrink-0">
								Tier 02
							</span>
						</header>
						<p class="text-zinc-400 leading-relaxed font-light text-sm italic line-clamp-3">
							"{brand.desc}"
						</p>
					</div>

					<div class="mt-auto">
						<div class="h-1 w-full bg-zinc-900 mb-4 overflow-hidden">
							<div class="h-full bg-zinc-600 w-1/2 group-hover:w-2/3 transition-all duration-1000"></div>
						</div>
						<div class="flex items-center justify-between font-mono gap-2">
							<div class="text-zinc-700 text-[9px] uppercase tracking-widest truncate">
								Growth Velocity
							</div>
							<div class="text-white font-bold text-xs tracking-tighter shrink-0">
								{brand.yield2025} <span class="mx-1 text-zinc-800">→</span>{" "}
								{brand.plan2026}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (tier === 3) {
		return (
			<div class="flex flex-col border border-zinc-900 bg-[#050505] p-6 lg:p-8 hover:bg-zinc-950 hover:border-zinc-800 transition-all duration-300 h-full group">
				<div class="flex items-start justify-between mb-8">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 bg-white p-2 flex items-center justify-center shrink-0 border border-zinc-900 group-hover:scale-105 transition-transform">
							{brand.logo ? (
								<img
									src={brand.logo}
									alt={brand.name}
									class="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0"
								/>
							) : (
								<span class="text-zinc-800 font-bold text-[10px] font-mono">
									{brand.name.substring(0, 3).toUpperCase()}
								</span>
							)}
						</div>
						<div class="overflow-hidden">
							<h4 class="font-bold text-lg text-white tracking-tighter group-hover:translate-x-1 transition-transform truncate">
								{brand.name}
							</h4>
							<span class="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block">
								Dynamic Player
							</span>
						</div>
					</div>
				</div>

				<p class="text-sm text-zinc-500 mb-8 leading-relaxed font-light line-clamp-3 group-hover:text-zinc-400 transition-colors">
					{brand.desc}
				</p>

				<div class="pt-6 border-t border-zinc-900 flex justify-between items-end mt-auto gap-2">
					<div class="overflow-hidden">
						<span class="text-[8px] font-mono text-zinc-700 uppercase tracking-widest block mb-1 truncate">
							Current Volume
						</span>
						<span class="text-white font-mono font-bold text-base truncate block">
							{brand.yield2025}
						</span>
					</div>
					<div class="text-right overflow-hidden">
						<span class="text-[8px] font-mono text-zinc-700 uppercase tracking-widest block mb-1 truncate">
							2026 Plan
						</span>
						<span class="text-zinc-400 font-mono font-bold text-base truncate block">
							{brand.plan2026}
						</span>
					</div>
				</div>
			</div>
		);
	}

	return null;
}
