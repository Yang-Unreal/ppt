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
				class="section-container min-h-screen flex flex-col justify-center items-center text-center relative pt-20"
			>
				{/* Minimalist Grid Line Background */}
				<div class="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
					<div class="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2"></div>
					<div class="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2"></div>
				</div>

				<div class="max-w-[1400px] px-6 relative z-10 w-full">
					<div class="mb-12">
						<span class="text-[10px] md:text-xs font-mono tracking-[0.4em] uppercase text-zinc-500 mb-4 block">
							{reportData.meta.subtitle}
						</span>
						<h1 class="text-7xl md:text-[10rem] font-display font-bold tracking-tighter text-white mb-8 leading-none">
							2025<span class="text-zinc-800">-</span>2026
						</h1>
						<h2 class="text-4xl md:text-6xl font-bold tracking-tight text-white/90">
							越南电动车市场调研
						</h2>
					</div>

					<div class="flex flex-col md:flex-row items-center justify-center gap-12 mt-20 text-zinc-500 font-mono text-[10px] tracking-widest uppercase">
						<div class="flex items-center gap-3">
							<span class="w-1 h-1 bg-white"></span>
							<span>日期: {reportData.meta.date}</span>
						</div>
						<div class="flex items-center gap-3">
							<span class="w-1 h-1 bg-white"></span>
							<span>作者: {reportData.meta.author}</span>
						</div>
					</div>
				</div>

				<div class="absolute bottom-20 left-1/2 -translate-x-1/2 opacity-30">
					<div class="w-px h-12 bg-linear-to-b from-white to-transparent"></div>
				</div>
			</section>

			{/* Macro Overview */}
			<section
				ref={overviewRef}
				class="section-container border-t border-zinc-900 py-32"
			>
				<div class="max-w-7xl w-full px-6">
					<div class="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 items-start">
						<div class="lg:col-span-5">
							<h2 class="text-5xl font-bold tracking-tighter mb-8 font-display">
								市场宏观概况
							</h2>
							<p class="text-2xl text-zinc-400 font-light leading-snug pt-10">
								{reportData.marketOverview.status}
							</p>
						</div>

						<div class="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900 rounded-sm overflow-hidden">
							<div class="bg-black p-12">
								<span class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-6">
									总体保有量
								</span>
								<span class="text-6xl font-bold text-white tracking-tighter block mb-2">
									{reportData.marketOverview.totalHolding}
								</span>
								<p class="text-xs text-zinc-600">
									越南社会机动车保有量基数庞大
								</p>
							</div>
							<div class="bg-black p-12">
								<span class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-6">
									年产量
								</span>
								<span class="text-6xl font-bold text-white tracking-tighter block mb-2">
									{reportData.marketOverview.annualProduction}
								</span>
								<p class="text-xs text-zinc-600">本地制造链持续成熟</p>
							</div>
						</div>
					</div>

					<div class="glass-card flex flex-col md:flex-row justify-between items-center group">
						<header>
							<span class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
								主导玩家
							</span>
							<h3 class="text-3xl font-bold text-white tracking-tight">
								Honda
							</h3>
						</header>
						<div class="mt-8 md:mt-0 text-right">
							<span class="text-7xl font-bold text-white tracking-tighter">
								{reportData.marketOverview.dominantPlayer.match(/\d+%/)?.[0] ||
									"70%"}
							</span>
							<p class="text-[10px] text-zinc-500 font-mono mt-2">
								{reportData.marketOverview.dominantPlayer}
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Geographic Clusters */}
			<section
				ref={clustersRef}
				class="section-container bg-[#080808] border-t border-zinc-900 py-32"
			>
				<div class="max-w-7xl w-full px-6">
					<div class="flex items-center gap-8 mb-20">
						<h3 class="text-xl text-white font-bold tracking-tight shrink-0 uppercase">
							地域产业布局
						</h3>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900 rounded-sm overflow-hidden">
						<For each={reportData.marketOverview.clusters}>
							{(cluster) => (
								<div class="bg-black p-12 hover:bg-zinc-950 transition-colors duration-300">
									<h4 class="text-3xl font-bold mb-4 tracking-tight">
										{cluster.name}
									</h4>
									<p class="text-zinc-500 mb-12 leading-relaxed text-sm h-10 pt-5">
										{cluster.desc}
									</p>

									<div class="space-y-10">
										<div>
											<span class="text-[10px] text-white/30 uppercase block mb-4 font-bold tracking-widest">
												主要制造商
											</span>
											<div class="grid grid-cols-2 gap-3">
												<For each={cluster.brands}>
													{(brand) => (
														<span class="text-sm text-zinc-400 border-l border-zinc-800 pl-3">
															{brand}
														</span>
													)}
												</For>
											</div>
										</div>
										{cluster.suppliers && (
											<div>
												<span class="text-[10px] text-white/30 uppercase block mb-4 font-bold tracking-widest">
													主要供应商
												</span>
												<div class="grid grid-cols-2 gap-3">
													<For each={cluster.suppliers}>
														{(supplier) => (
															<span class="text-sm text-zinc-500 border-l border-zinc-800 pl-3 italic">
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
				class="section-container border-t border-zinc-900 py-32"
			>
				<div class="max-w-7xl w-full px-6">
					<h2 class="text-7xl font-bold mb-32 tracking-tighter text-center font-display">
						竞争格局
					</h2>

					<div class="space-y-32">
						{/* Tiers with simple numbering */}
						{reportData.competition.tiers.map((tier, idx) => (
							<div class="relative">
								<div class="flex items-end gap-6 mb-12 border-b border-zinc-900 pb-12">
									<span class="text-6xl font-bold text-zinc-800 leading-none">
										0{idx + 1}
									</span>
									<div class="flex-1">
										<h3 class="text-2xl font-bold text-white uppercase tracking-tight">
											{tier.name.split("：")[0]}
										</h3>
										<p class="text-zinc-500 text-sm mt-1">
											{tier.name.split("：")[1]}
										</p>
									</div>
								</div>
								<div
									class={
										idx === 2
											? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
											: idx === 1
												? "grid grid-cols-1 md:grid-cols-2 gap-8"
												: "space-y-8"
									}
								>
									<For each={tier.brands}>
										{(brand) => (
											<BrandCard brand={brand} tier={(idx + 1) as 1 | 2 | 3} />
										)}
									</For>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Market Segments */}
			<section
				ref={segmentsRef}
				class="section-container bg-[#050505] border-t border-zinc-900 py-32"
			>
				<div class="max-w-7xl w-full px-6">
					<div class="text-center mb-20">
						<h2 class="text-5xl font-bold tracking-tight mb-4">细分市场洞察</h2>
						<p class="text-zinc-500 uppercase tracking-[0.3em] text-[10px]">
							Strategic Deep Dive
						</p>
					</div>
					<div class="space-y-px bg-zinc-900 border border-zinc-900 rounded-sm overflow-hidden">
						<SegmentCard segment={reportData.segments[0]} />
						<SegmentCard segment={reportData.segments[1]} />
						<SegmentCard segment={reportData.segments[2]} />
					</div>
				</div>
			</section>

			{/* Supply Chain / Ops */}
			<section
				ref={supplyRef}
				class="section-container py-32 border-t border-zinc-900"
			>
				<div class="max-w-7xl w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-20">
					<div class="lg:col-span-7 space-y-20">
						<div>
							<h3 class="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 mb-8">
								Supply Chain Localization
							</h3>
							<div class="space-y-px bg-zinc-900 border border-zinc-900">
								<For each={reportData.infrastructure.supplyChain.details}>
									{(detail) => (
										<div class="bg-black p-8 flex justify-between items-center group hover:bg-zinc-950 transition-colors">
											<span class="text-zinc-400 font-bold group-hover:text-white transition-colors">
												{detail.label}
											</span>
											<span class="text-white font-mono text-sm">
												{detail.value}
											</span>
										</div>
									)}
								</For>
							</div>
						</div>

						<div>
							<h3 class="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 mb-8">
								Operations & Painpoints
							</h3>
							<div class="space-y-px bg-zinc-900 border border-zinc-900">
								<For each={reportData.infrastructure.operations.details}>
									{(detail) => (
										<div class="bg-black p-8 flex justify-between items-center group hover:bg-zinc-950 transition-colors">
											<span class="text-zinc-400 font-bold group-hover:text-white transition-colors">
												{detail.label}
											</span>
											<span class="text-white font-mono text-sm">
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
						class="lg:col-span-5 bg-zinc-950 border border-zinc-900 p-12 flex flex-col justify-between"
					>
						<div>
							<h3 class="text-5xl font-bold mb-16 tracking-tighter">
								风险挑战
							</h3>
							<div class="space-y-12">
								<div>
									<h4 class="text-xs font-mono uppercase tracking-widest text-white border-b border-zinc-900 pb-4 mb-4">
										Protectionism
									</h4>
									<p class="text-zinc-500 text-sm leading-relaxed">
										{reportData.risks.protective.desc}
									</p>
								</div>
								<div>
									<h4 class="text-xs font-mono uppercase tracking-widest text-white border-b border-zinc-900 pb-4 mb-4">
										Intellectual Property
									</h4>
									<p class="text-zinc-500 text-sm leading-relaxed">
										{reportData.risks.ip.desc}
									</p>
								</div>
							</div>
						</div>

						<footer class="pt-20 border-t border-zinc-900 text-right">
							<div class="text-[10px] font-mono tracking-widest text-zinc-700 uppercase">
								Outlook 2026
							</div>
							<div class="text-3xl font-bold text-zinc-900">VIETNAM_EV</div>
						</footer>
					</div>
				</div>
			</section>

			{/* Simple Footer */}
			<footer class="py-16 text-center text-zinc-800 text-[10px] tracking-[0.5em] font-mono">
				EV INSIGHTS REPT 2025
			</footer>
		</main>
	);
}
