import { Title } from "@solidjs/meta";
import { For } from "solid-js";
import BrandCard from "~/components/BrandCard";
import BrandModels from "~/components/BrandModels";
import SegmentCard from "~/components/SegmentCard";
import { reportData } from "~/utils/data-loader";

export default function Report() {
	return (
		<main class="w-full min-h-screen bg-(--bg-page) text-(--text-primary) selection:bg-[#d3fd50] selection:text-black">
			<Title>{reportData.meta.title}</Title>

			{/* --- Section 01: Hero / Cover --- */}
			<section class="w-full border-b border-gray-100 bg-white relative min-h-screen flex flex-col justify-center items-center">
				<div class="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50"></div>

				<div class="relative z-10 w-full px-6 text-center">
					<h1 class="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter text-black mb-8 leading-tight">
						越南电动车市场调研
						<span class="block text-[#d3fd50] mt-4">2025-26</span>
					</h1>

					<div class="mt-12 flex justify-center items-center gap-4">
						<span class="px-4 py-2 bg-black text-white rounded-full text-sm font-bold tracking-widest uppercase">
							作者
						</span>
						<span class="text-xl font-medium text-gray-900">翁树军、杨扬</span>
					</div>
				</div>
			</section>

			{/* --- Section 02: Macro Overview --- */}
			<section class="w-full py-16 lg:py-24 min-h-screen flex flex-col justify-center">
				<div class="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
					<div class="mb-20 border-b border-gray-200 pb-8">
						<span class="text-sm font-bold font-mono text-gray-500 uppercase tracking-widest block mb-3">
							01.
						</span>
						<h2 class="text-5xl md:text-6xl font-bold tracking-tighter text-black">
							宏观背景
						</h2>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
						{/* Text Block */}
						<div class="lg:col-span-6 swiss-card p-12 flex flex-col justify-center bg-white">
							<h3 class="text-3xl font-medium mb-8 tracking-tight">机会窗口</h3>
							<p class="text-gray-500 text-lg leading-relaxed mb-12 font-light">
								{reportData.marketOverview.status}
							</p>
							<div class="mt-auto pt-8 border-t border-gray-100">
								<span class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
									关键驱动力
								</span>
								<p class="text-black text-xl font-medium">
									"{reportData.marketOverview.banPusher}"
								</p>
							</div>
						</div>

						{/* Stats Column 1 */}
						<div class="lg:col-span-3 flex flex-col gap-6">
							<div class="swiss-card p-10 bg-white flex-1 flex flex-col justify-center hover:border-gray-300">
								<span class="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
									市场保有量
								</span>
								<span class="text-6xl font-medium tracking-tighter text-black">
									{reportData.marketOverview.totalHolding.split("万")[0]}
									<span class="text-3xl text-gray-300 ml-1">万</span>
								</span>
								<span class="text-sm text-gray-400 mt-2 font-mono">
									流通车辆
								</span>
							</div>
							<div class="swiss-card p-10 bg-white flex-1 flex flex-col justify-center hover:border-gray-300">
								<span class="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
									年产量
								</span>
								<span class="text-6xl font-medium tracking-tighter text-black">
									{reportData.marketOverview.annualProduction.split("万")[0]}
									<span class="text-3xl text-gray-300 ml-1">万</span>
								</span>
								<span class="text-sm text-gray-400 mt-2 font-mono">
									生产能力
								</span>
							</div>
						</div>

						{/* Stats Column 2 (Dominance - Dark Card) */}
						<div class="lg:col-span-3 swiss-card p-10 bg-[#0a0a0a] text-white flex flex-col justify-between relative overflow-hidden">
							<div class="relative z-10">
								<span class="text-sm font-bold uppercase tracking-widest text-[#555] mb-2 block">
									主导力量
								</span>
								<h3 class="text-2xl font-bold mb-1">Honda</h3>
								<p class="text-base text-gray-500">守旧势力阻力</p>
							</div>

							<div class="relative z-10 text-right">
								<span class="text-8xl font-medium tracking-tighter text-[#d3fd50]">
									70<span class="text-4xl align-top">%</span>
								</span>
								<span class="block text-sm font-bold uppercase tracking-widest text-gray-500 mt-2">
									市场份额
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* --- Section 03: Geographic Clusters --- */}
			<section class="w-full border-y border-gray-100 py-16 lg:py-24 min-h-screen flex flex-col justify-center bg-[#fcfcfc]">
				<div class="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
					<div class="grid grid-cols-1 lg:grid-cols-3 gap-20">
						{/* Section Header */}
						<div>
							<h2 class="text-4xl font-medium tracking-tighter text-black mb-8">
								产业集群
							</h2>
							<p class="text-gray-500 text-lg font-light leading-relaxed">
								供应链高度集中在北部，形成了原材料与组装之间的高效闭环。
							</p>
						</div>

						{/* Clusters List */}
						<div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
							<For each={reportData.marketOverview.clusters}>
								{(cluster) => (
									<div class="swiss-card p-8 bg-white flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
										<div class="mb-8">
											<h3 class="text-2xl font-medium text-black mb-3">
												{cluster.name}
											</h3>
											<p class="text-xs font-bold uppercase tracking-widest text-gray-400">
												{cluster.desc}
											</p>
										</div>

										<div class="mt-auto space-y-8 pt-8 border-t border-gray-100">
											<div>
												<span class="text-xs text-gray-400 font-bold uppercase block mb-3 tracking-widest">
													整车厂布局
												</span>
												<div class="flex flex-wrap gap-2">
													<For each={cluster.brands}>
														{(brand) => (
															<span class="text-sm font-medium bg-gray-50 border border-gray-100 px-3 py-1.5 rounded text-gray-900">
																{brand}
															</span>
														)}
													</For>
												</div>
											</div>

											{cluster.suppliers && (
												<div>
													<span class="text-xs text-gray-400 font-bold uppercase block mb-3 tracking-widest">
														供应基地
													</span>
													<div class="grid grid-cols-2 gap-y-2">
														<For each={cluster.suppliers}>
															{(supplier) => (
																<span class="text-sm text-gray-500 block">
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
			<section class="w-full py-24 min-h-screen flex flex-col justify-center">
				<div class="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
					<div class="mb-20 border-b border-gray-200 pb-8">
						<span class="text-sm font-bold font-mono text-gray-500 uppercase tracking-widest block mb-3">
							02.
						</span>
						<h2 class="text-5xl md:text-6xl font-bold tracking-tighter text-black mb-6">
							竞争格局
						</h2>
						<p class="text-base text-gray-500 border-l-2 border-[#d3fd50] pl-4 italic max-w-2xl">
							{reportData.competition.note}
						</p>
					</div>

					<div class="space-y-24">
						<For each={reportData.competition.tiers}>
							{(tier, idx) => (
								<div>
									<div class="flex items-center gap-4 mb-12 border-b border-black pb-4">
										<span class="text-xl font-mono font-medium text-black">
											0{idx() + 1}
										</span>
										<span class="text-sm font-bold uppercase tracking-widest text-gray-500">
											{tier.name}
										</span>
									</div>

									<div class="space-y-16">
										<For each={tier.brands}>
											{(brand) => (
												<div class="flex flex-col">
													<BrandCard
														brand={brand}
														tier={(idx() + 1) as 1 | 2 | 3}
													/>
													{brand.models && brand.models.length > 0 && (
														<BrandModels models={brand.models} />
													)}
												</div>
											)}
										</For>
									</div>
								</div>
							)}
						</For>
					</div>
				</div>
			</section>

			{/* --- Section 05: Segments --- */}
			<section class="w-full bg-[#f9f9fb] border-t border-gray-200 py-24 min-h-screen flex flex-col justify-center">
				<div class="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
					<div class="mb-20 border-b border-gray-200 pb-8">
						<span class="text-sm font-bold font-mono text-gray-500 uppercase tracking-widest block mb-3">
							03.
						</span>
						<h2 class="text-5xl md:text-6xl font-bold tracking-tighter text-black">
							细分市场
						</h2>
					</div>

					<div class="grid gap-8">
						<SegmentCard segment={reportData.segments[0]} />
						<SegmentCard segment={reportData.segments[1]} />
						<SegmentCard segment={reportData.segments[2]} />
					</div>
				</div>
			</section>

			{/* --- Section 04: Supply Chain --- */}
			<section class="w-full py-24 min-h-screen flex flex-col justify-center">
				<div class="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
					<div class="mb-20 border-b border-gray-200 pb-8">
						<span class="text-sm font-bold font-mono text-gray-500 uppercase tracking-widest block mb-3">
							04.
						</span>
						<h2 class="text-5xl md:text-6xl font-bold tracking-tighter text-black">
							供应链与制造痛点
						</h2>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
						<div class="swiss-card p-10 bg-white">
							<h3 class="text-2xl font-medium tracking-tight mb-10">供应链</h3>
							<div class="space-y-6">
								<For each={reportData.infrastructure.supplyChain.details}>
									{(detail) => (
										<div class="flex justify-between items-baseline border-b border-gray-100 pb-2">
											<span class="text-sm font-bold uppercase tracking-widest text-gray-900 w-1/3">
												{detail.label}
											</span>
											<span class="text-lg font-light text-gray-600 w-2/3 text-right">
												{detail.value}
											</span>
										</div>
									)}
								</For>
							</div>
						</div>

						<div class="swiss-card p-10 bg-white">
							<h3 class="text-2xl font-medium tracking-tight mb-10">
								壁垒 / 痛点
							</h3>
							<div class="space-y-6">
								<For each={reportData.infrastructure.operations.details}>
									{(detail) => (
										<div class="flex justify-between items-baseline border-b border-gray-100 pb-2">
											<span class="text-sm font-bold uppercase tracking-widest text-gray-900 w-1/3">
												{detail.label}
											</span>
											<span class="text-lg font-light text-gray-600 w-2/3 text-right">
												{detail.value}
											</span>
										</div>
									)}
								</For>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* --- Section 05: Risks --- */}
			<section class="w-full py-24 min-h-screen flex flex-col justify-center">
				<div class="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
					<div class="mb-20 border-b border-gray-200 pb-8">
						<span class="text-sm font-bold font-mono text-gray-500 uppercase tracking-widest block mb-3">
							05.
						</span>
						<h2 class="text-5xl md:text-6xl font-bold tracking-tighter text-black">
							政策环境与风险提示
						</h2>
					</div>

					<div class="bg-[#0a0a0a] text-white rounded-lg p-10 lg:p-16 flex flex-col relative overflow-hidden min-h-[500px]">
						<div
							class="absolute inset-0 opacity-20"
							style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMmIyYjJiIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+');"
						></div>

						<div class="relative z-10">
							<span class="text-sm font-bold font-mono text-[#d3fd50] uppercase tracking-widest mb-8 block">
								严重警告
							</span>
							<h3 class="text-5xl font-medium tracking-tighter mb-16 !text-white">
								战略风险
							</h3>

							<div class="space-y-16">
								<div>
									<h4 class="text-xl font-medium mb-4 border-l-2 border-[#d3fd50] pl-6 !text-white">
										保护主义
									</h4>
									<p class="text-base text-gray-400 leading-relaxed font-light pl-6">
										{reportData.risks.protective.desc}
									</p>
								</div>
								<div>
									<h4 class="text-xl font-medium mb-4 border-l-2 border-white pl-6 !text-white">
										知识产权
									</h4>
									<p class="text-base text-gray-400 leading-relaxed font-light pl-6">
										{reportData.risks.ip.desc}
									</p>
								</div>
							</div>
						</div>

						<div class="mt-auto pt-16 relative z-10">
							<div class="w-full h-px bg-gray-800 mb-6"></div>
							<div class="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400">
								<span>仅限内部使用</span>
								<span>本节结束</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* --- Footer --- */}
			<footer class="bg-white border-t border-gray-100 py-16 text-center">
				<span class="text-4xl font-bold tracking-tighter text-black">2026</span>
				<span class="block text-xs font-bold uppercase tracking-widest text-gray-400 mt-4">
					越南电动车调研报告
				</span>
			</footer>
		</main>
	);
}
