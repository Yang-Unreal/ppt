export const reportData = {
    meta: {
        title: "斯里兰卡电动二轮车市场分析报告",
        subtitle: "基于RMV注册数据与消费者调研",
        date: "2026年1月",
        author: "战略研究部"
    },
    // Complete Brand Data from RMV ANLZ.xlsx Sheet1
    brandSales: [
        { brand: "Yadea (雅迪)", aug: 2743, sep: 1784, oct: 1794, nov: 1374, total: 7695 },
        { brand: "Aima (爱玛)", aug: 590, sep: 516, oct: 435, nov: 299, total: 1840 },
        { brand: "N Wow", aug: 255, sep: 210, oct: 140, nov: 120, total: 725 },
        { brand: "TMR", aug: 171, sep: 139, oct: 204, nov: 93, total: 607 },
        { brand: "TVS", aug: 126, sep: 162, oct: 223, nov: 154, total: 665 },
        { brand: "Ather", aug: 84, sep: 85, oct: 113, nov: 68, total: 350 },
        { brand: "V Moto", aug: 23, sep: 29, oct: 36, nov: 20, total: 108 },
        { brand: "Alfa Luyan", aug: 18, sep: 31, oct: 30, nov: 18, total: 97 },
        { brand: "Revolt", aug: 12, sep: 15, oct: 16, nov: 20, total: 63 },
        { brand: "Other", aug: 571, sep: 575, oct: 404, nov: 0, total: 1550 }
    ],
    // Monthly Totals
    monthlyTotals: [
        { month: "8月", total: 4581 },
        { month: "9月", total: 3531 },
        { month: "10月", total: 3395 },
        { month: "11月", total: 2524 }
    ],
    // E-Motorcycle Stats (Sheet1)
    eMotorcycle: {
        aug: 12, sep: 22, oct: 16, nov: 22,
        growthRate: [0.26, 0.62, 0.47, 0.87] // Percentage growth rates
    },
    // Complete Regional Data from RMV ANLZ.xlsx Sheet2 (August data)
    allRegionalData: [
        { province: "WP", district: "COLOMBO", ice: 3133, ev: 323, midIce: 998 },
        { province: "WP", district: "GAMPAHA", ice: 2876, ev: 343, midIce: 920 },
        { province: "WP", district: "KALUTARA", ice: 1561, ev: 227, midIce: 512 },
        { province: "NW", district: "KURUNEGALA", ice: 2458, ev: 643, midIce: 860 },
        { province: "NW", district: "ANURADHAPURA", ice: 2009, ev: 328, midIce: 644 },
        { province: "SP", district: "GALLE", ice: 1654, ev: 250, midIce: 544 },
        { province: "SP", district: "HAMBANTOTA", ice: 941, ev: 236, midIce: 237 },
        { province: "SP", district: "KEGALLE", ice: 622, ev: 32, midIce: 240 },
        { province: "EP", district: "AMPARA", ice: 1411, ev: 81, midIce: 722 },
        { province: "EP", district: "BATTICALOA", ice: 1358, ev: 16, midIce: 588 },
        { province: "NP", district: "JAFFNA", ice: 1334, ev: 80, midIce: 362 },
        { province: "NP", district: "KILINOCHCHI", ice: 444, ev: 40, midIce: 207 },
        { province: "NP", district: "MANNAR", ice: 275, ev: 9, midIce: 123 },
        { province: "CP", district: "KANDY", ice: 954, ev: 35, midIce: 285 },
        { province: "CP", district: "MATALE", ice: 461, ev: 39, midIce: 155 },
        { province: "UP", district: "BADULLA", ice: 628, ev: 32, midIce: 221 }
    ],
    // Top 5 Regions for quick display
    regionalData: [
        { region: "COLOMBO", ice: 3133, ev: 323, total: 3456 },
        { region: "GAMPAHA", ice: 2876, ev: 343, total: 3219 },
        { region: "KURUNEGALA", ice: 2458, ev: 643, total: 3101 },
        { region: "ANURADHAPURA", ice: 2009, ev: 328, total: 2337 },
        { region: "GALLE", ice: 1654, ev: 250, total: 1904 }
    ],
    // Complete Survey Data from 斯里兰卡电动车市场调研问卷.xlsx
    surveyData: {
        sections: [
            {
                id: "I",
                title: "市场基本面",
                questions: [
                    { id: "1.1", category: "经济地理", question: "哪些城市/省份对电动汽车(EV)的购买力最强？", answer: "西部省、西北省、南部省" },
                    { id: "1.2", category: "市场容量", question: "电动两轮/三轮车的年销量是多少？", answer: "两轮车：平均每月 3,500 台\n三轮车：平均每月 50 台" },
                    { id: "1.3", category: "市场容量", question: "燃油两轮/三轮车的年销量是多少？", answer: "两轮车：平均每月 30,000 台\n三轮车：平均每月 2,500 台" },
                    { id: "1.4", category: "市场趋势", question: "预计电动汽车行业的同比增长率(YoY)是多少？", answer: "COVID-19和金融危机后，政府实施严格进口管制。新政府分两阶段恢复：\n1. 第一阶段：要求本地组装，LVA至少30%\n2. 第二阶段：允许进口整车(CBU)\nEV因运营成本低获得强劲增长，市场正重新定位以实现可持续增长。" },
                    { id: "1.5", category: "市场趋势", question: "列出目前市场上销量排名前5的具体EV车型", answer: "见RMV数据附件 (Yadeya, Aima, N Wow, TMR, TVS)" },
                    { id: "1.6", category: "市场趋势", question: "目前电动汽车相对于燃油车的市场渗透率是多少？", answer: "见RMV数据附件 (约10-15%)" },
                    { id: "1.7", category: "市场趋势", question: "现有的燃油车车主是否愿意转向电动汽车？", answer: "是的" },
                    { id: "1.8", category: "使用场景", question: "主要用途：个人通勤、配送还是家庭出行？", answer: "个人通勤 / 配送服务 (Uber, PickMe) / 家庭交通" },
                    { id: "1.9", category: "人口统计", question: "目标买家画像：年龄、性别、职业、平均收入？", answer: "电动三轮车：30-55岁，主要男性，自雇司机/物流/小企业主，中低收入\n两轮车：18-45岁，男女皆有，学生/私企职员/零工经济者，价格敏感型" }
                ]
            },
            {
                id: "II",
                title: "基础设施与能源",
                questions: [
                    { id: "2.1", category: "电网稳定性", question: "描述居民用电电网的稳定性（停电是否常见？）", answer: "居民电网在正常情况下总体可靠。但在用电高峰、极端天气或计划维护期间会有间歇性停电。城市地区的停电频率通常低于半城市或农村地区。" },
                    { id: "2.2", category: "电费成本", question: "居民平均电价是多少（每千瓦时/度）？", answer: "2025年平均电价 (按阶梯计费)：\n低用量 (0-30 kWh): 约 2.50-6.00 卢比/度\n高用量 (>180 kWh): 约 52.00-65.00 卢比/度\n注：2025年1月有关键费率更新" },
                    { id: "2.3", category: "基础设施", question: "评估公共充电站的可用性", answer: "目前有限。基础设施主要集中在主要城市中心和商业区。网络正在扩张，但仍不足以支持大规模普及。大多数用户依赖私人或半私人充电解决方案。" },
                    { id: "2.4", category: "使用模式", question: "居民典型的每日出行半径（公里）是多少？", answer: "摩托车用户：\n单程：20-25公里\n往返：55-60公里\n日均行驶：约38公里 (通勤/上学)\n特征：中短途出行，乡村到城镇或郊区到市区" }
                ]
            },
            {
                id: "III",
                title: "政策与进口法规",
                questions: [
                    { id: "3.1", category: "进口关税", question: "整车进口(CBU)与本地组装(SKD/CKD)之间的关税差异是多少？", answer: "CBU (整车)：关税最高，2025年初CID为30%，加附加税费后极其昂贵\nSKD/CKD (本地组装)：税率显著较低，政府提供优惠激励\n例如：CBU 30% vs CKD 10%\n2024年底出台了针对BOI设施进口SKD套件的特别规定" },
                    { id: "3.2", category: "认证/准入", question: "进口需要哪些具体的安全认证？", answer: "1. 国际EV道路安全标准：必须提供合规证书\n2. 电池/电机质保：生产商需提供至少3年质保\n3. 电池回收计划：进口商需出具证书承诺负责废旧电池处置\n4. DMT合规：高压电池和电源管理系统需符合机动车辆管理部要求" }
                ]
            }
        ]
    },
    // Legacy summarized data (kept for backward compatibility)
    surveyInsights: {
        marketVolume: {
            twoWheeler: "30,000 台/月 (燃油) vs 3,500 台/月 (电动)",
            threeWheeler: "2,500 台/月 (燃油) vs 50 台/月 (电动)"
        },
        userProfile: {
            target: "18-45岁，中低收入群体 (学生、私企职员、零工经济)",
            motivation: "日常通勤、拥车成本低、节省燃油"
        },
        infrastructure: {
            grid: "居民电网总体可靠，但高峰期偶有停电",
            charging: "公共充电桩稀缺，主要依赖私人充电"
        },
    policy: {
            tax: "CKD (10%) 远低于 整车进口 (30%)",
            regulations: "需提供3年电池/电机质保，且有电池回收计划"
        }
    },
    // Extracted from uploaded images
    featureComparison: [
        { feature: "车架材质", atherTvs: "高级合金/钢", yadea: "增强塑料/钢", budget: "轻质塑料" },
        { feature: "爬坡性能", atherTvs: "极佳", yadea: "非常好", budget: "一般 (双人骑行吃力)" },
        { feature: "防水性能", atherTvs: "高 (IP67等级)", yadea: "中等", budget: "低 (建议避开大雨)" },
        { feature: "电池寿命", atherTvs: "5-8 年", yadea: "2-3 年", budget: "1-1.5 年" },
        { feature: "二手价值", atherTvs: "中到高", yadea: "中等", budget: "低" }
    ],
    rangeComparison: [
        { model: "Ather 450X (3.7kWh)", battery: "锂离子电池", labRange: "161 km", realRange: "~130 km (SmartEco)" },
        { model: "TVS iQube", battery: "锂离子电池", labRange: "100 km", realRange: "75-100 km" },
        { model: "Yadea E8S Pro", battery: "石墨烯电池", labRange: "150 km", realRange: "100-112 km" },
        { model: "NWOW SE", battery: "铅酸电池", labRange: "60 km", realRange: "~50 km" },
        { model: "Xiaomi Mi Scooter 3", battery: "锂离子电池", labRange: "30 km", realRange: "20-25 km" }
    ]
};
