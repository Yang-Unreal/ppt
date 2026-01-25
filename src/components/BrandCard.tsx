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
			<div class="border border-zinc-900 bg-black hover:border-zinc-700 transition-all duration-300 group overflow-hidden">
				<div class="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-zinc-900 font-display">
					{/* Logo Section */}
					<div class="lg:w-1/3 p-12 flex items-center justify-center bg-white group-hover:bg-zinc-50 transition-colors">
						{brand.logo ? (
							<img
								src={brand.logo}
								alt={brand.name}
								class="h-24 w-auto max-w-full object-contain"
							/>
						) : (
							<h3 class="text-4xl font-bold text-black tracking-tighter">
								{brand.name}
							</h3>
						)}
					</div>

					{/* Content Section */}
					<div class="lg:w-2/3 p-12">
						<div class="mb-12">
							<div class="inline-block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-4">
								Market Leader / Tier 01
							</div>
							<h3 class="text-5xl font-bold text-white tracking-tighter mb-6 decoration-zinc-800">
								{brand.name}
							</h3>
							<p class="text-zinc-400 leading-relaxed font-light text-xl max-w-2x pt-5">
								{brand.desc}
							</p>
						</div>

						{/* Metrics */}
						<div class="grid grid-cols-2 gap-12 pt-12 border-t border-zinc-900">
							<div>
								<div class="text-[10px] text-zinc-600 uppercase tracking-widest mb-3 font-mono">
									2025 Yield
								</div>
								<div class="text-4xl font-mono font-bold text-white tracking-tighter">
									{brand.yield2025}
								</div>
							</div>
							<div>
								<div class="text-[10px] text-zinc-600 uppercase tracking-widest mb-3 font-mono">
									2026 Target
								</div>
								<div class="text-4xl font-mono font-bold text-white tracking-tighter">
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
			<div class="flex flex-col border border-zinc-900 bg-black group hover:border-zinc-700 transition-all duration-300">
				<div class="h-40 w-full p-8 flex items-center justify-center border-b border-zinc-900 bg-white">
					{brand.logo ? (
						<img
							src={brand.logo}
							alt={brand.name}
							class="h-16 w-auto max-w-full object-contain"
						/>
					) : (
						<span class="text-zinc-700 font-bold text-lg font-mono">
							NO LOGO
						</span>
					)}
				</div>

				<div class="p-10 flex-1 flex flex-col">
					<div class="mb-8">
						<header class="flex justify-between items-baseline mb-4">
							<h3 class="text-2xl font-bold text-white tracking-tight">
								{brand.name}
							</h3>
							<span class="text-[10px] font-mono text-zinc-600 tracking-widest">
								T2
							</span>
						</header>
						<p class="text-sm text-zinc-500 leading-relaxed font-light">
							{brand.desc}
						</p>
					</div>

					<div class="mt-auto pt-8 border-t border-zinc-900 flex items-center justify-between font-mono">
						<div class="text-zinc-700 text-[10px] uppercase tracking-widest">
							Expansion
						</div>
						<div class="text-white font-bold text-sm tracking-tighter">
							{brand.yield2025} <span class="mx-2 text-zinc-800">/</span>{" "}
							{brand.plan2026}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (tier === 3) {
		return (
			<div class="flex flex-col border border-zinc-900 bg-black p-8 hover:bg-zinc-950 hover:border-zinc-800 transition-all duration-300 h-full">
				<div class="flex items-center gap-6 mb-8">
					<div class="w-16 h-16 bg-white p-3 flex items-center justify-center shrink-0 border border-zinc-900">
						{brand.logo ? (
							<img
								src={brand.logo}
								alt={brand.name}
								class="max-w-full max-h-full object-contain"
							/>
						) : (
							<span class="text-zinc-800 font-bold text-[10px] font-mono leading-none">
								{brand.name.substring(0, 3)}
							</span>
						)}
					</div>
					<div class="overflow-hidden">
						<h4 class="font-bold text-xl text-white tracking-tighter truncate">
							{brand.name}
						</h4>
						<span class="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
							Growth Sector
						</span>
					</div>
				</div>

				<p class="text-xs text-zinc-500 mb-8 line-clamp-3 leading-relaxed flex-1 font-light italic">
					{brand.desc}
				</p>

				<div class="pt-6 border-t border-zinc-900 flex justify-between items-center">
					<span class="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
						Est Yield
					</span>
					<span class="text-white font-mono font-bold text-xs">
						{brand.yield2025}
					</span>
				</div>
			</div>
		);
	}

	return null;
}
