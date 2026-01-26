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
			<div class="border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-300 group overflow-hidden relative rounded-xl">
				{/* Background accent */}
				<div class="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-gray-100 transition-all"></div>

				<div class="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100 font-display relative z-10">
					{/* Logo Section */}
					<div class="lg:w-1/3 p-12 flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
						{brand.logo ? (
							<img
								src={brand.logo}
								alt={brand.name}
								class="h-24 w-auto max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
							/>
						) : (
							<h3 class="text-4xl font-bold text-gray-900 tracking-tighter">
								{brand.name}
							</h3>
						)}
					</div>

					{/* Content Section */}
					<div class="lg:w-2/3 p-8 lg:p-12">
						<div class="mb-10">
							<div class="flex items-center gap-4 mb-4">
								<span class="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase">
									Market Dominant / T1
								</span>
								<span class="w-8 h-px bg-gray-200"></span>
							</div>
							<h3 class="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tighter mb-6 group-hover:translate-x-1 transition-transform">
								{brand.name}
							</h3>
							<div class="space-y-4">
								<p class="text-gray-600 leading-relaxed font-light text-lg lg:text-xl max-w-2xl">
									{brand.desc.split("。")[0]}。
								</p>
								<div class="bg-gray-50 border-l-2 border-gray-200 p-4 lg:p-6">
									<p class="text-gray-500 text-sm italic font-light leading-relaxed">
										{brand.desc.split("。").slice(1).join("。")}
									</p>
								</div>
							</div>
						</div>

						{/* Metrics */}
						<div class="grid grid-cols-2 gap-8 lg:gap-12 pt-8 lg:pt-12 border-t border-gray-100">
							<div class="group/metric">
								<div class="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-mono group-hover/metric:text-gray-600 transition-colors">
									2025 Current
								</div>
								<div class="text-3xl lg:text-4xl font-mono font-bold text-gray-900 tracking-tighter flex items-baseline gap-2">
									{brand.yield2025}
									<span class="text-[9px] text-gray-300 font-normal">
										UNITS
									</span>
								</div>
							</div>
							<div class="group/metric">
								<div class="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-mono group-hover/metric:text-gray-600 transition-colors">
									2026 Target
								</div>
								<div class="text-3xl lg:text-4xl font-mono font-bold text-gray-900 tracking-tighter flex items-baseline gap-2">
									{brand.plan2026}
									<span class="text-[9px] text-gray-300 font-normal">PLAN</span>
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
			<div class="flex flex-col border border-gray-200 bg-white group hover:border-gray-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden rounded-xl">
				<div class="h-40 w-full p-8 flex items-center justify-center border-b border-gray-100 bg-gray-50 group-hover:bg-gray-100 transition-colors">
					{brand.logo ? (
						<img
							src={brand.logo}
							alt={brand.name}
							class="h-16 w-auto max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
						/>
					) : (
						<span class="text-gray-600 font-bold text-base font-mono tracking-widest">
							{brand.name}
						</span>
					)}
				</div>

				<div class="p-6 lg:p-8 flex-1 flex flex-col relative z-10">
					<div class="mb-8">
						<header class="flex justify-between items-center mb-4">
							<h3 class="text-2xl font-bold text-gray-900 tracking-tighter group-hover:text-gray-700 transition-colors truncate mr-2">
								{brand.name}
							</h3>
							<span class="text-[9px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 border border-gray-200 uppercase tracking-widest shrink-0 rounded">
								Tier 02
							</span>
						</header>
						<p class="text-gray-500 leading-relaxed font-light text-sm italic line-clamp-3">
							"{brand.desc}"
						</p>
					</div>

					<div class="mt-auto">
						<div class="h-1 w-full bg-gray-100 mb-4 overflow-hidden rounded-full">
							<div class="h-full bg-gray-400 w-1/2 group-hover:w-2/3 transition-all duration-1000"></div>
						</div>
						<div class="flex items-center justify-between font-mono gap-2">
							<div class="text-gray-400 text-[9px] uppercase tracking-widest truncate">
								Growth Velocity
							</div>
							<div class="text-gray-900 font-bold text-xs tracking-tighter shrink-0">
								{brand.yield2025} <span class="mx-1 text-gray-300">→</span>{" "}
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
			<div class="flex flex-col border border-gray-200 bg-white p-6 lg:p-8 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 h-full group rounded-xl">
				<div class="flex items-start justify-between mb-8">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 bg-gray-50 p-2 flex items-center justify-center shrink-0 border border-gray-200 group-hover:scale-105 transition-transform rounded-lg">
							{brand.logo ? (
								<img
									src={brand.logo}
									alt={brand.name}
									class="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0"
								/>
							) : (
								<span class="text-gray-500 font-bold text-[10px] font-mono">
									{brand.name.substring(0, 3).toUpperCase()}
								</span>
							)}
						</div>
						<div class="overflow-hidden">
							<h4 class="font-bold text-lg text-gray-900 tracking-tighter group-hover:translate-x-1 transition-transform truncate">
								{brand.name}
							</h4>
							<span class="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">
								Dynamic Player
							</span>
						</div>
					</div>
				</div>

				<p class="text-sm text-gray-500 mb-8 leading-relaxed font-light line-clamp-3 group-hover:text-gray-600 transition-colors">
					{brand.desc}
				</p>

				<div class="pt-6 border-t border-gray-100 flex justify-between items-end mt-auto gap-2">
					<div class="overflow-hidden">
						<span class="text-[8px] font-mono text-gray-400 uppercase tracking-widest block mb-1 truncate">
							Current Volume
						</span>
						<span class="text-gray-900 font-mono font-bold text-base truncate block">
							{brand.yield2025}
						</span>
					</div>
					<div class="text-right overflow-hidden">
						<span class="text-[8px] font-mono text-gray-400 uppercase tracking-widest block mb-1 truncate">
							2026 Plan
						</span>
						<span class="text-gray-600 font-mono font-bold text-base truncate block">
							{brand.plan2026}
						</span>
					</div>
				</div>
			</div>
		);
	}

	return null;
}
