import { Title } from "@solidjs/meta";
import { createSignal, For, onMount } from "solid-js";
import "./index.css";
import { reportData } from "~/utils/data-loader";

interface ExportOptions {
	filename: string;
	slideSize: string;
	exclude: string[];
	width: number;
	height: number;
}

let domToPptx:
	| ((elements: HTMLElement[], options: ExportOptions) => Promise<void>)
	| undefined;

export default function Report() {
	const [isExporting, setIsExporting] = createSignal(false);

	onMount(async () => {
		const module = await import("dom-to-pptx");
		domToPptx = (module.default ||
			module.exportToPptx ||
			module) as unknown as (
			elements: HTMLElement[],
			options: ExportOptions,
		) => Promise<void>;
	});

	const handleExport = async () => {
		if (!domToPptx) {
			alert("Library not loaded yet");
			return;
		}

		setIsExporting(true);
		const slides = Array.from(
			document.querySelectorAll(".slide"),
		) as HTMLElement[];

		if (slides.length > 0) {
			try {
				await domToPptx(slides, {
					filename: "SriLanka_EV_Report_2026.pptx",
					slideSize: "16x9",
					exclude: [".no-export"],
					width: 1280,
					height: 720,
				});
			} catch (error) {
				console.error("Export failed:", error);
				alert("Failed to export PPTX.");
			}
		}
		setIsExporting(false);
	};

	const topBrands = reportData.brandSales.slice(0, 5);
	const topRegions = reportData.allRegionalData.slice(0, 4);

	return (
		<main class="report-container">
			<Title>{reportData.meta.title}</Title>

			<div class="header-actions no-export">
				<button type="button" class="export-btn" onClick={handleExport} disabled={isExporting()}>
					{isExporting() ? "导出中..." : "导出 PPT"}
				</button>
			</div>

			<div id="report-content" class="slide-deck">
				{/* Slide 1: Cover Page */}
				<section class="slide title-slide">
					<div class="slide-content">
						<div class="company-logo">EV INSIGHTS | 电动汽车行业洞察</div>
						<h1>{reportData.meta.title}</h1>
						<h2>{reportData.meta.subtitle}</h2>
						<div class="decor-line"></div>
						<div class="meta">
							<span class="meta-item">{reportData.meta.date}</span>
							<span class="meta-divider">|</span>
							<span class="meta-item">{reportData.meta.author}</span>
						</div>
					</div>
				</section>

				{/* Slide 2: Executive Summary */}
				<section class="slide text-slide">
					<div class="slide-header">
						<span class="slide-number">01</span>
						<h3>执行摘要 (Executive Summary)</h3>
					</div>
					<div class="slide-body">
						<div class="kpi-grid">
							<div class="kpi-card">
								<div class="kpi-label">月度销量峰值</div>
								<div class="kpi-value">{reportData.monthlyTotals[0].total.toLocaleString()}</div>
								<div class="kpi-period">2025年8月</div>
							</div>
							<div class="kpi-card">
								<div class="kpi-label">市场领先品牌总销量</div>
								<div class="kpi-value">7,695</div>
								<div class="kpi-period">Yadea (雅迪)</div>
							</div>
							<div class="kpi-card highlight-green">
								<div class="kpi-label">CKD 组装关税</div>
								<div class="kpi-value">10%</div>
								<div class="kpi-period">本地组装激励费率</div>
							</div>
							<div class="kpi-card highlight-red">
								<div class="kpi-label">CBU 整车关税</div>
								<div class="kpi-value">30%</div>
								<div class="kpi-period">全进口费率</div>
							</div>
						</div>
						<div class="key-insight">
							<div class="insight-label">策略洞察 (Strategic Insight)</div>
							<div class="insight-content">
								CKD本地组装较整车进口具有 <strong>20% 的成本优势</strong>，
								完全符合政府关于本地增值 (LVA) 达到 30% 的政策要求。
							</div>
						</div>
					</div>
				</section>

				{/* Slide 3: Market Trend Analysis */}
				<section class="slide text-slide">
					<div class="slide-header">
						<span class="slide-number">02</span>
						<h3>市场趋势分析 (Market Trend)</h3>
					</div>
					<div class="slide-body two-col">
						<div class="col">
							<div class="chart-placeholder">
								<div class="chart-title">月度销量走势 (单位：台)</div>
								<div class="bar-chart">
									<For each={reportData.monthlyTotals}>
										{(item) => (
											<div class="bar-group">
												<div
													class="bar"
													style={{ height: `${(item.total / 5000) * 100}%` }}
												>
													<span class="bar-value">{item.total}</span>
												</div>
												<span class="bar-label">{item.month}</span>
											</div>
										)}
									</For>
								</div>
							</div>
						</div>
						<div class="col insights-col">
							<div class="findings-box">
								<div class="findings-title">核心发现 (Key Findings)</div>
								<ul class="findings-list">
									<li>销量自8月峰值后呈现季节性回落</li>
									<li>电动汽车 (EV) 市场渗透率保持平稳</li>
									<li>雅迪 (Yadea) 以超过 50% 的份额占据绝对主导地位</li>
								</ul>
							</div>
							<div class="highlight-box">
								<div class="highlight-label">市场标杆品牌</div>
								<div class="highlight-value">Yadea (雅迪)</div>
								<div class="highlight-metric">7,695 台 (8月-11月累计)</div>
							</div>
						</div>
					</div>
				</section>

				{/* Slide 4: Brand Performance */}
				<section class="slide text-slide">
					<div class="slide-header">
						<span class="slide-number">03</span>
						<h3>品牌表现排名 (Brand Ranking)</h3>
					</div>
					<div class="slide-body">
						<div class="brand-table">
							<div class="brand-row header">
								<div class="brand-col rank">排名</div>
								<div class="brand-col name">品牌名称</div>
								<div class="brand-col sales">总销量</div>
								<div class="brand-col share">市场份额</div>
							</div>
							<For each={topBrands}>
								{(brand, index) => (
									<div class={`brand-row ${index() === 0 ? 'leader' : ''}`}>
										<div class="brand-col rank">{index() + 1}</div>
										<div class="brand-col name">{brand.brand}</div>
										<div class="brand-col sales">{brand.total.toLocaleString()}</div>
										<div class="brand-col share">
											<div class="share-bar">
												<div class="share-fill" style={{ width: `${(brand.total / 7695) * 100}%` }}></div>
											</div>
											<span class="share-pct">{((brand.total / 14031) * 100).toFixed(1)}%</span>
										</div>
									</div>
								)}
							</For>
						</div>
						<div class="table-note">
							注：电动摩托车 (E-Motorcycle) 4月至11月累计注册量为：{reportData.eMotorcycle.aug + reportData.eMotorcycle.sep + reportData.eMotorcycle.oct + reportData.eMotorcycle.nov} 台
						</div>
					</div>
				</section>

				{/* Slide 4: Feature Comparison */}
				<section class="slide text-slide">
					<div class="slide-header">
						<span class="slide-number">04</span>
						<h3>核心特性对比 (Feature Comparison)</h3>
					</div>
					<div class="slide-body">
						<div class="comparison-table">
							<div class="comp-row header">
								<div class="comp-col feature">特性 (Feature)</div>
								<div class="comp-col brand">Ather / TVS</div>
								<div class="comp-col brand">雅迪 (石墨烯车型)</div>
								<div class="comp-col brand">经济型/通用品牌</div>
							</div>
							<For each={reportData.featureComparison}>
								{(item) => (
									<div class="comp-row">
										<div class="comp-col feature">{item.feature}</div>
										<div class="comp-col val highlight-blue">{item.atherTvs}</div>
										<div class="comp-col val highlight-teal">{item.yadea}</div>
										<div class="comp-col val">{item.budget}</div>
									</div>
								)}
							</For>
						</div>
					</div>
				</section>

				{/* Slide 5: Range Comparison */}
				<section class="slide text-slide">
					<div class="slide-header">
						<span class="slide-number">05</span>
						<h3>续航里程对比 (Range Comparison)</h3>
					</div>
					<div class="slide-body">
						<div class="range-table">
							<div class="range-row header">
								<div class="range-col model">品牌/型号</div>
								<div class="range-col battery">电池类型</div>
								<div class="range-col lab">实验室续航</div>
								<div class="range-col real">估计实际续航</div>
							</div>
							<For each={reportData.rangeComparison}>
								{(item) => (
									<div class="range-row">
										<div class="range-col model">{item.model}</div>
										<div class="range-col battery">{item.battery}</div>
										<div class="range-col lab">{item.labRange}</div>
										<div class="range-col real highlight-green">{item.realRange}</div>
									</div>
								)}
							</For>
						</div>
						<div class="key-insight">
							<div class="insight-label">续航表现分析</div>
							<div class="insight-content">
								Ather 450X 在能量密度和实际转化率上领先；雅迪石墨烯型号在寿命与性价比之间取得了良好平衡。
							</div>
						</div>
					</div>
				</section>

				{/* Slide 6: Regional Analysis */}
				<section class="slide text-slide">
					<div class="slide-header">
						<span class="slide-number">06</span>
						<h3>区域市场分析 (Regional Analysis)</h3>
					</div>
					<div class="slide-body">
						<div class="region-grid">
							<For each={topRegions}>
								{(region) => (
									<div class="region-card">
										<div class="region-badge">{region.province}</div>
										<div class="region-name">{region.district}</div>
										<div class="region-data">
											<div class="data-row">
												<span class="data-label">燃油车 (ICE)</span>
												<span class="data-value">{region.ice.toLocaleString()}</span>
											</div>
											<div class="data-row highlight">
												<span class="data-label">电动车 (EV)</span>
												<span class="data-value">{region.ev}</span>
											</div>
											<div class="data-row">
												<span class="data-label">EV 渗透率</span>
												<span class="data-value accent">{((region.ev / (region.ice + region.ev)) * 100).toFixed(1)}%</span>
											</div>
										</div>
									</div>
								)}
							</For>
						</div>
						<div class="key-insight">
							<div class="insight-label">区域扩张策略</div>
							<div class="insight-content">
								西部省 (科伦坡、甘帕哈) 是核心目标市场，拥有最强的购买力及最完善的电动车基础设施。
							</div>
						</div>
					</div>
				</section>

				{/* Slide 7: Target Demographics */}
				<section class="slide text-slide">
					<div class="slide-header">
						<span class="slide-number">07</span>
						<h3>目标客户画像 (Customer Segments)</h3>
					</div>
					<div class="slide-body two-col">
						<div class="col">
							<div class="segment-card">
								<div class="segment-header">电动三轮车细分市场</div>
								<div class="segment-body">
									<div class="segment-item">
										<span class="item-label">年龄范围</span>
										<span class="item-value">30-55 岁</span>
									</div>
									<div class="segment-item">
										<span class="item-label">性别构成</span>
										<span class="item-value">主要为男性</span>
									</div>
									<div class="segment-item">
										<span class="item-label">职业类型</span>
										<span class="item-value">个体司机、物流从业者、中小企业主</span>
									</div>
									<div class="segment-item">
										<span class="item-label">核心动机</span>
										<span class="item-value">创造收入、降低运营成本</span>
									</div>
								</div>
							</div>
						</div>
						<div class="col">
							<div class="segment-card">
								<div class="segment-header">电动两轮车细分市场</div>
								<div class="segment-body">
									<div class="segment-item">
										<span class="item-label">年龄范围</span>
										<span class="item-value">18-45 岁</span>
									</div>
									<div class="segment-item">
										<span class="item-label">性别构成</span>
										<span class="item-value">男女均衡</span>
									</div>
									<div class="segment-item">
										<span class="item-label">职业类型</span>
										<span class="item-value">学生、企业员工、零工经济从业者</span>
									</div>
									<div class="segment-item">
										<span class="item-label">核心动机</span>
										<span class="item-value">日常通勤、节省燃油开支</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Slide 8: Infrastructure Assessment */}
				<section class="slide text-slide">
					<div class="slide-header">
						<span class="slide-number">08</span>
						<h3>基础设施评估 (Infrastructure)</h3>
					</div>
					<div class="slide-body">
						<div class="infra-grid">
							<div class="infra-card">
								<div class="infra-header">电网稳定性</div>
								<div class="infra-status status-good">基本可靠</div>
								<div class="infra-detail">高峰时段偶有间歇性断电；城市地区稳定性显著优于农村</div>
							</div>
							<div class="infra-card">
								<div class="infra-header">充电网络</div>
								<div class="infra-status status-warning">尚不充足</div>
								<div class="infra-detail">主要集中于主要城市中心；多数用户依赖个人充电方案</div>
							</div>
							<div class="infra-card">
								<div class="infra-header">日均行驶里程</div>
								<div class="infra-status status-info">约 38 km</div>
								<div class="infra-detail">单程平均 20-25 km；往返总里程多在 55-60 km 区间</div>
							</div>
							<div class="infra-card">
								<div class="infra-header">居民用电费率</div>
								<div class="infra-status status-info">2.5-65 LKR</div>
								<div class="infra-detail">采取阶梯计费模式；高用量段费率上涨明显</div>
							</div>
						</div>
					</div>
				</section>

				{/* Slide 9: Regulatory Framework */}
				<section class="slide text-slide">
					<div class="slide-header">
						<span class="slide-number">09</span>
						<h3>监管框架与政策 (Regulatory)</h3>
					</div>
					<div class="slide-body two-col">
						<div class="col">
							<div class="policy-box">
								<div class="policy-title">进口关税方案对比</div>
								<div class="tariff-compare">
									<div class="tariff-item cbu">
										<div class="tariff-type">CBU 整车进口</div>
										<div class="tariff-rate">30%</div>
										<div class="tariff-note">+ 附加进口税费</div>
									</div>
									<div class="tariff-divider">
										<span>vs</span>
									</div>
									<div class="tariff-item ckd">
										<div class="tariff-type">CKD 本地组装</div>
										<div class="tariff-rate">10%</div>
										<div class="tariff-note">政府产业扶持费率</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col">
							<div class="policy-box">
								<div class="policy-title">准入认证要求</div>
								<div class="cert-list">
									<div class="cert-item">
										<span class="cert-bullet"></span>
										<span>符合国际 EV 道路安全合规标准</span>
									</div>
									<div class="cert-item">
										<span class="cert-bullet"></span>
										<span>提供至少 3 年的电池及电机质保</span>
									</div>
									<div class="cert-item">
										<span class="cert-bullet"></span>
										<span>提交明确的电池回收与处理计划</span>
									</div>
									<div class="cert-item">
										<span class="cert-bullet"></span>
										<span>符合 DMT 对高压电力系统的标准要求</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="recommendation-bar">
						<strong>战略建议：</strong> 充分利用 10% 的 CKD 优惠关税进行本地化组装，确保满足 30% 本地增值要求以获取政策红利。
					</div>
				</section>

				{/* Slide 10: Closing */}
				<section class="slide title-slide closing-slide">
					<div class="slide-content">
						<div class="company-logo">EV INSIGHTS | 电动汽车行业洞察</div>
						<h1>谢谢聆听</h1>
						<div class="decor-line"></div>
						<div class="contact-info">
							<p>如需进一步的详细分析及战略咨询服务</p>
							<p class="contact-cta">请联系我们的研究团队</p>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
