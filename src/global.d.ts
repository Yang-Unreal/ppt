interface Model {
	name: string;
	price: string;
	rmbPrice?: string;
	spec: string;
	speedRange: string;
	image: string;
	note?: string;
}

interface Brand {
	name: string;
	logo?: string;
	desc: string;
	yield2025: string;
	plan2026: string;
	models?: Model[];
}

interface BrandCardProps {
	brand: Brand;
	tier: 1 | 2 | 3;
}
