import { Title } from "@solidjs/meta";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { For, onMount } from "solid-js";
import BrandCard from "~/components/BrandCard";
import SegmentCard from "~/components/SegmentCard";
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
					start: "top 90%",
				},
				y: 20,
				opacity: 0,
				duration: 0.8,
				stagger: 0.1,
				ease: "power2.out",
			});
		});
	});

	return (
		<main class="w-full min-h-screen bg-black text-white selection:bg-white selection:text-black">
			<Title>{reportData.meta.title}</Title>

			{/* Hero Section */}
			<section
				ref={heroRef}
				class="section-container min-h-screen flex items-center relative overflow-hidden"
			>
				{/* Industrial Background with Geometric Patterns */}
				<div class="absolute inset-0 bg-linear-to-br from-zinc-900 via-black to-zinc-950">
					{/* Metallic Grid Overlay */}
					<div class="absolute inset-0 opacity-10">
						<div
							class="absolute inset-0"
							style="background-image: linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px;"
						></div>
					</div>
					{/* Diagonal Accent */}
					<div class="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-zinc-800/20 to-transparent transform skew-x-12 translate-x-32"></div>
				</div>

				<div class="max-w-7xl w-full px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
					{/* Main Title Block */}
					<div class="lg:col-span-8">
						<div class="mb-8">
							<span class="text-xs font-mono tracking-[0.4em] uppercase text-zinc-400 mb-6 block">
								{reportData.meta.subtitle}
							</span>
							<h1 class="text-6xl md:text-8xl lg:text-[12rem] font-display font-bold tracking-tighter text-white mb-4 leading-none">
								2025<span class="text-zinc-600">-</span>2026
							</h1>
							<h2
								class="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white/90"
								style="font-family: 'Xiaolai', serif;"
							>
								越南电动车市场调研
							</h2>
						</div>
					</div>

					{/* Meta Information */}
					<div class="lg:col-span-4 lg:text-right">
						<div class="space-y-6">
							<div class="flex items-center justify-end gap-4 text-zinc-400 font-mono text-sm tracking-wider uppercase">
								<span>日期</span>
								<span class="w-8 h-px bg-zinc-600"></span>
								<span>{reportData.meta.date}</span>
							</div>
							<div class="flex items-center justify-end gap-4 text-zinc-400 font-mono text-sm tracking-wider uppercase">
								<span>作者</span>
								<span class="w-8 h-px bg-zinc-600"></span>
								<span>{reportData.meta.author}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Scroll Indicator */}
				<div class="absolute bottom-12 left-1/2 -translate-x-1/2">
					<div class="w-px h-16 bg-linear-to-b from-white/50 to-transparent"></div>
					<div class="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-2 text-center">
						Scroll
					</div>
				</div>
			</section>

			{/* Macro Overview */}
			<section
				ref={overviewRef}
				class="section-container border-t border-zinc-800 py-32 lg:py-48 relative bg-linear-to-b from-black to-zinc-950"
			>
				{/* Industrial Background Elements */}
				<div class="absolute inset-0 overflow-hidden pointer-events-none">
					<div class="absolute top-20 right-10 w-96 h-96 border border-zinc-800/30 rounded-full"></div>
					<div class="absolute bottom-20 left-10 w-64 h-64 bg-zinc-900/10 transform rotate-45"></div>
				</div>

				<div class="max-w-7xl w-full px-6 relative z-10">
					<div class="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24 lg:mb-32 items-start">
						<div class="lg:col-span-5">
							<div class="flex items-center gap-4 mb-8">
								<span class="w-16 h-px bg-linear-to-r from-zinc-600 to-zinc-400"></span>
								<span class="text-xs font-mono text-zinc-400 uppercase tracking-[0.4em]">
									Section 01
								</span>
							</div>
							<h2
								class="text-4xl lg:text-6xl font-bold tracking-tighter mb-8 font-display leading-[0.9]"
								style="font-family: 'Xiaolai', serif;"
							>
								市场宏观
								<br />
								<span class="text-zinc-500">概况与窗口</span>
							</h2>
							<p class="text-lg lg:text-xl text-zinc-300 font-light leading-relaxed max-w-lg">
								{reportData.marketOverview.status}
							</p>

							{/* Policy Driver Highlight */}
							<div class="mt-12 bg-linear-to-r from-zinc-900 to-zinc-800 border border-zinc-700 p-8 rounded-lg shadow-2xl">
								<span class="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-4">
									政策核心驱动力
								</span>
								<p
									class="text-white font-bold text-lg leading-tight"
									style="font-family: 'Xiaolai', serif;"
								>
									{reportData.marketOverview.banPusher}
								</p>
								<p class="text-zinc-400 text-sm mt-4 italic font-light">
									作为本地工业巨头，其游说力量是"油改电"进程的核心变量。
								</p>
							</div>
						</div>

						<div class="lg:col-span-7 space-y-8">
							{/* Stats Grid */}
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div class="bg-linear-to-br from-zinc-900 to-zinc-800 border border-zinc-700 p-8 lg:p-12 group hover:border-zinc-600 transition-all duration-300 shadow-xl">
									<span class="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-6 group-hover:text-zinc-300 transition-colors">
										社会保有量
									</span>
									<span class="text-5xl lg:text-7xl font-bold text-white tracking-tighter block mb-4 group-hover:scale-105 transition-transform origin-left">
										{reportData.marketOverview.totalHolding}
									</span>
									<p class="text-xs text-zinc-500 font-mono tracking-tight uppercase">
										Units in circulation
									</p>
									<div class="mt-4 h-1 bg-zinc-700 rounded-full overflow-hidden">
										<div class="h-full bg-linear-to-r from-zinc-400 to-zinc-300 w-3/4 transition-all duration-500 group-hover:w-full"></div>
									</div>
								</div>
								<div class="bg-linear-to-br from-zinc-900 to-zinc-800 border border-zinc-700 p-8 lg:p-12 group hover:border-zinc-600 transition-all duration-300 shadow-xl">
									<span class="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-6 group-hover:text-zinc-300 transition-colors">
										年均产量
									</span>
									<span class="text-5xl lg:text-7xl font-bold text-white tracking-tighter block mb-4 group-hover:scale-105 transition-transform origin-left">
										{reportData.marketOverview.annualProduction}
									</span>
									<p class="text-xs text-zinc-500 font-mono tracking-tight uppercase">
										Annual manufacturing capacity
									</p>
									<div class="mt-4 h-1 bg-zinc-700 rounded-full overflow-hidden">
										<div class="h-full bg-linear-to-r from-zinc-400 to-zinc-300 w-2/3 transition-all duration-500 group-hover:w-5/6"></div>
									</div>
								</div>
							</div>

							{/* Dominant Player Card */}
							<div class="bg-linear-to-r from-zinc-800 to-zinc-900 border border-zinc-700 p-8 lg:p-12 shadow-2xl group hover:border-zinc-600 transition-all duration-300">
								<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
									<div>
										<span class="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-3">
											燃油车霸主 (现存挑战)
										</span>
										<h3
											class="text-3xl lg:text-4xl font-bold text-white tracking-tighter"
											style="font-family: 'Xiaolai', serif;"
										>
											Honda Motor
										</h3>
									</div>
									<div class="text-right">
										<span class="text-5xl lg:text-7xl font-bold text-white tracking-tighter group-hover:text-zinc-200 transition-colors">
											{reportData.marketOverview.dominantPlayer.match(
												/\d+%/,
											)?.[0] || "70%"}
										</span>
										<p class="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-2">
											Market Share Dominance
										</p>
									</div>
								</div>
								<div class="mt-6 h-2 bg-zinc-700 rounded-full overflow-hidden">
									<div class="h-full bg-linear-to-r from-red-600 to-red-400 w-3/4 transition-all duration-700 group-hover:w-4/5"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Geographic Clusters */}
			<section
				ref={clustersRef}
				class="section-container bg-linear-to-b from-zinc-950 to-black border-t border-zinc-800 py-24 lg:py-48 relative"
			>
				{/* Background Industrial Elements */}
				<div class="absolute inset-0 overflow-hidden pointer-events-none">
					<div class="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-zinc-800/20 transform rotate-45"></div>
					<div class="absolute bottom-1/4 left-1/4 w-24 h-24 bg-zinc-900/10 rounded-full"></div>
				</div>

				<div class="max-w-7xl w-full px-6 relative z-10">
					<div class="flex flex-col md:flex-row md:items-end justify-between gap-8 lg:gap-12 mb-20 lg:mb-32">
						<div class="max-w-2xl">
							<h3
								class="text-4xl lg:text-5xl font-bold text-white tracking-tighter mb-6 font-display"
								style="font-family: 'Xiaolai', serif;"
							>
								地域产业集群
								<br />
								<span class="text-zinc-600">Geographic Industrial Density</span>
							</h3>
							<p class="text-zinc-300 text-base lg:text-lg font-light leading-relaxed">
								越南两轮车产业呈现极强的"北重南轻"特征，兴安与北宁/北江省构成了完整的供应链闭环。
							</p>
						</div>
						<div class="md:text-right">
							<span class="text-xs font-mono text-zinc-500 tracking-[0.4em] uppercase border-b border-zinc-700 pb-4">
								Locality & Infrastructure
							</span>
						</div>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
						<For each={reportData.marketOverview.clusters}>
							{(cluster) => (
								<div class="bg-linear-to-br from-zinc-900 to-zinc-950 p-8 lg:p-12 hover:from-zinc-800 hover:to-zinc-900 transition-all duration-500 group relative overflow-hidden border-r border-zinc-800 last:border-r-0">
									{/* Metallic Accent */}
									<div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-600 to-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

									{/* Background Province Name */}
									<div
										class="absolute -bottom-4 -right-4 text-8xl lg:text-[12rem] font-bold text-zinc-800/10 select-none pointer-events-none group-hover:text-zinc-700/20 transition-colors"
										style="font-family: 'Xiaolai', serif;"
									>
										{cluster.name.split(" ")[0]}
									</div>

									<h4
										class="text-2xl lg:text-3xl font-bold mb-4 tracking-tighter text-white group-hover:translate-x-2 transition-transform"
										style="font-family: 'Xiaolai', serif;"
									>
										{cluster.name}
									</h4>
									<div class="inline-block bg-zinc-800 border border-zinc-600 px-4 py-2 rounded-lg mb-8">
										<p class="text-zinc-400 text-xs font-mono uppercase tracking-widest">
											{cluster.desc}
										</p>
									</div>

									<div class="grid grid-cols-1 gap-8 relative z-10">
										<div class="space-y-4">
											<div class="flex items-center gap-4">
												<span class="text-xs text-zinc-500 uppercase font-bold tracking-widest">
													Top Tier Brands
												</span>
												<span class="flex-1 h-px bg-linear-to-r from-zinc-700 to-zinc-600"></span>
											</div>
											<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
												<For each={cluster.brands}>
													{(brand) => (
														<span class="text-sm text-zinc-400 font-light hover:text-white transition-colors flex items-center gap-2 truncate group-hover:scale-105">
															<span class="w-1.5 h-1.5 bg-zinc-600 rounded-full shrink-0 group-hover:bg-zinc-400"></span>
															<span class="truncate">{brand}</span>
														</span>
													)}
												</For>
											</div>
										</div>

										{cluster.suppliers && (
											<div class="space-y-4 pt-8 border-t border-zinc-800">
												<div class="flex items-center gap-4">
													<span class="text-xs text-zinc-500 uppercase font-bold tracking-widest">
														Strategic Suppliers
													</span>
													<span class="flex-1 h-px bg-linear-to-r from-zinc-700 to-zinc-600"></span>
												</div>
												<div class="grid grid-cols-2 gap-3">
													<For each={cluster.suppliers}>
														{(supplier) => (
															<span class="text-xs text-zinc-500 font-mono tracking-tight group-hover:text-zinc-300 transition-colors truncate">
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

			{/* Competition Panorama */}
			<section
				ref={competitionRef}
				class="section-container border-t border-zinc-800 py-24 lg:py-48 bg-linear-to-b from-black to-zinc-950 relative"
			>
				{/* Industrial Background */}
				<div class="absolute inset-0 overflow-hidden pointer-events-none">
					<div class="absolute top-1/3 left-1/3 w-64 h-64 border border-zinc-800/20 transform -rotate-12"></div>
					<div class="absolute bottom-1/3 right-1/3 w-48 h-48 bg-zinc-900/5 rounded-full"></div>
				</div>

				<div class="max-w-7xl w-full px-6 relative z-10">
					<div class="text-center mb-24 lg:mb-48">
						<span class="text-xs font-mono text-zinc-500 uppercase tracking-[0.6em] mb-8 block">
							Competitive Landscape
						</span>
						<h2
							class="text-5xl lg:text-8xl font-bold tracking-tighter font-display mb-8"
							style="font-family: 'Xiaolai', serif;"
						>
							竞争格局与<span class="text-zinc-600">内幕</span>
						</h2>
						<p class="text-zinc-400 text-lg lg:text-xl font-light max-w-3xl mx-auto leading-relaxed italic px-4">
							"不计成本的本土龙头 vs 快速扩张的中国品牌 vs 优胜劣汰的腰部玩家"
						</p>
					</div>

					<div class="space-y-32 lg:space-y-48">
						<For each={reportData.competition.tiers}>
							{(tier, idx) => (
								<div class="relative">
									<div class="flex items-baseline gap-8 mb-16">
										<span class="text-6xl lg:text-8xl font-bold text-zinc-800 leading-none select-none absolute -top-6 -left-6">
											{idx() + 1}
										</span>
										<div class="relative z-10 pl-6 border-l-4 border-gradient-to-b from-zinc-600 to-zinc-400">
											<h3
												class="text-2xl lg:text-3xl font-bold text-white uppercase tracking-tighter"
												style="font-family: 'Xiaolai', serif;"
											>
												{tier.name.split("：")[0]}
											</h3>
											<p class="text-zinc-500 font-mono text-sm tracking-widest mt-2 uppercase">
												{tier.name.split("：")[1]}
											</p>
										</div>
									</div>

									<div
										class={
											idx() === 2
												? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl"
												: "space-y-4 bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl"
										}
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
				</div>
			</section>

			{/* Market Segments */}
			<section
				ref={segmentsRef}
				class="section-container bg-linear-to-b from-zinc-950 to-black border-t border-zinc-800 py-24 lg:py-48 relative"
			>
				{/* Background Elements */}
				<div class="absolute inset-0 overflow-hidden pointer-events-none">
					<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-zinc-800/10 rounded-full"></div>
				</div>

				<div class="max-w-7xl w-full px-6 relative z-10">
					<div class="flex flex-col md:flex-row items-center gap-8 lg:gap-12 mb-20 lg:mb-32 overflow-hidden">
						<h2
							class="text-4xl lg:text-6xl font-bold tracking-tighter shrink-0 font-display"
							style="font-family: 'Xiaolai', serif;"
						>
							细分市场洞察
						</h2>
						<div class="hidden md:block h-px bg-linear-to-r from-zinc-700 to-zinc-600 flex-1"></div>
						<p class="text-zinc-500 uppercase tracking-[0.3em] text-xs shrink-0 font-mono font-bold">
							Strategic Segmentation 2026
						</p>
					</div>
					<div class="space-y-6 bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
						<SegmentCard segment={reportData.segments[0]} />
						<SegmentCard segment={reportData.segments[1]} />
						<SegmentCard segment={reportData.segments[2]} />
					</div>
				</div>
			</section>

			{/* Supply Chain / Ops */}
			<section
				ref={supplyRef}
				class="section-container py-24 lg:py-48 border-t border-zinc-800 bg-linear-to-b from-black to-zinc-950 overflow-hidden relative"
			>
				{/* Industrial Background */}
				<div class="absolute inset-0 overflow-hidden pointer-events-none">
					<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-2 border-zinc-800/20 rounded-full"></div>
					<div class="absolute top-1/4 right-1/4 w-32 h-32 bg-zinc-900/10 transform rotate-45"></div>
				</div>

				<div class="max-w-7xl w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative z-10">
					<div class="lg:col-span-7 space-y-24 lg:space-y-32">
						<div class="group/supply">
							<div class="flex items-center gap-6 mb-12">
								<h3 class="text-sm font-mono uppercase tracking-[0.5em] text-zinc-500 group-hover/supply:text-zinc-300 transition-colors">
									Manufacturing Infrastructure
								</h3>
								<div class="flex-1 h-px bg-linear-to-r from-zinc-700 to-zinc-600 group-hover/supply:from-zinc-600 group-hover/supply:to-zinc-500 transition-colors"></div>
							</div>

							<div class="grid grid-cols-1 gap-4 bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
								<For each={reportData.infrastructure.supplyChain.details}>
									{(detail) => (
										<div class="bg-linear-to-r from-zinc-900 to-zinc-950 p-8 lg:p-12 flex flex-col sm:flex-row justify-between items-start sm:items-center group/item hover:from-zinc-800 hover:to-zinc-900 transition-all relative overflow-hidden gap-4 border-b border-zinc-800 last:border-b-0">
											<div class="absolute left-0 top-0 h-full w-0 group-hover/item:w-1 bg-linear-to-b from-zinc-400 to-zinc-600 transition-all duration-500"></div>
											<span
												class="text-zinc-300 font-bold tracking-tight text-lg lg:text-xl group-hover/item:text-white transition-colors"
												style="font-family: 'Xiaolai', serif;"
											>
												{detail.label}
											</span>
											<span class="text-zinc-400 font-mono text-sm max-w-full sm:max-w-[50%] sm:text-right leading-relaxed italic group-hover/item:text-zinc-200 transition-colors">
												{detail.value}
											</span>
										</div>
									)}
								</For>
							</div>
						</div>

						<div class="group/ops">
							<div class="flex items-center gap-6 mb-12">
								<h3 class="text-sm font-mono uppercase tracking-[0.5em] text-zinc-500 group-hover/ops:text-zinc-300 transition-colors">
									Operational Logic & Barriers
								</h3>
								<div class="flex-1 h-px bg-linear-to-r from-zinc-700 to-zinc-600 group-hover/ops:from-zinc-600 group-hover/ops:to-zinc-500 transition-colors"></div>
							</div>

							<div class="grid grid-cols-1 gap-4 bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
								<For each={reportData.infrastructure.operations.details}>
									{(detail) => (
										<div class="bg-linear-to-r from-zinc-900 to-zinc-950 p-8 lg:p-12 flex flex-col sm:flex-row justify-between items-start sm:items-center group/item hover:from-zinc-800 hover:to-zinc-900 transition-all relative overflow-hidden gap-4 border-b border-zinc-800 last:border-b-0">
											<div class="absolute left-0 top-0 h-full w-0 group-hover/item:w-1 bg-linear-to-b from-zinc-500 to-zinc-700 transition-all duration-500"></div>
											<span
												class="text-zinc-300 font-bold tracking-tight text-lg lg:text-xl group-hover/item:text-white transition-colors"
												style="font-family: 'Xiaolai', serif;"
											>
												{detail.label}
											</span>
											<span class="text-zinc-400 font-mono text-sm max-w-full sm:max-w-[50%] sm:text-right leading-relaxed italic group-hover/item:text-zinc-200 transition-colors">
												{detail.value}
											</span>
										</div>
									)}
								</For>
							</div>
						</div>
					</div>

					{/* Risks Column */}
					<div
						ref={risksRef}
						class="lg:col-span-5 bg-linear-to-b from-zinc-900 to-zinc-950 border border-zinc-700 p-10 lg:p-16 flex flex-col justify-between relative shadow-2xl min-h-[600px] rounded-lg"
					>
						{/* Metallic Accent */}
						<div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-600 to-zinc-400"></div>

						<div>
							<div class="mb-16">
								<span class="text-xs font-mono text-zinc-500 uppercase tracking-[0.5em] block mb-6">
									Strategic Warning
								</span>
								<h3
									class="text-4xl lg:text-6xl font-bold mb-6 tracking-tighter text-white font-display leading-[0.8]"
									style="font-family: 'Xiaolai', serif;"
								>
									风险与
									<br />
									<span class="text-zinc-600">挑战</span>
								</h3>
							</div>

							<div class="space-y-16 relative">
								<div class="group/risk">
									<h4 class="text-sm font-mono uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-700 pb-6 mb-8 flex items-center justify-between group-hover/risk:text-white transition-colors">
										<span>Protectionism</span>
										<span class="w-2 h-2 bg-zinc-600 rounded-full group-hover:bg-red-600 transition-colors"></span>
									</h4>
									<p class="text-zinc-400 text-lg leading-relaxed font-light group-hover:text-zinc-300 transition-colors">
										{reportData.risks.protective.desc}
									</p>
								</div>
								<div class="group/risk">
									<h4 class="text-sm font-mono uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-700 pb-6 mb-8 flex items-center justify-between group-hover/risk:text-white transition-colors">
										<span>Intellectual Property</span>
										<span class="w-2 h-2 bg-zinc-600 rounded-full group-hover:bg-red-600 transition-colors"></span>
									</h4>
									<p class="text-zinc-400 text-lg leading-relaxed font-light group-hover:text-zinc-300 transition-colors">
										{reportData.risks.ip.desc}
									</p>
								</div>
							</div>
						</div>

						<footer class="pt-24 mt-24 border-t border-zinc-700 text-right">
							<div class="text-xs font-mono tracking-[0.6em] text-zinc-600 uppercase mb-4">
								Internal Intelligence
							</div>
							<div
								class="text-3xl lg:text-4xl font-bold text-zinc-800 font-display tracking-tighter"
								style="font-family: 'Xiaolai', serif;"
							>
								VIETNAM_EV_REPORT
							</div>
						</footer>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer class="py-24 text-center bg-linear-to-t from-zinc-950 to-black border-t border-zinc-800 relative">
				<div class="absolute inset-0 overflow-hidden pointer-events-none">
					<div class="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-linear-to-b from-zinc-600 to-transparent"></div>
				</div>
				<div class="relative z-10">
					<div class="text-zinc-600 text-xs tracking-[0.6em] font-mono uppercase mb-4">
						EV Insights
					</div>
					<div
						class="text-zinc-500 text-lg font-bold tracking-tighter"
						style="font-family: 'Xiaolai', serif;"
					>
						REPORT 2025
					</div>
				</div>
			</footer>
		</main>
	);
}
