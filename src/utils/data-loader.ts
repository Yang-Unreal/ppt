export const reportData = {
	meta: {
		title: "2025-2026年越南电动两轮车制造业供应链拓展报告",
		subtitle: "越南电动两轮车市场调研",
		date: "2026年1月",
		author: "翁树军、杨扬",
	},
	marketOverview: {
		totalHolding: "8,000万",
		annualProduction: "350万",
		dominantPlayer: "Honda (本田) 目前仍占据燃油车市场70%以上份额",
		status: "市场正处于“油改电”的关键窗口期。",
		banPusher:
			"VinFast 是“禁摩令”的主要提议者和推动者，其利用强大的政商影响力加速这一进程。",
		geographicFeature: "产业呈现高度的“北重南轻”集群特征。",
		clusters: [
			{
				name: "兴安省 (Hung Yen) —— 配套与组装核心区",
				desc: "供应链最完善，成本洼地。租金约 3.5美金/平米/月",
				brands: [
					"台铃 (Tailg)",
					"Osakar",
					"JVC",
					"Victoria",
					"Detech (Espero)",
					"同明 (Dong Minh)",
					"赛鸽 (Saige)",
					"Souda",
				],
				suppliers: ["精锐", "昊旺", "烤漆厂", "线束厂", "灵都 (LD) 散件贸易商"],
			},
			{
				name: "北宁省 (Bac Ninh)  —— 头部品牌制造基地",
				desc: "大品牌集中地。租金约 4.5美金/平米/月",
				brands: ["雅迪 (Yadea)", "爱玛 (Aima)", "DV Motor", "SMB"],
			},
		],
	},
	regulations: {
		note: "基于越南最新法律（Law No. 36/2024/QH15）及国家技术标准（QCVN 14:2024/BGTVT, QCVN 68:2013/BGTVT 修正案）",
		categories: [
			{
				type: "电动自行车 (E-bike)",
				definition:
					"1. 电机功率 ≤ 250W\n2. 设计时速 ≤ 25 km/h\n3. 整车质量(含电池) ≤ 40 kg",
				feature: "必须具备脚踏板，且能通过脚踏驱动行驶。",
			},
			{
				type: "电动轻便摩托车 (E-Moped)",
				definition: "1. 设计时速 ≤ 50 km/h\n2. 电机最大功率 ≤ 4 kW",
				feature: "属于 L1 组。免驾照但骑行者需年满16岁，但目前并未严格执行。",
			},
			{
				type: "电动摩托车 (E-Motorcycle)",
				definition: "1. 设计时速 > 50 km/h\n2. 或者 电机功率 > 4 kW",
				feature: "属于 L3 组。需要驾照，也是VinFast主力车型区间。",
			},
		],
		safetyRequirements: [
			{
				label: "身份标识",
				value:
					"车辆必须具备唯一的车架号（VIN）和电机号，且不得有任何擦改痕迹。",
			},
			{
				label: "车身安全",
				value: "车身表面严禁有半径小于 0.5mm 的锐利边缘（防割伤设计）。",
			},
			{
				label: "整车尺寸",
				value: "全长 ≤ 4.0m，全宽（两轮）≤ 1.0m，全高 ≤ 2.5m。",
			},
			{
				label: "高压安全",
				value:
					"直流电（DC）电压在 60V 至 1500V 之间被定义为“高压”，需符合特定绝缘安全标准。",
			},
			{
				label: "制动系统",
				value:
					"总制动力不得小于车辆空载重量的 50%。三轮车驻车制动需能在 18% 坡度上保持满载静止 5 分钟。",
			},
			{
				label: "照明与信号",
				value:
					"前大灯必须在电机运转时自动开启或可随时开启（常亮逻辑）。摩托车（L3）光强 ≥ 10,000 cd。",
			},
		],
		trafficRules: [
			"所有上路机动车辆（含电摩/轻便电摩）必须依法注册并安装号牌（电自通常豁免）。",
			"车辆必须在指定车道行驶。",
			"轮渡优先权：上轮渡时机动车/电动车优先；下轮渡时行人优先。",
		],
	},
	competition: {
		note: "注：基于新法规，铅酸车型普遍限速在50km/h以下以符合“电动轻便摩托车”标准（免驾照合规）；VinFast等高速车型则属于“电动摩托车”。",
		tiers: [
			{
				name: "第一梯队：绝对统领（不计成本的扩张）",
				brands: [
					{
						name: "VinFast（本土龙头）",
						logo: "/logos/Vinfast_logo.png",
						yield2025: "40万辆",
						plan2026: "150万辆",
						desc: "依托温纳集团 (Vingroup) 背景，已投资 3亿美金 布局。采取极度激进的“亏损换份额”策略，单车最高亏损额达 5000元人民币。拥有垄断级生态链，采用汽车级研发标准。",
						models: [
							{
								name: "Evo 200",
								price: "22,000,000 VND",
								rmbPrice: "5,845",
								spec: "LFP 3.5kWh / 1500W",
								speedRange: "70 km/h / 203 km",
								image: "/model_images/Vinfast/Evo 200.webp",
								note: "销量王。价格屠夫，两轮滴滴首选。",
							},
							{
								name: "Feliz S",
								price: "29,700,000 VND",
								rmbPrice: "7,891",
								spec: "LFP 3.5kWh / 1800W",
								speedRange: "78 km/h / 198 km",
								image: "/model_images/Vinfast/Feliz S.webp",
							},
							{
								name: "Klara S2",
								price: "35,000,000 VND",
								rmbPrice: "9,301",
								spec: "LFP 3.5kWh / 1800W",
								speedRange: "78 km/h / 194 km",
								image: "/model_images/Vinfast/Klara S2.webp",
							},
							{
								name: "Vento S",
								price: "50,000,000 VND",
								rmbPrice: "13,287",
								spec: "LFP 3.5kWh / 3000W",
								speedRange: "89 km/h / 160 km",
								image: "/model_images/Vinfast/Vento S.webp",
								note: "侧挂电机，ABS配置。",
							},
						],
					},
				],
			},
			{
				name: "第二梯队：强势竞对与代工网络",
				brands: [
					{
						name: "雅迪 (Yadea)",
						logo: "/logos/Yadea_Logo.png",
						yield2025: "15万辆",
						plan2026: "30万辆",
						desc: "350亩新厂房一期3月份开业。除了网红款和GOGO从精锐散件(方便快速上量)，其他车型全是自己开模。冲击高端新品。",
						models: [
							{
								name: "Voltguard U50",
								price: "35,990,000 VND",
								rmbPrice: "9,562",
								spec: "72V 50Ah LFP / 1500W",
								speedRange: "63 km/h / 200 km",
								image: "/model_images/Yadea/Voltguard U50.png",
								note: "雅迪冲击高端新品。",
							},
							{
								name: "Odora S2",
								price: "16,500,000 VND",
								rmbPrice: "4,384",
								spec: "60V 22Ah 石墨烯 / 600W",
								speedRange: "46 km/h / 80 km",
								image: "/model_images/Yadea/Odora S2.png",
								note: "大龟款，走量。",
							},
							{
								name: "Orla",
								price: "20,490,000 VND",
								rmbPrice: "5,444",
								spec: "60V 22Ah 石墨烯 / 800W",
								speedRange: "48 km/h / 65 km",
								image: "/model_images/Yadea/Orla P.jpg",
								note: "复古款，走量。",
							},
							{
								name: "i8 (新133)",
								price: "12,990,000 VND",
								rmbPrice: "3,451",
								spec: "48V 22Ah 石墨烯 / 350W",
								speedRange: "35 km/h / 70 km",
								image: "/model_images/Yadea/i8.png",
								note: "入门代步。",
							},
						],
					},
				],
			},
			{
				name: "第三梯队：细分玩家与生存现状",
				brands: [
					{
						name: "台铃 (Tailg)",
						logo: "/logos/tailg_logo.webp",
						yield2025: "5万辆",
						plan2026: "15万辆",
						desc: "去年采购了灵都 (LD) 1.5万套网红款散件，但反馈质量不佳。明年重点开发B2B市场。",
						models: [
							{
								name: "R52",
								price: "17,990,000 VND",
								rmbPrice: "4,780",
								spec: "60V 23Ah 铅酸 / 800W",
								speedRange: "49 km/h / 60 km",
								image: "/model_images/Tailg/R52.png",
								note: "特斯拉/Vespa款。锂电升级目标。",
							},
							{
								name: "T61",
								price: "27,900,000 VND",
								rmbPrice: "7,414",
								spec: "72V 32Ah 铅酸 / 2000W",
								speedRange: "60 km/h / 70 km",
								image: "/model_images/Tailg/T61.jpg",
								note: "EX007。车重痛点，需锂电减重。",
							},
							{
								name: "X51",
								price: "14,600,000 VND",
								rmbPrice: "3,887",
								spec: "60V 20Ah 铅酸 / 800W",
								speedRange: "48 km/h / 60 km",
								image: "/model_images/Tailg/X51.png",
								note: "133升级款。",
							},
							{
								name: "GR55",
								price: "12,990,000 VND",
								rmbPrice: "3,458",
								spec: "48V 22.3Ah 铅酸 / 400W",
								speedRange: "40 km/h / 60 km",
								image: "/model_images/Tailg/GR55.jpg",
								note: "网红款，走量。",
							},
						],
					},
					{
						name: "JVC",
						logo: "/logos/Jvc_logo.png",
						yield2025: "6万辆",
						plan2026: "10万辆",
						desc: "大量 “网红”款库存备战开年。还有大量JP Motor贴牌库存(旅游租车)。",
						models: [
							{
								name: "G9 NEW",
								price: "14,490,000 VND",
								rmbPrice: "3,858",
								spec: "48V 20Ah 铅酸 / 500W",
								speedRange: "42 km/h / 96 km",
								image: "/model_images/JVC/G9 NEW.png",
								note: "网红车，主打高个女生。",
							},
							{
								name: "V2 Pro",
								price: "18,990,000 VND",
								rmbPrice: "5,056",
								spec: "60V 20Ah 铅酸 / 800W",
								speedRange: "47 km/h / 80 km",
								image: "/model_images/JVC/V2 Pro.png",
								note: "特斯拉/Vespa公模改款。",
							},
							{
								name: "Xmen F1",
								price: "15,500,000 VND",
								rmbPrice: "4,127",
								spec: "60V 20Ah 铅酸 / 800W",
								speedRange: "47 km/h / 113 km",
								image: "/model_images/JVC/Xmen F1.png",
								note: "战警公模。",
							},
							{
								name: "ZH",
								price: "22,990,000 VND",
								rmbPrice: "6,121",
								spec: "72V 20Ah 铅酸 / 1500W",
								speedRange: "43-47 km/h / 90 km",
								image: "/model_images/JVC/ZH.png",
								note: "仿SH款 (EX007)。高价低配。",
							},
						],
					},
					{
						name: "Detech (Espero)",
						logo: "/logos/Detech_logo.png",
						yield2025: "6万辆",
						plan2026: "15万辆",
						desc: "老牌大厂，渠道下沉深。",
						models: [
							{
								name: "Classic Plus",
								price: "18,500,000 VND",
								rmbPrice: "4,925",
								spec: "60V 22.3Ah 铅酸 / 1600W",
								speedRange: "50 km/h / 90 km",
								image: "/model_images/Detech/Classic Plus.webp",
								note: "旗舰特斯拉/Vespa款。",
							},
							{
								name: "Weezee",
								price: "14,200,000 VND",
								rmbPrice: "3,780",
								spec: "48V 12Ah 锂电 / 227W",
								speedRange: "25 km/h / 60 km",
								image: "/model_images/Detech/Weezee.webp",
								note: "网红款，低速电动车。",
							},
							{
								name: "XMEN CPI-1",
								price: "15,500,000 VND",
								rmbPrice: "4,127",
								spec: "60V 20/26Ah 铅酸 / 1600W",
								speedRange: "50 km/h / 90 km",
								image: "/model_images/Detech/XMEN CPI-1.webp",
								note: "战警公模。",
							},
							{
								name: "GOGO-F1 Pro",
								price: "17,500,000 VND",
								rmbPrice: "4,659",
								spec: "60V 20/26Ah 铅酸 / 1600W",
								speedRange: "50 km/h / 90 km",
								image: "/model_images/Detech/GOGO-F1 Pro.webp",
								note: "GOGO公模。",
							},
						],
					},
					{
						name: "Osakar",
						logo: "/logos/Osakar_logo.jpg",
						yield2025: "4万辆",
						plan2026: "-",
						desc: "本土主流品牌之一，主打实用。",
						models: [
							{
								name: "NISPA VERA X",
								price: "18,500,000 VND",
								rmbPrice: "4,925",
								spec: "60V 20Ah 铅酸 / 1000W",
								speedRange: "46 km/h / 80 km",
								image: "/model_images/Osakar/NISPA VERA X.webp",
								note: "旗舰特斯拉/Vespa款。",
							},
							{
								name: "VC SUNOO",
								price: "14,500,000 VND",
								rmbPrice: "3,860",
								spec: "48V 20Ah 铅酸 / 500W",
								speedRange: "38 km/h / 60 km",
								image: "/model_images/Osakar/VC SUNOO.png",
								note: "网红款。",
							},
							{
								name: "Xmen Pro",
								price: "17,000,000 VND",
								rmbPrice: "4,526",
								spec: "60V 20Ah 铅酸 / 1000W",
								speedRange: "43 km/h / 90 km",
								image: "/model_images/Osakar/XMEN PRO.png",
								note: "战警公模。",
							},
							{
								name: "GOGO FIONA",
								price: "18,000,000 VND",
								rmbPrice: "4,792",
								spec: "60V 20Ah 铅酸 / 1000W",
								speedRange: "49 km/h / 80 km",
								image: "/model_images/Osakar/GOGO FIONA.png",
								note: "高端GOGO。",
							},
						],
					},
					{
						name: "Victoria",
						logo: "/logos/Victoria_logo.jpg",
						yield2025: "5万辆",
						plan2026: "8万辆",
						desc: "目前油车为主，'EX007'油车款淡季仍稳定销售。正在电动化转型。",
						models: [
							{
								name: "Royal",
								price: "-",
								rmbPrice: "-",
								spec: "1200W",
								speedRange: "-",
								image: "/model_images/Victoria/Royal.jpeg",
								note: "高端EX007款。",
							},
							{
								name: "Viral S2",
								price: "-",
								rmbPrice: "-",
								spec: "1000W",
								speedRange: "-",
								image: "/model_images/Victoria/Viral S2.jpg",
								note: "特斯拉/Vespa款。",
							},
						],
					},
					{
						name: "Dibao",
						logo: "/logos/Dibao_logo.webp",
						yield2025: "3万辆",
						plan2026: "-",
						desc: "主流品牌之一，主打时尚。",
						models: [
							{
								name: "LS 007",
								price: "27,690,000 VND",
								rmbPrice: "7,372",
								spec: "72V 22Ah 铅酸 / 2800W",
								speedRange: "54 km/h / 60-100 km",
								image: "/model_images/Dibao/LS007.png",
								note: "EX007，大功率铅酸。",
							},
							{
								name: "PANSY S3",
								price: "21,990,000 VND",
								rmbPrice: "5,855",
								spec: "60V 22Ah 铅酸 / 1350W",
								speedRange: "50 km/h / 60-90 km",
								image: "/model_images/Dibao/PANSY S3.png",
								note: "特斯拉/Vespa款。",
							},
							{
								name: "ELLA",
								price: "18,690,000 VND",
								rmbPrice: "4,976",
								spec: "60V 22Ah 铅酸 / 1400W",
								speedRange: "45 km/h / 70-90 km",
								image: "/model_images/Dibao/ELLA.png",
								note: "网红款。",
							},
							{
								name: "ROSA",
								price: "18,990,000 VND",
								rmbPrice: "5,056",
								spec: "60V 23Ah 铅酸 / 1400W",
								speedRange: "45 km/h / 80-90 km",
								image: "/model_images/Dibao/ROSA.png",
							},
						],
					},
					{
						name: "Dat Bike (性能怪兽)",
						logo: "/logos/datbike_logo.png",
						yield2025: "1.5万辆",
						plan2026: "-",
						desc: "黑马。主打中高性能电动车，差异化定位，也是唯一能接受高溢价零部件的客户。",
						models: [
							{
								name: "QUANTUM S1",
								price: "49,900,000 VND",
								rmbPrice: "13,260",
								spec: "6.4kWh 锂电 / 7000W",
								speedRange: "100 km/h / 285 km",
								image: "/model_images/Dat Bike/QUANTUM S1.jpg",
								note: "B2B标杆。",
							},
							{
								name: "QUANTUM S3",
								price: "39,900,000 VND",
								rmbPrice: "10,603",
								spec: "4.3kWh 锂电 / 6000W",
								speedRange: "90 km/h / 200 km",
								image: "/model_images/Dat Bike/QUANTUM S3.png",
							},
						],
					},
					{
						name: "DV Motor",
						logo: "/logos/dvmotor_logo.jpg",
						yield2025: "5万辆",
						plan2026: "10万辆",
						desc: "联合Kazuki品牌运营。",
					},
					{
						name: "DKBike",
						logo: "/logos/DK_logo.jpg",
						yield2025: "不足2万台",
						plan2026: "-",
						desc: "销量腰斩。之前部分业务是给雅迪做代工。资金风险高。",
					},
					{
						name: "爱玛 (Aima)",
						logo: "/logos/Powelldd_logo.webp",
						yield2025: "-",
						plan2026: "-",
						desc: "北宁基地。",
					},
				],
			},
		],
	},
	segments: [
		{
			title: "学生市场（存量基本盘）",
			tags: ["初高中生", "无驾照", "家长买单"],
			features:
				"受网红款爆发与新规强制锂电化影响，正经历从“公模简易款”向“复古方灯”与“合规锂电”转向。",
			details: [
				{
					label: "过去主流",
					value: "133简易款、Xmen、GOGO（运动/男性化）",
				},
				{
					label: "现在爆发",
					value: "网红款（色彩圆润、卡通IP、圆灯）",
				},
				{
					label: "未来趋势",
					value: "方灯复古设计 (Boxy Retro) 将成2025-26爆款",
				},
				{
					label: "合规路径",
					value: "路径A:锂电化(<40kg)；路径B:铅酸转电轻摩(上牌)",
				},
			],
		},
		{
			title: "成人/通勤市场（增量战场）",
			tags: ["油改电", "品质符号", "上班族"],
			features:
				"女性追求轻便与意式优雅，男性看重体量感与通过性，整体呈现高端化、锂电化趋势。",
			details: [
				{
					label: "女性趋势",
					value: "锂电化减重(<80kg) + 优化意式(Vespa)质感",
				},
				{
					label: "男性趋势",
					value: "大尺寸大轮毂 + 高仿SH/EX007款国民神车造型",
				},
				{
					label: "技术关键词",
					value: "石墨烯/锂电升级、大功率、极速、高通过性",
				},
			],
		},
		{
			title: "B2B / 营运市场（爆发前夜）",
			tags: ["Grab/Be司机", "TCO成本为王", "耐用性"],
			features:
				"VinFast Evo 200 凭借极致性价比统治该市场，是“两轮界的比亚迪秦”。",
			details: [
				{
					label: "续航KPI",
					value: "真实续航 > 150km (满足整日跑单不充电)",
				},
				{
					label: "动力KPI",
					value: "极速 > 60km/h (确保拥堵车流中的抢单效率)",
				},
				{
					label: "营运霸主",
					value: "VinFast Evo: 约¥5800售价 + 200km续航",
				},
				{
					label: "差异化竞争",
					value: "Dat Bike: 6.4kWh大电池 + 快充 (定位高端营运)",
				},
			],
		},
	],
	infrastructure: {
		supplyChain: {
			title: "供应链与制造",
			details: [
				{
					label: "吴旺 (Wu Wang)",
					value: "专注车架，是雅迪的核心供应商。",
				},
				{
					label: "精锐 (Jingrui)",
					value: "规模大，极强逆向仿制能力（刚买VinFast样车拉回中国仿制）。",
				},
				{
					label: "灵都 (LD)",
					value:
						"虽能解决全套散件和登检痛点，但去年与台铃的合作暴露出质量控制问题。",
				},
				{ label: "成本痛点", value: "本地烤漆成本比中国贵 70-90元 RMB。" },
			],
		},
		production: {
			title: "生产痛点",
			details: [
				{
					label: "效率",
					value: "租金比中国贵，人工效率比中国低。",
				},
				{
					label: "登检政策",
					value:
						"流程复杂且耗时，部分组装厂为了快速上市某些车型直接向LD或者精锐采购全套散件",
				},
			],
		},
	},
};
