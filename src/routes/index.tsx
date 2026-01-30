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
						越南电动车市场调研报告
						<span class="block text-[#d3fd50] mt-4">2025-26</span>
					</h1>

					<div class="mt-12 flex justify-center items-center gap-4">
						<span class="px-4 py-2 bg-black text-white rounded-full text-sm font-bold tracking-widest uppercase">
							作者
						</span>
						<span class="text-xl font-medium text-gray-900">
							{reportData.meta.author}
						</span>
					</div>
				</div>
			</section>

			{/* --- Section 02: Macro Overview --- */}
			<section class="w-full py-16 lg:py-24 min-h-screen flex flex-col justify-center">
				<div class="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
					<div class="mb-20 border-b border-gray-200 pb-8">
						<h2 class="text-5xl md:text-6xl font-bold tracking-tighter text-black">
							一、 市场宏观概况
						</h2>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
						{/* Text Block */}
						<div class="lg:col-span-6 swiss-card p-12 flex flex-col justify-center bg-white">
							<h3 class="text-3xl font-medium mb-8 tracking-tight">
								机会窗口与格局
							</h3>
							<p class="text-gray-500 text-lg leading-relaxed mb-12 font-light">
								{reportData.marketOverview.status}{" "}
								{reportData.marketOverview.geographicFeature}
							</p>
							<div class="mt-auto pt-8 border-t border-gray-100">
								<span class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
									禁摩推动者
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
									社会保有量
								</span>
							</div>
							<div class="swiss-card p-10 bg-white flex-1 flex flex-col justify-center hover:border-gray-300">
								<span class="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
									年生产量
								</span>
								<span class="text-6xl font-medium tracking-tighter text-black">
									{reportData.marketOverview.annualProduction.split("万")[0]}
									<span class="text-3xl text-gray-300 ml-1">万</span>
								</span>
								<span class="text-sm text-gray-400 mt-2 font-mono">
									年总产量稳定
								</span>
							</div>
						</div>

						{/* Stats Column 2 (Dominance - Dark Card) */}
						<div class="lg:col-span-3 swiss-card p-10 bg-[#0a0a0a] text-white flex flex-col justify-between relative overflow-hidden">
							<div class="relative z-10">
								<span class="text-sm font-bold uppercase tracking-widest text-[#555] mb-2 block">
									燃油车霸主
								</span>
								<h3 class="text-2xl font-bold mb-1">Honda (本田)</h3>
								<p class="text-base text-gray-500">统治燃油两轮车多年</p>
							</div>

							<div class="relative z-10 text-right">
								<span class="text-8xl font-medium tracking-tighter text-[#d3fd50]">
									70<span class="text-4xl align-top">%</span>
								</span>
								<span class="block text-sm font-bold uppercase tracking-widest text-gray-500 mt-2">
									市场占有率
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* --- Section 03: Geographic Clusters --- */}
			<section class="w-full border-y border-gray-100 py-16 lg:py-24 min-h-screen flex flex-col justify-center bg-white">
				<div class="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
					<div class="mb-20 border-b border-gray-200 pb-8">
						<h2 class="text-3xl md:text-4xl font-bold tracking-tighter text-black">
							产业布局分布
						</h2>
					</div>
					<div class="grid grid-cols-1 lg:grid-cols-3 gap-20">
						{/* Section Header */}
						<div>
							<h3 class="text-3xl font-medium tracking-tighter text-black mb-8">
								地理集群
							</h3>
							<p class="text-gray-500 text-lg font-light leading-relaxed">
								越南两轮车产业呈现高度的“北重南轻”集群特征，中国头部品牌和核心配套厂主要分布在兴安、北江与北宁省。
							</p>
						</div>

						{/* Clusters List */}
						<div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
							<For each={reportData.marketOverview.clusters}>
								{(cluster) => (
									<div class="swiss-card p-8 bg-white border border-gray-100 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
										<div class="mb-8">
											<h3 class="text-2xl font-medium text-black mb-3">
												{cluster.name}
											</h3>
											<p class="text-xs font-bold uppercase tracking-widest text-gray-500 leading-relaxed">
												{cluster.desc}
											</p>
										</div>

										<div class="mt-auto space-y-8 pt-8 border-t border-gray-100">
											<div>
												<span class="text-xs text-gray-400 font-bold uppercase block mb-3 tracking-widest">
													入驻整车企业
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
														配套资源/核心厂
													</span>
													<div class="grid grid-cols-2 gap-y-2">
														<For each={cluster.suppliers}>
															{(supplier) => (
																<span class="text-sm text-gray-500 block font-light">
																	• {supplier}
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

			{/* --- Section 04: Regulations --- */}
			<section class="w-full py-16 lg:py-24 min-h-screen flex flex-col justify-center bg-gray-50">
				<div class="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
					<div class="mb-20 border-b border-gray-200 pb-8">
						<h2 class="text-5xl md:text-6xl font-bold tracking-tighter text-black">
							二、 法规与技术标准
						</h2>
						<p class="mt-4 text-gray-500 font-medium">
							{reportData.regulations.note}
						</p>
					</div>

					{/* Categories Table */}
					<div class="mb-20 overflow-x-auto">
						<table class="w-full text-left border-collapse">
							<thead>
								<tr class="border-b-2 border-black">
									<th class="py-4 text-sm font-bold uppercase tracking-widest text-gray-400 w-1/3">
										车辆分类
									</th>
									<th class="py-4 text-sm font-bold uppercase tracking-widest text-gray-400 w-1/3">
										指标限制
									</th>
									<th class="py-4 text-sm font-bold uppercase tracking-widest text-gray-400 w-1/3">
										关键特征
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								<For each={reportData.regulations.categories}>
									{(cat) => (
										<tr>
											<td class="py-6 font-bold text-xl text-black">
												{cat.type}
											</td>
											<td class="py-6 text-gray-700 whitespace-pre-line">
												{cat.definition}
											</td>
											<td class="py-6 text-gray-600 font-light">
												{cat.feature}
											</td>
										</tr>
									)}
								</For>
							</tbody>
						</table>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
						{/* Safety requirements */}
						<div class="swiss-card p-10 bg-white">
							<h3 class="text-2xl font-medium tracking-tight mb-8">
								核心技术安全要求
							</h3>
							<div class="space-y-6">
								<For each={reportData.regulations.safetyRequirements}>
									{(req) => (
										<div class="flex flex-col border-b border-gray-100 pb-4">
											<span class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
												{req.label}
											</span>
											<span class="text-base text-gray-800 font-light leading-relaxed">
												{req.value}
											</span>
										</div>
									)}
								</For>
							</div>
						</div>

						{/* Traffic Rules */}
						<div class="swiss-card p-10 bg-[#0a0a0a] text-white">
							<h3 class="text-2xl font-medium tracking-tight mb-8 text-white!">
								道路交通管理规则
							</h3>
							<div class="space-y-10">
								<For each={reportData.regulations.trafficRules}>
									{(rule, idx) => (
										<div class="flex gap-6">
											<span class="text-4xl font-mono text-[#d3fd50] leading-none">
												0{idx() + 1}
											</span>
											<p class="text-lg text-gray-400 font-light leading-relaxed">
												{rule}
											</p>
										</div>
									)}
								</For>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* --- Section 05: Competition --- */}
			<section class="w-full py-24 min-h-screen flex flex-col justify-center bg-[#fcfcfc]">
				<div class="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
					<div class="mb-20 border-b border-gray-200 pb-8">
						<h2 class="text-5xl md:text-6xl font-bold tracking-tighter text-black mb-6">
							三、 竞争格局与车型对标
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
											Tier 0{idx() + 1}
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

			{/* --- Section 06: Segments --- */}
			<section class="w-full bg-[#f9f9fb] border-t border-gray-200 py-24 min-h-screen flex flex-col justify-center">
				<div class="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
					<div class="mb-20 border-b border-gray-200 pb-8">
						<h2 class="text-5xl md:text-6xl font-bold tracking-tighter text-black">
							四、 细分市场与产品趋势
						</h2>
					</div>

					<div class="grid gap-8">
						<For each={reportData.segments}>
							{(segment) => <SegmentCard segment={segment} />}
						</For>
					</div>
				</div>
			</section>

			{/* --- Section 07: Supply Chain & Production --- */}
			<section class="w-full py-24 min-h-screen flex flex-col justify-center bg-white">
				<div class="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
					<div class="mb-20 border-b border-gray-200 pb-8">
						<h2 class="text-5xl md:text-6xl font-bold tracking-tighter text-black">
							五、 供应链与制造痛点
						</h2>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
						<div class="swiss-card p-10 bg-white border border-gray-100">
							<h3 class="text-2xl font-medium tracking-tight mb-10">
								供应链核心伙伴
							</h3>
							<div class="space-y-6">
								<For each={reportData.infrastructure.supplyChain.details}>
									{(detail) => (
										<div class="flex flex-col border-b border-gray-100 pb-4 last:border-0">
											<span class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
												{detail.label}
											</span>
											<span class="text-lg font-light text-gray-700 leading-relaxed">
												{detail.value}
											</span>
										</div>
									)}
								</For>
							</div>
						</div>

						<div class="swiss-card p-10 bg-white border border-gray-100">
							<h3 class="text-2xl font-medium tracking-tight mb-10">
								生产与作业痛点
							</h3>
							<div class="space-y-6">
								<For each={reportData.infrastructure.production.details}>
									{(detail) => (
										<div class="flex flex-col border-b border-gray-100 pb-4 last:border-0">
											<span class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
												{detail.label}
											</span>
											<span class="text-lg font-light text-gray-700 leading-relaxed">
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

			{/* --- Footer --- */}
			<footer class="bg-white border-t border-gray-100 py-24 text-center">
				<span class="text-8xl font-bold tracking-tighter text-black opacity-10">
					VIETNAM
				</span>
				<div class="mt-8 flex justify-center items-center gap-4">
					<span class="text-sm font-bold uppercase tracking-widest text-gray-400">
						报告完成日期: {reportData.meta.date}
					</span>
				</div>
			</footer>
		</main>
	);
}
