import { Title } from "@solidjs/meta";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { For, onMount } from "solid-js";
import { reportData } from "~/utils/data-loader";

gsap.registerPlugin(ScrollTrigger);

export default function Report() {
	let heroRef: HTMLDivElement | undefined;
	let overviewRef: HTMLDivElement | undefined;
	let clustersRef: HTMLDivElement | undefined;
	let competitionRef: HTMLDivElement | undefined;
	let segmentsRef: HTMLDivElement | undefined;
	let supplyRef: HTMLDivElement | undefined;
	let risksRef: HTMLDivElement | undefined;

	onMount(() => {
		// Standard fade-in animations
		const sections = [
			overviewRef,
			clustersRef,
			competitionRef,
			segmentsRef,
			supplyRef,
			risksRef,
		];

		sections.forEach((ref) => {
			if (!ref) return;
			gsap.from(ref.children, {
				scrollTrigger: {
					trigger: ref,
					start: "top 80%",
				},
				y: 30,
				opacity: 0,
				duration: 0.8,
				stagger: 0.1,
				ease: "power2.out",
			});
		});
	});

	return (
		<main class="w-full min-h-screen bg-black text-white selection:bg-cyan-900 selection:text-white pb-20">
			<Title>{reportData.meta.title}</Title>

			{/* Hero Section */}
			<section
				ref={heroRef}
				class="section-container min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
			>
				<div class="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-900/20 via-black to-black -z-10"></div>
				<div class="max-w-5xl px-6">
					<h2 class="hero-subtitle text-xl md:text-2xl text-cyan-400 font-medium tracking-widest uppercase mb-4 animate-pulse">
						{reportData.meta.subtitle}
					</h2>
					<h1 class="hero-title text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-gray-600 mb-8 leading-none">
						2025-2026
						<br />
						越南电动车市场
					</h1>
					<div class="hero-meta flex justify-center items-center gap-6 text-gray-400 font-mono text-sm md:text-base">
						<span>{reportData.meta.date}</span>
						<span class="w-1 h-1 bg-gray-600 rounded-full"></span>
						<span>{reportData.meta.author}</span>
					</div>
				</div>
			</section>

			{/* Macro Overview */}
			<section ref={overviewRef} class="section-container relative z-10 py-24">
				<div class="max-w-7xl w-full px-6">
					<div class="border-l-4 border-cyan-500 pl-6 mb-12">
						<h2 class="text-3xl md:text-5xl font-bold mb-2">市场宏观概况</h2>
						<p class="text-xl text-gray-400">
							{reportData.marketOverview.status}
						</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
						<div class="glass-card p-8 hover:border-cyan-500/50 transition-colors">
							<span class="text-gray-500 text-sm uppercase tracking-wider block mb-4">
								社会保有量
							</span>
							<span class="text-6xl font-bold text-white block mb-2">
								{reportData.marketOverview.totalHolding}
							</span>
							<span class="text-xs text-gray-500">东南亚最高之一</span>
						</div>
						<div class="glass-card p-8 hover:border-purple-500/50 transition-colors">
							<span class="text-gray-500 text-sm uppercase tracking-wider block mb-4">
								年总产量
							</span>
							<span class="text-6xl font-bold text-white block mb-2">
								{reportData.marketOverview.annualProduction}
							</span>
							<span class="text-xs text-gray-500">目前产能保持稳定</span>
						</div>
						<div class="glass-card p-8 hover:border-red-500/50 transition-colors">
							<span class="text-gray-500 text-sm uppercase tracking-wider block mb-4">
								主要竞争
							</span>
							<span class="text-6xl font-bold text-white block mb-2">70%</span>
							<span class="text-xs text-gray-500">
								{reportData.marketOverview.dominantPlayer}
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Geographic Clusters */}
			<section ref={clustersRef} class="section-container bg-zinc-900/30 py-24">
				<div class="max-w-7xl w-full px-6">
					<h3 class="text-2xl text-cyan-400 font-mono mb-8">
						产业布局地理分布
					</h3>
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
						<For each={reportData.marketOverview.clusters}>
							{(cluster) => (
								<div class="border border-white/10 bg-black/50 p-8 rounded-2xl relative overflow-hidden group">
									<div class="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
									<h4 class="text-2xl font-bold mb-2">{cluster.name}</h4>
									<p class="text-gray-400 mb-6 italic">{cluster.desc}</p>

									<div class="space-y-4">
										<div>
											<span class="text-xs text-gray-500 uppercase block mb-2">
												主要整车厂
											</span>
											<div class="flex flex-wrap gap-2">
												<For each={cluster.brands}>
													{(brand) => (
														<span class="bg-gray-800 border border-gray-700 px-3 py-1 rounded text-sm">
															{brand}
														</span>
													)}
												</For>
											</div>
										</div>
										{cluster.suppliers && (
											<div>
												<span class="text-xs text-gray-500 uppercase block mb-2">
													关键配套
												</span>
												<div class="flex flex-wrap gap-2">
													<For each={cluster.suppliers}>
														{(supplier) => (
															<span class="bg-indigo-900/30 border border-indigo-500/30 px-3 py-1 rounded text-sm text-indigo-300">
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
			</section>

			{/* Comprehensive Competition League Table */}
			<section ref={competitionRef} class="section-container py-24">
				<div class="max-w-7xl w-full px-6">
					<h2 class="text-4xl font-bold mb-12 flex items-center gap-4">
						竞争格局全景
					</h2>

					{/* Tier 1 */}
					<div class="mb-12">
						<div class="text-xl font-bold text-gray-500 mb-4 border-b border-gray-800 pb-2">
							Tier 1: 绝对统领
						</div>
						<For each={reportData.competition.tiers[0].brands}>
							{(brand) => (
								<div class="border border-red-500/30 rounded-2xl overflow-hidden hover:border-red-500 transition-all duration-300 group shadow-2xl shadow-red-900/10">
									{/* 1. Large White Logo Header */}
									<div class="bg-white h-40 w-full p-6 flex items-center justify-center relative">
										{brand.logo ? (
											<img
												src={brand.logo}
												alt={brand.name}
												class="h-24 w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
											/>
										) : (
											<h3 class="text-4xl font-bold text-black">
												{brand.name}
											</h3>
										)}
									</div>

									{/* 2. Premium Content Body */}
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
							)}
						</For>
					</div>

					{/* Tier 2 */}
					<div class="mb-12">
						<div class="text-xl font-bold text-gray-500 mb-4 border-b border-gray-800 pb-2">
							Tier 2: 强势竞对
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
							<For each={reportData.competition.tiers[1].brands}>
								{(brand) => (
									<div class="flex flex-col border border-white/10 bg-white/5 rounded-xl overflow-hidden hover:border-white/30 transition-all duration-300 group">
										{/* 1. White Logo Header */}
										<div class="bg-white h-32 w-full p-4 flex items-center justify-center">
											{brand.logo ? (
												<img
													src={brand.logo}
													alt={brand.name}
													class="h-20 w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
												/>
											) : (
												<span class="text-black font-bold text-xl opacity-20">
													NO LOGO
												</span>
											)}
										</div>

										{/* 2. Content Body */}
										<div class="p-6 flex-1 flex flex-col">
											<div class="flex justify-between items-baseline mb-4">
												<h3 class="text-2xl font-bold text-white">
													{brand.name}
												</h3>
												<div class="text-sm font-mono bg-white/10 px-3 py-1 rounded text-cyan-200">
													{brand.yield2025}{" "}
													<span class="text-gray-500 mx-1">→</span>{" "}
													{brand.plan2026}
												</div>
											</div>

											<p class="text-sm text-gray-400 leading-relaxed mb-2">
												{brand.desc}
											</p>
										</div>
									</div>
								)}
							</For>
						</div>
					</div>

					{/* Tier 3 Grid */}
					<div>
						<div class="text-xl font-bold text-gray-500 mb-4 border-b border-gray-800 pb-2">
							Tier 3: 潜力增长与细分玩家
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<For each={reportData.competition.tiers[2].brands}>
								{(brand) => (
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
												<span class="text-black font-bold text-xl opacity-20">
													NO LOGO
												</span>
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
								)}
							</For>
						</div>
					</div>
				</div>
			</section>

			{/* Segments Deep Dive */}
			<section ref={segmentsRef} class="section-container bg-zinc-900 py-24">
				<div class="max-w-7xl w-full px-6">
					<h2 class="text-3xl md:text-5xl font-bold mb-16 text-center">
						细分市场深度洞察
					</h2>

					<div class="space-y-6">
						{/* Student */}
						<div class="glass-card p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
							<div class="col-span-1">
								<h3 class="text-2xl font-bold mb-2 text-yellow-400">
									{reportData.segments[0].title}
								</h3>
								<div class="flex flex-wrap gap-2 mb-4">
									<For each={reportData.segments[0].tags}>
										{(tag) => (
											<span class="text-xs border border-yellow-400/30 text-yellow-400 px-2 py-1 rounded-full">
												{tag}
											</span>
										)}
									</For>
								</div>
								<p class="text-sm text-gray-400">
									{reportData.segments[0].features}
								</p>
							</div>
							<div class="col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								<For each={reportData.segments[0].details}>
									{(detail) => (
										<div class="bg-black/30 p-4 rounded-lg">
											<div class="text-xs text-gray-500 mb-1">
												{detail.label}
											</div>
											<div class="text-sm font-semibold">{detail.value}</div>
										</div>
									)}
								</For>
							</div>
						</div>

						{/* Adult */}
						<div class="glass-card p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
							<div class="col-span-1">
								<h3 class="text-2xl font-bold mb-2 text-blue-400">
									{reportData.segments[1].title}
								</h3>
								<div class="flex flex-wrap gap-2 mb-4">
									<For each={reportData.segments[1].tags}>
										{(tag) => (
											<span class="text-xs border border-blue-400/30 text-blue-400 px-2 py-1 rounded-full">
												{tag}
											</span>
										)}
									</For>
								</div>
								<p class="text-sm text-gray-400">
									{reportData.segments[1].features}
								</p>
							</div>
							<div class="col-span-2">
								<div class="bg-blue-900/10 border border-blue-500/20 p-5 rounded-lg">
									<h4 class="text-blue-300 text-sm font-bold uppercase mb-2">
										关键案例对比
									</h4>
									<p class="text-gray-300 text-sm leading-relaxed mb-4">
										{reportData.segments[1].insight}
									</p>
									<div class="text-xs text-blue-400 font-mono">
										{">>>"} {reportData.segments[1].strategy}
									</div>
								</div>
							</div>
						</div>

						{/* B2B */}
						<div class="glass-card p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
							<div class="col-span-1">
								<h3 class="text-2xl font-bold mb-2 text-green-400">
									{reportData.segments[2].title}
								</h3>
								<div class="flex flex-wrap gap-2 mb-4">
									<For each={reportData.segments[2].tags}>
										{(tag) => (
											<span class="text-xs border border-green-400/30 text-green-400 px-2 py-1 rounded-full">
												{tag}
											</span>
										)}
									</For>
								</div>
								<p class="text-sm text-gray-400">
									{reportData.segments[2].features}
								</p>
							</div>
							<div class="col-span-2 flex flex-col justify-center">
								<div class="flex items-stretch gap-4 text-center">
									<div class="flex-1 bg-gray-800 p-4 rounded-lg opacity-50 flex flex-col justify-center">
										<div class="text-xs text-gray-500">燃油车成本</div>
										<div class="text-xl font-bold text-gray-300">
											{reportData.segments[2].costComparison?.ice}
										</div>
									</div>
									<div class="text-2xl font-bold text-gray-600 self-center">
										VS
									</div>
									<div class="flex-1 bg-green-900/30 border border-green-500 p-4 rounded-lg shadow-lg shadow-green-900/20 flex flex-col justify-center">
										<div class="text-xs text-green-300">电动车成本</div>
										<div class="text-2xl font-bold text-white">
											{reportData.segments[2].costComparison?.ev}
										</div>
										<div class="text-xs text-green-500 font-mono mt-1">
											仅为油车的 {reportData.segments[2].costComparison?.ratio}
										</div>
									</div>
								</div>
								<div class="mt-4 text-center text-sm text-gray-400 italic">
									"{reportData.segments[2].conclusion}"
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Supply Chain & Strategy */}
			<section ref={supplyRef} class="section-container  py-24">
				<div class="max-w-7xl w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Supply Chain */}
					<div class="space-y-6">
						<h2 class="text-2xl font-bold border-l-4 border-orange-500 pl-4">
							{reportData.infrastructure.supplyChain.title}
						</h2>
						<ul class="space-y-4">
							<For each={reportData.infrastructure.supplyChain.details}>
								{(detail) => (
									<li class="bg-gray-900/50 p-4 rounded border-l border-gray-700 hover:border-orange-500 transition-colors">
										<span class="text-orange-400 font-bold block text-sm mb-1">
											{detail.label}
										</span>
										<span class="text-gray-300 text-sm">{detail.value}</span>
									</li>
								)}
							</For>
						</ul>

						<h2 class="text-2xl font-bold border-l-4 border-red-500 pl-4 mt-8">
							{reportData.infrastructure.operations.title}
						</h2>
						<ul class="space-y-4">
							<For each={reportData.infrastructure.operations.details}>
								{(detail) => (
									<li class="bg-gray-900/50 p-4 rounded border-l border-gray-700 hover:border-red-500 transition-colors">
										<span class="text-red-400 font-bold block text-sm mb-1">
											{detail.label}
										</span>
										<span class="text-gray-300 text-sm">{detail.value}</span>
									</li>
								)}
							</For>
						</ul>
					</div>

					{/* Risks */}
					<div
						ref={risksRef}
						class="bg-white text-black rounded-3xl p-10 flex flex-col justify-between"
					>
						<div>
							<h3 class="text-4xl font-bold mb-8">风险与挑战</h3>

							<div class="mb-8">
								<h4 class="text-xl font-bold mb-2 flex items-center gap-2">
									<div class="w-2 h-2 bg-black rounded-full"></div>
									{reportData.risks.protective.title}
								</h4>
								<p class="text-gray-600 leading-relaxed">
									{reportData.risks.protective.desc}
								</p>
							</div>

							<div class="mb-8">
								<h4 class="text-xl font-bold mb-2 flex items-center gap-2">
									<div class="w-2 h-2 bg-black rounded-full"></div>
									{reportData.risks.ip.title}
								</h4>
								<p class="text-gray-600 leading-relaxed">
									{reportData.risks.ip.desc}
								</p>
							</div>
						</div>

						<div class="border-t-2 border-black pt-8">
							<div class="text-6xl font-black opacity-10">2026</div>
							<div class="text-sm font-bold uppercase tracking-widest mt-2">
								Vietnam Market Outlook
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer class="py-12 text-center text-gray-700 text-sm">
				<p>EV INSIGHTS | COPYRIGHT 2025</p>
			</footer>
		</main>
	);
}
