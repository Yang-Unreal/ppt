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
			// Solana-style reveal: larger upward movement, smoother ease
			gsap.from(ref.children, {
				scrollTrigger: {
					trigger: ref,
					start: "top 85%",
				},
				y: 60,
				opacity: 0,
				duration: 1.2,
				stagger: 0.15,
				ease: "power3.out",
			});
		});
	});

	return (
		<main class="w-full min-h-screen bg-black text-white selection:bg-[#14F195] selection:text-black">
			<Title>{reportData.meta.title}</Title>

			{/* Hero Section */}
			<section
				ref={heroRef}
				class="section-container min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden pt-32"
			>
				{/* Aurora Background Effect */}
				<div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
					<div class="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-[#9945FF] rounded-full mix-blend-screen opacity-20 blur-[120px] animate-pulse"></div>
					<div class="absolute top-[10%] -right-[10%] w-[60vw] h-[60vw] bg-[#14F195] rounded-full mix-blend-screen opacity-20 blur-[120px] animate-pulse delay-1000"></div>
					<div class="absolute bottom-0 left-[20%] w-[80vw] h-[40vw] bg-blue-900 rounded-full mix-blend-screen opacity-20 blur-[100px]"></div>
				</div>

				<div class="max-w-[1400px] px-6 relative z-10">
					<div class="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#333] bg-[#111] text-[#14F195] text-xs font-mono tracking-widest uppercase backdrop-blur-md">
						{reportData.meta.subtitle}
					</div>

					<h1 class="text-7xl md:text-9xl font-display font-bold tracking-tighter text-white mb-8 leading-[0.9]">
						2025<span class="text-[#333]">-</span>2026
						<br />
						<span class="text-transparent bg-clip-text bg-linear-to-r from-[#9945FF] to-[#14F195]">
							越南电动车
						</span>
					</h1>

					<div class="flex flex-col md:flex-row items-center justify-center gap-8 mt-12 text-[#9e9e9e] font-mono text-sm">
						<div class="flex items-center gap-2">
							<div class="w-2 h-2 rounded-full bg-[#14F195] shadow-[0_0_10px_#14F195]"></div>
							<span>LIVE DATA • {reportData.meta.date}</span>
						</div>
						<div class="hidden md:block w-px h-4 bg-[#333]"></div>
						<div>AUTHOR: {reportData.meta.author}</div>
					</div>
				</div>

				{/* Scroll Indicator */}
				<div class="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#333] animate-bounce">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<title>Scroll down indicator</title>
						<path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
					</svg>
				</div>
			</section>

			{/* Macro Overview - Grid Layout */}
			<section ref={overviewRef} class="section-container relative z-10 py-32">
				<div class="max-w-[1200px] w-full px-6">
					<div class="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-[#222] pb-8">
						<div>
							<h2 class="text-4xl md:text-5xl font-bold mb-4 font-display">
								市场宏观概况
							</h2>
							<div class="h-1 w-20 bg-linear-to-r from-[#14F195] to-[#9945FF]"></div>
						</div>
						<p class="text-xl text-[#9e9e9e] max-w-xl md:text-right mt-6 md:mt-0 leading-relaxed">
							{reportData.marketOverview.status}
						</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Card 1 */}
						<div class="glass-card p-10 flex flex-col justify-between h-[300px] group">
							<div>
								<span class="text-[#14F195] font-mono text-xs uppercase tracking-wider mb-2 block">
									Total Holdings
								</span>
								<span class="text-gray-400 text-sm">社会保有量</span>
							</div>
							<div>
								<span class="text-6xl font-bold text-white block mb-2 tracking-tighter group-hover:scale-105 transition-transform duration-300 origin-left">
									{reportData.marketOverview.totalHolding}
								</span>
								<div class="w-full bg-[#222] h-1 mt-4 overflow-hidden rounded-full">
									<div class="bg-[#14F195] h-full w-[85%]"></div>
								</div>
								<span class="text-xs text-gray-500 mt-2 block">
									东南亚最高之一
								</span>
							</div>
						</div>

						{/* Card 2 */}
						<div class="glass-card p-10 flex flex-col justify-between h-[300px] group">
							<div>
								<span class="text-[#9945FF] font-mono text-xs uppercase tracking-wider mb-2 block">
									Annual Production
								</span>
								<span class="text-gray-400 text-sm">年总产量</span>
							</div>
							<div>
								<span class="text-6xl font-bold text-white block mb-2 tracking-tighter group-hover:scale-105 transition-transform duration-300 origin-left">
									{reportData.marketOverview.annualProduction}
								</span>
								<div class="w-full bg-[#222] h-1 mt-4 overflow-hidden rounded-full">
									<div class="bg-[#9945FF] h-full w-[60%]"></div>
								</div>
								<span class="text-xs text-gray-500 mt-2 block">
									目前产能保持稳定
								</span>
							</div>
						</div>

						{/* Card 3 */}
						<div class="glass-card p-10 flex flex-col justify-between h-[300px] group">
							<div>
								<span class="text-white font-mono text-xs uppercase tracking-wider mb-2 block">
									Dominance
								</span>
								<span class="text-gray-400 text-sm">主要竞争</span>
							</div>
							<div>
								<span class="text-6xl font-bold text-white block mb-2 tracking-tighter group-hover:scale-105 transition-transform duration-300 origin-left">
									70%
								</span>
								<div class="w-full bg-[#222] h-1 mt-4 overflow-hidden rounded-full">
									<div class="bg-white h-full w-[70%]"></div>
								</div>
								<span class="text-xs text-gray-500 mt-2 block">
									{reportData.marketOverview.dominantPlayer}
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Geographic Clusters */}
			<section ref={clustersRef} class="section-container bg-[#080808] py-32">
				<div class="max-w-[1200px] w-full px-6">
					<h3 class="text-2xl text-[#14F195] font-mono mb-12 flex items-center gap-4">
						<span class="w-8 h-px bg-[#14F195]"></span>
						产业布局地理分布
					</h3>
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<For each={reportData.marketOverview.clusters}>
							{(cluster) => (
								<div class="glass-card p-8 group">
									<div class="flex justify-between items-start mb-6">
										<h4 class="text-3xl font-bold">{cluster.name}</h4>
										<div class="px-3 py-1 rounded-full border border-[#333] text-xs text-gray-400">
											CLUSTER
										</div>
									</div>
									<p class="text-gray-400 mb-8 leading-relaxed h-12">
										{cluster.desc}
									</p>

									<div class="space-y-6">
										<div>
											<span class="text-[10px] text-[#9945FF] uppercase block mb-3 font-bold tracking-widest">
												主要整车厂
											</span>
											<div class="flex flex-wrap gap-2">
												<For each={cluster.brands}>
													{(brand) => (
														<span class="bg-[#111] border border-[#333] px-3 py-1.5 rounded-md text-sm text-gray-300 hover:border-white transition-colors cursor-default">
															{brand}
														</span>
													)}
												</For>
											</div>
										</div>
										{cluster.suppliers && (
											<div>
												<span class="text-[10px] text-[#14F195] uppercase block mb-3 font-bold tracking-widest">
													关键配套
												</span>
												<div class="flex flex-wrap gap-2">
													<For each={cluster.suppliers}>
														{(supplier) => (
															<span class="bg-[#111] border border-[#333] px-3 py-1.5 rounded-md text-sm text-gray-300 hover:border-white transition-colors cursor-default">
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

			{/* Competition */}
			<section ref={competitionRef} class="section-container py-32">
				<div class="max-w-[1200px] w-full px-6">
					<h2 class="text-5xl md:text-7xl font-display font-bold mb-20 text-center tracking-tighter">
						竞争格局全景
					</h2>

					<div class="space-y-20">
						{/* Tier 1 */}
						<div class="relative">
							{/* Decoration line */}
							<div class="absolute -left-6 top-0 bottom-0 w-1 bg-linear-to-b from-[#14F195] to-transparent hidden md:block"></div>
							<div class="text-2xl font-bold text-white mb-8 pl-0 md:pl-6">
								Tier 1{" "}
								<span class="text-[#9e9e9e] font-normal text-lg ml-2">
									绝对统领
								</span>
							</div>
							<For each={reportData.competition.tiers[0].brands}>
								{(brand) => <BrandCard brand={brand} tier={1} />}
							</For>
						</div>

						{/* Tier 2 */}
						<div class="relative">
							<div class="absolute -left-6 top-0 bottom-0 w-1 bg-linear-to-b from-[#9945FF] to-transparent hidden md:block"></div>
							<div class="text-2xl font-bold text-white mb-8 pl-0 md:pl-6">
								Tier 2{" "}
								<span class="text-[#9e9e9e] font-normal text-lg ml-2">
									强势竞对
								</span>
							</div>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
								<For each={reportData.competition.tiers[1].brands}>
									{(brand) => <BrandCard brand={brand} tier={2} />}
								</For>
							</div>
						</div>

						{/* Tier 3 */}
						<div class="relative">
							<div class="absolute -left-6 top-0 bottom-0 w-1 bg-linear-to-b from-white to-transparent hidden md:block"></div>
							<div class="text-2xl font-bold text-white mb-8 pl-0 md:pl-6">
								Tier 3{" "}
								<span class="text-[#9e9e9e] font-normal text-lg ml-2">
									潜力增长
								</span>
							</div>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								<For each={reportData.competition.tiers[2].brands}>
									{(brand) => <BrandCard brand={brand} tier={3} />}
								</For>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Segments */}
			<section ref={segmentsRef} class="section-container bg-[#050505] py-32">
				<div class="max-w-[1200px] w-full px-6">
					<h2 class="text-4xl md:text-5xl font-bold mb-16 text-center font-display">
						细分市场深度洞察
					</h2>
					<div class="space-y-6">
						<SegmentCard segment={reportData.segments[0]} color="yellow" />
						<SegmentCard segment={reportData.segments[1]} color="blue" />
						<SegmentCard segment={reportData.segments[2]} color="green" />
					</div>
				</div>
			</section>

			{/* Supply Chain */}
			<section ref={supplyRef} class="section-container py-32">
				<div class="max-w-[1200px] w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
					<div class="space-y-12">
						<div>
							<h2 class="text-3xl font-bold mb-6 text-[#14F195]">
								{reportData.infrastructure.supplyChain.title}
							</h2>
							<ul class="space-y-2">
								<For each={reportData.infrastructure.supplyChain.details}>
									{(detail) => (
										<li class="group flex items-center justify-between p-4 border-b border-[#222] hover:border-[#14F195] transition-colors">
											<span class="text-gray-400 group-hover:text-white transition-colors">
												{detail.label}
											</span>
											<span class="text-white font-mono">{detail.value}</span>
										</li>
									)}
								</For>
							</ul>
						</div>

						<div>
							<h2 class="text-3xl font-bold mb-6 text-[#9945FF]">
								{reportData.infrastructure.operations.title}
							</h2>
							<ul class="space-y-2">
								<For each={reportData.infrastructure.operations.details}>
									{(detail) => (
										<li class="group flex items-center justify-between p-4 border-b border-[#222] hover:border-[#9945FF] transition-colors">
											<span class="text-gray-400 group-hover:text-white transition-colors">
												{detail.label}
											</span>
											<span class="text-white font-mono">{detail.value}</span>
										</li>
									)}
								</For>
							</ul>
						</div>
					</div>

					{/* Risks Card */}
					<div
						ref={risksRef}
						class="glass-card p-12 flex flex-col justify-between min-h-[500px] bg-linear-to-br from-[#111] to-black"
					>
						<div>
							<h3 class="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-linear-to-r from-white to-gray-500">
								风险与挑战
							</h3>

							<div class="mb-10">
								<h4 class="text-xl font-bold mb-4 text-[#14F195]">
									{reportData.risks.protective.title}
								</h4>
								<p class="text-gray-400 leading-relaxed text-sm">
									{reportData.risks.protective.desc}
								</p>
							</div>

							<div class="mb-10">
								<h4 class="text-xl font-bold mb-4 text-[#9945FF]">
									{reportData.risks.ip.title}
								</h4>
								<p class="text-gray-400 leading-relaxed text-sm">
									{reportData.risks.ip.desc}
								</p>
							</div>
						</div>

						<div class="border-t border-[#333] pt-8 flex justify-between items-end">
							<div class="text-sm font-bold uppercase tracking-widest text-gray-500">
								Vietnam Market Outlook
							</div>
							<div class="text-6xl font-black text-[#222]">2026</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer class="py-20 text-center text-gray-800 text-sm font-mono border-t border-[#111]">
				<p>EV INSIGHTS | COPYRIGHT 2025</p>
			</footer>
		</main>
	);
}
