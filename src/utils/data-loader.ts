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
		banPusher: "VinFast (温纳集团) 是禁摩令的主要推动者",
		clusters: [
			{
				name: "兴安省 (Hung Yen)",
				desc: "配套厂家最密集，租金 ~$3.5/㎡/月",
				brands: [
					"台铃 (Tailg)",
					"Osakar",
					"JVC",
					"Victoria",
					"Detech",
					"同明 (Dong Minh)",
					"赛鸽 (Saige)",
					"Souda",
				],
				suppliers: ["精锐 (Jingrui)", "昊旺 (Hao Wang)", "线束厂", "烤漆厂"],
			},
			{
				name: "北宁/北江 (Bac Ninh/Giang)",
				desc: "中国头部品牌基地，租金 ~$4.5/㎡/月",
				brands: ["雅迪 (Yadea)", "爱玛 (Aima)", "DV Motor", "SMB"],
			},
		],
	},
	competition: {
		tiers: [
			{
				name: "第一梯队：绝对统领（不计成本）",
				brands: [
					{
						name: "VinFast",
						logo: "/logos/Vinfast_logo.png",
						yield2025: "40万辆",
						plan2026: "150万辆",
						desc: "单车最高亏损 5000 RMB。垄断级生态链与断档级福利，民族认同感极高。依靠政策话语权实施降维打击。",
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
						desc: "350亩新厂房第一期3月开业。计划逐步淘汰老化车型(特斯拉款)。",
					},
				],
			},
			{
				name: "第三梯队：细分玩家与现状",
				brands: [
					{
						name: "Detech",
						logo: "/logos/Detech_logo.png",
						yield2025: "6万辆",
						plan2026: "15万辆",
						desc: "本土老牌，增长稳健。",
					},
					{
						name: "JVC",
						logo: "/logos/Jvc_logo.png",
						yield2025: "6万辆",
						plan2026: "10万辆",
						desc: "备战开年订单，拥有大量网红款库存及JP Motor贴牌库存。",
					},
					{
						name: "台铃 (Tailg)",
						logo: "/logos/tailg_logo.webp",
						yield2025: "5万辆",
						plan2026: "15万辆",
						desc: "受灵都(LD)套件质量问题困扰，明年重点转向 B2B 市场。",
					},
					{
						name: "DV Motor",
						logo: "/logos/dvmotor_logo.jpg",
						yield2025: "5万辆",
						plan2026: "10万辆",
						desc: "联合 Kazuki 品牌运营。",
					},
					{
						name: "Victoria",
						logo: "/logos/Victoria_logo.jpg",
						yield2025: "3万辆",
						plan2026: "8万辆",
						desc: "油改电转型中，11月订货售罄，看好 EX008 锂电版。",
					},
					{
						name: "DKBike",
						logo: "/logos/DK_logo.jpg",
						yield2025: "2万辆 (预计)",
						plan2026: "-",
						desc: "销量腰斩，从去年4万台跌至今年的2万台。",
					},
					{
						name: "爱玛 (Aima)",
						logo: "/logos/Powelldd_logo.webp",
						yield2025: "3,000辆",
						plan2026: "6万辆",
						desc: "基数小但目标最激进。",
					},
					{
						name: "Dat Bike",
						logo: "/logos/datbike_logo.png",
						yield2025: "1.5万辆",
						plan2026: "-",
						desc: "黑马。避开同质化竞争，主打中高性能差异化。",
					},
				],
			},
		],
	},
	segments: [
		{
			title: "学生市场",
			tags: ["存量主力", "方形大灯"],
			features: "天津款与特斯拉款为主流，方形大灯设计正流行。",
			details: [
				{ label: "设计趋势", value: "方形大灯盛行" },
				{ label: "现状", value: "雅迪拟逐步放弃特斯拉款" },
			],
		},
		{
			title: "成人/通勤市场",
			tags: ["锂电升级", "品牌驱动"],
			features: "VinFast 统治，锂电池是突破口。",
			insight:
				"铅酸版增长乏力。Victoria EX007 油车款稳定，锂电化转型是必然路径。",
			strategy: "各大厂纷纷布局锂电车型。",
		},
		{
			title: "B2B / 外卖配送",
			tags: ["经济性", "高端化潜力"],
			features: "运营成本仅为油车的 1/8。",
			details: [
				{ label: "爆款潜力", value: "72V 90Ah 大电池" },
				{ label: "设计需求", value: "长坐垫、大脚踏板、高续航" },
			],
			costComparison: {
				ice: "750-800 RMB/月",
				ev: "100 RMB/月",
				ratio: "1/8",
			},
		},
	],
	infrastructure: {
		supplyChain: {
			title: "供应链与制造",
			details: [
				{
					label: "昊旺 (Wu Wang)",
					value: "雅迪核心车架供应商。",
				},
				{
					label: "精锐 (Jingrui)",
					value: "极强逆向仿制能力(买VinFast样车回国仿)。",
				},
				{
					label: "灵都 (LD)",
					value: "套件商面临信任危机，质量控制是软肋。",
				},
				{ label: "成本痛点", value: "本地烤漆成本比中国贵 70-90 RMB。" },
			],
		},
		operations: {
			title: "运营环境",
			details: [
				{
					label: "登检流程",
					value: "极度复杂，虽然有套件商代办，但质量风险大。",
				},
				{
					label: "政策保护",
					value: "“以旧换新”等补贴大概率仅限本土品牌独占。",
				},
			],
		},
	},
	risks: {
		protective: {
			title: "政策风险",
			desc: "越南政府环保政策背后有 VinFast 等本土巨头游说，排他性政策明显。",
		},
		ip: {
			title: "竞争风险",
			desc: "本地组装厂日益看重口碑，纯贸易型套件商面临被清洗风险。",
		},
	},
};
