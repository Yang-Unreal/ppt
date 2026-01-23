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
			<div class="border border-red-500/30 rounded-2xl overflow-hidden hover:border-red-500 transition-all duration-300 group shadow-2xl shadow-red-900/10">
				{/* Large White Logo Header */}
				<div class="bg-white h-40 w-full p-6 flex items-center justify-center relative">
					{brand.logo ? (
						<img
							src={brand.logo}
							alt={brand.name}
							class="h-24 w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
						/>
					) : (
						<h3 class="text-4xl font-bold text-black">{brand.name}</h3>
					)}
				</div>

				{/* Premium Content Body */}
				<div class="p-8 bg-linear-to-b from-gray-900 to-black relative">
					<div class="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-red-500/50 to-transparent"></div>

					<div class="flex flex-col md:flex-row gap-8 items-start">
						<div class="flex-1">
							<h3 class="text-4xl font-bold text-white mb-4 tracking-tight">
								{brand.name}
							</h3>
							<p class="text-lg text-gray-400 leading-relaxed max-w-2xl">
								{brand.desc}
							</p>
						</div>

						{/* Stats Block */}
						<div class="flex gap-10 shrink-0 bg-white/5 p-6 rounded-xl border border-white/10">
							<div class="text-center">
								<div class="text-xs text-gray-500 uppercase tracking-widest mb-1">
									2025 产量
								</div>
								<div class="text-3xl font-mono font-bold text-cyan-400">
									{brand.yield2025}
								</div>
							</div>
							<div class="w-px bg-gray-700"></div>
							<div class="text-center">
								<div class="text-xs text-gray-500 uppercase tracking-widest mb-1">
									2026 规划
								</div>
								<div class="text-3xl font-mono font-bold text-red-500">
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
			<div class="flex flex-col border border-white/10 bg-white/5 rounded-xl overflow-hidden hover:border-white/30 transition-all duration-300 group">
				{/* White Logo Header */}
				<div class="bg-white h-32 w-full p-4 flex items-center justify-center">
					{brand.logo ? (
						<img
							src={brand.logo}
							alt={brand.name}
							class="h-20 w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
						/>
					) : (
						<span class="text-black font-bold text-xl opacity-20">NO LOGO</span>
					)}
				</div>

				{/* Content Body */}
				<div class="p-6 flex-1 flex flex-col">
					<div class="flex justify-between items-baseline mb-4">
						<h3 class="text-2xl font-bold text-white">{brand.name}</h3>
						<div class="text-sm font-mono bg-white/10 px-3 py-1 rounded text-cyan-200">
							{brand.yield2025} <span class="text-gray-500 mx-1">→</span>{" "}
							{brand.plan2026}
						</div>
					</div>

					<p class="text-sm text-gray-400 leading-relaxed mb-2">{brand.desc}</p>
				</div>
			</div>
		);
	}

	if (tier === 3) {
		return (
			<div class="flex flex-col border border-white/10 bg-white/5 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group">
				{/* Logo Row: Fixed container height (h-32) */}
				<div class="bg-white h-32 w-full p-4 flex items-center justify-center relative">
					{brand.logo ? (
						<img
							src={brand.logo}
							alt={brand.name}
							// Fixed height (h-20) ensures all logos stand equally tall.
							// w-auto maintains aspect ratio. max-w-full prevents overflow.
							class="h-20 w-auto max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
						/>
					) : (
						<span class="text-black font-bold text-xl opacity-20">NO LOGO</span>
					)}
				</div>

				{/* Content Body */}
				<div class="p-5 flex-1 flex flex-col">
					<div class="flex justify-between items-start mb-3">
						<h4 class="font-bold text-xl text-white truncate pr-2">
							{brand.name}
						</h4>
						<span class="text-xs font-mono text-cyan-300 bg-cyan-900/30 px-2 py-1 rounded border border-cyan-800 shrink-0">
							{brand.yield2025}
						</span>
					</div>

					<p class="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
						{brand.desc}
					</p>

					<div class="mt-auto pt-4 border-t border-white/10 flex justify-between items-center text-xs">
						<span class="text-gray-500 uppercase tracking-wider">
							2026 规划
						</span>
						<span class="text-white font-mono font-bold text-sm">
							{brand.plan2026}
						</span>
					</div>
				</div>
			</div>
		);
	}

	return null;
}
