import { Title } from "@solidjs/meta";
import { For } from "solid-js";
import BrandCard from "~/components/BrandCard";
import SegmentCard from "~/components/SegmentCard";
import { reportData } from "~/utils/data-loader";

export default function Report() {
	return (
		<main class="w-full min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
			<Title>{reportData.meta.title}</Title>

			{/* --- Section 01: Hero / Cover --- */}
			<section class="relative min-h-[90vh] flex flex-col justify-between px-6 py-8 lg:p-12 border-b border-gray-200 bg-white">
				{/* Background Grid */}
				<div class="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"></div>

				{/* Header */}
				<header class="relative z-10 flex justify-between items-start">
					<div class="flex flex-col gap-1">
						<span class="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">
							Internal Intelligence
						</span>
						<span class="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-900">
							Ref: {reportData.meta.date}
						</span>
					</div>
					<div class="text-right hidden md:block">
						<span class="text-[10px] font-mono uppercase tracking-widest text-gray-400 border border-gray-200 px-2 py-1 rounded">
							Confidential
						</span>
					</div>
				</header>

				{/* Main Title */}
				<div class="relative z-10 max-w-5xl mt-20">
					<h1 class="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter leading-[0.9] text-gray-900 mb-8">
						Vietnam
						<br />
						<span class="text-gray-300">EV Market</span>
						<br />
						2025-26
					</h1>
					<p class="max-w-xl text-lg text-gray-500 leading-relaxed font-light">
						A deep-dive analysis into the industrial shift from combustion to
						electric mobility in Southeast Asia's fastest-growing manufacturing
						hub.
					</p>
				</div>

				{/* Footer Meta */}
				<div class="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gray-100 mt-auto">
					<div>
						<span class="text-[10px] font-mono uppercase text-gray-400 block mb-1">
							Author
						</span>
						<span class="text-sm font-medium">{reportData.meta.author}</span>
					</div>
					<div>
						<span class="text-[10px] font-mono uppercase text-gray-400 block mb-1">
							Sector
						</span>
						<span class="text-sm font-medium">Automotive / Logistics</span>
					</div>
					<div>
						<span class="text-[10px] font-mono uppercase text-gray-400 block mb-1">
							Focus
						</span>
						<span class="text-sm font-medium">Supply Chain & Policy</span>
					</div>
					<div class="text-right">
						<div class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center ml-auto">
							<span class="block w-2 h-2 bg-gray-900 rounded-full animate-pulse"></span>
						</div>
					</div>
				</div>
			</section>

			{/* --- Section 02: Macro Overview (Bento Grid) --- */}
			<section class="px-6 py-16 lg:p-24 max-w-[1600px] mx-auto">
				<div class="mb-12 flex items-end gap-4">
					<span class="text-4xl font-medium tracking-tighter text-gray-900">
						01. Macro Context
					</span>
					<div class="h-px bg-gray-200 flex-1 mb-3"></div>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Text Block */}
					<div class="lg:col-span-6 swiss-card p-10 flex flex-col justify-center bg-white">
						<h3 class="text-2xl font-medium mb-6 tracking-tight">
							The Window of Opportunity
						</h3>
						<p class="text-gray-500 leading-relaxed mb-8">
							{reportData.marketOverview.status}
						</p>
						<div class="mt-auto pt-8 border-t border-gray-100">
							<span class="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2 block">
								Key Driver
							</span>
							<p class="text-gray-900 font-medium">
								"{reportData.marketOverview.banPusher}"
							</p>
						</div>
					</div>

					{/* Stats Column 1 */}
					<div class="lg:col-span-3 flex flex-col gap-6">
						<div class="swiss-card p-8 bg-white flex-1 flex flex-col justify-center group hover:border-gray-400">
							<span class="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-4">
								Total Holding
							</span>
							<span class="text-5xl font-semibold tracking-tighter text-gray-900">
								{reportData.marketOverview.totalHolding.split("万")[0]}
								<span class="text-2xl text-gray-400">M</span>
							</span>
							<span class="text-xs text-gray-400 mt-2">
								Units in circulation
							</span>
						</div>
						<div class="swiss-card p-8 bg-white flex-1 flex flex-col justify-center group hover:border-gray-400">
							<span class="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-4">
								Annual Output
							</span>
							<span class="text-5xl font-semibold tracking-tighter text-gray-900">
								{reportData.marketOverview.annualProduction.split("万")[0]}
								<span class="text-2xl text-gray-400">M</span>
							</span>
							<span class="text-xs text-gray-400 mt-2">
								Production capacity
							</span>
						</div>
					</div>

					{/* Stats Column 2 (Dominance) */}
					<div class="lg:col-span-3 swiss-card p-8 bg-[#171717] text-white flex flex-col justify-between relative overflow-hidden">
						<div class="relative z-10">
							<span class="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2 block">
								Dominant Force
							</span>
							<h3 class="text-2xl font-bold mb-1">Honda</h3>
							<p class="text-sm text-gray-400">Incumbent Resistance</p>
						</div>

						<div class="relative z-10 text-right">
							<span class="text-7xl font-bold tracking-tighter">
								70<span class="text-3xl">%</span>
							</span>
							<span class="block text-[10px] font-mono uppercase tracking-widest text-gray-500">
								Market Share
							</span>
						</div>

						{/* Abstract Graphic */}
						<div class="absolute -bottom-10 -left-10 w-40 h-40 bg-gray-800 rounded-full blur-2xl opacity-50"></div>
					</div>
				</div>
			</section>

			{/* --- Section 03: Geographic Clusters --- */}
			<section class="bg-white border-y border-gray-200 py-16 lg:py-24">
				<div class="max-w-[1600px] mx-auto px-6">
					<div class="grid grid-cols-1 lg:grid-cols-3 gap-16">
						{/* Section Header */}
						<div>
							<span class="text-sm font-mono text-gray-400 uppercase mb-4 block">
								02. Geography
							</span>
							<h2 class="text-3xl font-medium tracking-tighter text-gray-900 mb-6">
								Industrial Clusters
							</h2>
							<p class="text-gray-500 leading-relaxed">
								Supply chain density is heavily concentrated in the North,
								creating an efficient loop between raw materials and assembly.
							</p>
						</div>

						{/* Clusters List */}
						<div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
							<For each={reportData.marketOverview.clusters}>
								{(cluster) => (
									<div class="border-t border-gray-200 pt-6">
										<h3 class="text-xl font-medium text-gray-900 mb-2">
											{cluster.name}
										</h3>
										<p class="text-xs font-mono text-gray-400 uppercase tracking-wider mb-6">
											{cluster.desc}
										</p>

										<div class="space-y-6">
											<div>
												<span class="text-[10px] text-gray-400 font-bold uppercase block mb-2">
													OEM Presence
												</span>
												<div class="flex flex-wrap gap-2">
													<For each={cluster.brands}>
														{(brand) => (
															<span class="text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded text-gray-700">
																{brand}
															</span>
														)}
													</For>
												</div>
											</div>

											{cluster.suppliers && (
												<div>
													<span class="text-[10px] text-gray-400 font-bold uppercase block mb-2">
														Supply Base
													</span>
													<div class="grid grid-cols-2 gap-y-1">
														<For each={cluster.suppliers}>
															{(supplier) => (
																<span class="text-xs text-gray-500 truncate block border-l-2 border-transparent hover:border-gray-300 pl-2 transition-all">
																	{supplier}
																</span>
															)}
														</For>
													</div>
												</div>
											)}
										</div>
									</div>
								)}
							</For>
						</div>
					</div>
				</div>
			</section>

			{/* --- Section 04: Competition --- */}
			<section class="px-6 py-24 max-w-[1600px] mx-auto">
				<div class="mb-16">
					<h2 class="text-4xl font-medium tracking-tighter text-gray-900">
						Competitive Landscape
					</h2>
				</div>

				<div class="space-y-16">
					<For each={reportData.competition.tiers}>
						{(tier, idx) => (
							<div>
								<div class="flex items-baseline gap-4 mb-6 border-b border-gray-200 pb-2">
									<span class="text-lg font-mono font-medium text-gray-900">
										Tier 0{idx() + 1}
									</span>
									<span class="text-sm text-gray-400">{tier.name}</span>
								</div>

								<div
									class={`grid gap-6 ${idx() === 2 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 lg:grid-cols-3"}`}
								>
									<For each={tier.brands}>
										{(brand) => (
											<BrandCard
												brand={brand}
												tier={(idx() + 1) as 1 | 2 | 3}
											/>
										)}
									</For>
								</div>
							</div>
						)}
					</For>
				</div>
			</section>

			{/* --- Section 05: Segments --- */}
			<section class="bg-gray-50 border-t border-gray-200 py-24">
				<div class="max-w-[1600px] mx-auto px-6">
					<div class="mb-12">
						<span class="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-2">
							04. Strategy
						</span>
						<h2 class="text-3xl font-medium tracking-tighter text-gray-900">
							Market Segmentation
						</h2>
					</div>

					<div class="grid gap-8">
						<SegmentCard segment={reportData.segments[0]} />
						<SegmentCard segment={reportData.segments[1]} />
						<SegmentCard segment={reportData.segments[2]} />
					</div>
				</div>
			</section>

			{/* --- Section 06: Infrastructure & Risks --- */}
			<section class="px-6 py-24 max-w-[1600px] mx-auto">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
					{/* Column 1: Infrastructure List */}
					<div>
						<h3 class="text-xl font-medium tracking-tight mb-8">
							Supply Chain Dynamics
						</h3>
						<div class="space-y-4">
							<For each={reportData.infrastructure.supplyChain.details}>
								{(detail) => (
									<div class="flex justify-between items-start py-4 border-b border-gray-100">
										<span class="text-sm font-medium text-gray-900 w-1/3">
											{detail.label}
										</span>
										<span class="text-sm text-gray-500 w-2/3 text-right">
											{detail.value}
										</span>
									</div>
								)}
							</For>

							<div class="mt-12"></div>
							<h3 class="text-xl font-medium tracking-tight mb-8">
								Operational Barriers
							</h3>
							<For each={reportData.infrastructure.operations.details}>
								{(detail) => (
									<div class="flex justify-between items-start py-4 border-b border-gray-100">
										<span class="text-sm font-medium text-gray-900 w-1/3">
											{detail.label}
										</span>
										<span class="text-sm text-gray-500 w-2/3 text-right">
											{detail.value}
										</span>
									</div>
								)}
							</For>
						</div>
					</div>

					{/* Column 2: Risks Card */}
					<div class="bg-[#111111] text-white rounded-2xl p-10 lg:p-16 flex flex-col relative overflow-hidden">
						{/* Subtle Noise Texture */}
						<div
							class="absolute inset-0 opacity-10"
							style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+');"
						></div>

						<div class="relative z-10">
							<span class="text-xs font-mono text-red-500 uppercase tracking-widest mb-6 block">
								Critical Warning
							</span>
							<h3 class="text-4xl font-semibold tracking-tighter mb-12">
								Strategic Risks
							</h3>

							<div class="space-y-12">
								<div>
									<h4 class="text-lg font-medium mb-3 border-l-2 border-red-500 pl-4">
										Protectionism
									</h4>
									<p class="text-gray-400 leading-relaxed font-light text-sm">
										{reportData.risks.protective.desc}
									</p>
								</div>
								<div>
									<h4 class="text-lg font-medium mb-3 border-l-2 border-white pl-4">
										IP Security
									</h4>
									<p class="text-gray-400 leading-relaxed font-light text-sm">
										{reportData.risks.ip.desc}
									</p>
								</div>
							</div>
						</div>

						<div class="mt-auto pt-16 relative z-10">
							<div class="w-full h-px bg-gray-800 mb-6"></div>
							<div class="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-gray-500">
								<span>Internal Use Only</span>
								<span>End of Section</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* --- Footer --- */}
			<footer class="bg-white border-t border-gray-200 py-12 text-center">
				<span class="text-2xl font-bold tracking-tighter text-gray-900">
					2026
				</span>
				<span class="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mt-2">
					Vietnam EV Research Report
				</span>
			</footer>
		</main>
	);
}
