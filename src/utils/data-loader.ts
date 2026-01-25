export const reportData = {
	meta: {
		title: "2025-2026年越南电动两轮车市场",
		subtitle: "越南电动两轮车市场调研",
		date: "2025年1月",
		author: "翁树军、杨扬",
	},
	marketOverview: {
		totalHolding: "8,000万",
		annualProduction: "350万",
		dominantPlayer: "Honda (占70%以上份额)",
		status: "从燃油车向电动车快速切换的早中期阶段",
		clusters: [
			{
				name: "兴安省 (Hung Yen)",
				desc: "配套厂家最多，产业集中度高",
				brands: [
					"台铃 (Tailg)",
					"Osakar",
					"JVC",
					"Victoria",
					"Detech",
					"同明",
					"赛鸽 (Saige)",
					"Souda",
				],
				suppliers: ["精锐 (Elite)", "昊旺"],
			},
			{
				name: "北宁省 (Bac Ninh)",
				desc: "雅迪等大型企业聚集地",
				brands: ["雅迪 (Yadea)", "Powelldd (Aima)", "DV Motor", "SMB"],
			},
		],
	},
	competition: {
		tiers: [
			{
				name: "第一梯队：绝对统领",
				brands: [
					{
						name: "VinFast",
						logo: "/logos/Vinfast_logo.png",
						yield2025: "40万辆",
						plan2026: "150万辆",
						desc: "本土龙头。依托 Vingroup (越南版三星) 集团之力，拥有汽车级研发标准与全套开发体系。在通勤市场确立统治地位，对越南电动两轮车行业实施降维打击。",
					},
				],
			},
			{
				name: "第二梯队：强势竞对",
				brands: [
					{
						name: "雅迪 (Yadea)",
						logo: "/logos/Yadea_Logo.png",
						yield2025: "15万辆",
						plan2026: "30万辆",
						desc: "350亩新厂房搬迁至北江，产能大幅扩张。",
					},
				],
			},
			{
				name: "第三梯队：潜力增长与细分玩家",
				brands: [
					{
						name: "Detech",
						logo: "/logos/Detech_logo.png",
						yield2025: "6万辆",
						plan2026: "15万辆",
						desc: "本土强势品牌。",
					},
					{
						name: "JVC",
						logo: "/logos/Jvc_logo.png",
						yield2025: "6万辆",
						plan2026: "10万辆",
						desc: "新建现代化工厂2.2万平米。",
					},
					{
						name: "DV Motor",
						logo: "/logos/dvmotor_logo.jpg",
						yield2025: "5万辆",
						plan2026: "10万辆",
						desc: "联合 Kazuki 品牌运营。",
					},
					{
						name: "台铃 (Tailg)",
						logo: "/logos/tailg_logo.webp",
						yield2025: "5万辆",
						plan2026: "15万辆",
						desc: "门店300+。目标激进，重点开发 B2B 市场。",
					},
					{
						name: "Osakar",
						logo: "/logos/Osakar_logo.jpg",
						yield2025: "4万辆",
						plan2026: "未知",
						desc: "体系健全，具备自主开发能力。",
					},
					{
						name: "Victoria",
						logo: "/logos/Victoria_logo.jpg",
						yield2025: "3万辆",
						plan2026: "8万辆",
						desc: "目前以油车为主，正处于电动化转型中。",
					},
					{
						name: "Powelldd (Aima)",
						logo: "/logos/Powelldd_logo.webp",
						yield2025: "3,000辆",
						plan2026: "6万辆",
						desc: "当前基数小，增长目标非常激进 (20倍增长)。",
					},
					{
						name: "DKBike",
						logo: "/logos/DK_logo.jpg",
						yield2025: "3万辆",
						plan2026: "-",
						desc: "稳定玩家。",
					},
					{
						name: "Dibao",
						logo: "/logos/Dibao_logo.webp",
						yield2025: "3万辆",
						plan2026: "-",
						desc: "稳定玩家。",
					},
					{
						name: "Dat Bike",
						logo: "/logos/datbike_logo.png",
						yield2025: "1.5万辆",
						plan2026: "-",
						desc: "黑马。主打中高性能电动车，差异化定位，发展迅猛。",
					},
				],
			},
		],
	},
	segments: [
		{
			title: "学生市场",
			tags: ["存量主力", "价格敏感"],
			features: "解决上学通勤需求",
			details: [
				{ label: "第一梯队 (高保有量)", value: "特斯拉款、天津款" },
				{ label: "第二梯队 (下滑)", value: "Gogo款 (表现下滑严重)" },
				{
					label: "当红爆款",
					value: "天园 M1 (几乎每家大厂都有大量库存，未开年订单做准备)",
				},
			],
		},
		{
			title: "成人/通勤市场",
			tags: ["增量关键", "品牌驱动"],
			features: "替代燃油摩托车，看重品质与品牌",
			insight:
				"VinFast 难以撼动，雅迪第二。同款 '007' 车型对比：Victoria 油车版淡季稳定销售 vs JVC 铅酸电动版销售疲软。",
			strategy: "计划推锂电版以求突破。",
		},
		{
			title: "B2B / 外卖市场",
			tags: ["经济性驱动", "成本为王"],
			features: "极致的运营成本优势",
			costComparison: {
				ice: "750-800 RMB/月",
				ev: "100 RMB/月",
				ratio: "1/8",
			},
			conclusion: "巨大的成本差将加速物流配送领域的电动化。",
		},
	],
	infrastructure: {
		supplyChain: {
			title: "供应链本地化",
			details: [
				{ label: "趋势", value: "加速本地化，中国零部件通过借厂、合资进入。" },
				{
					label: "精锐 (Elite)",
					value:
						"规模大，注塑强，可配全套散件。擅长快速仿制 (买VinFast车回国仿)。",
				},
				{ label: "昊旺", value: "专注车架，雅迪深度绑定。" },
				{ label: "成本分析", value: "越南本地烤漆成本比中国贵 70-90 RMB。" },
			],
		},
		operations: {
			title: "生产与运营痛点",
			details: [
				{
					label: "登检 (核心壁垒)",
					value:
						"流程长、配件多、极度复杂。LD等能提供全套散件并解决登检的公司生存空间大。",
				},
				{
					label: "售后难题",
					value: "车型五花八门，SKU管理极其复杂，导致维护成本高昂。",
				},
			],
		},
	},
	risks: {
		protective: {
			title: "保护主义",
			desc: "“以旧换新”等红利政策大概率仅由本土品牌独占，外资品牌难以直接受益。",
		},
		ip: {
			title: "知识产权风险",
			desc: "本土工厂 (如精锐、Osakar) 具备极强的逆向研发和仿制能力，合作需注意技术保护。",
		},
	},
};
