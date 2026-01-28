import { For } from "solid-js";

interface Model {
	name: string;
	price: string;
	rmbPrice?: string;
	spec: string;
	speedRange: string;
	image: string;
	note?: string;
}

export default function BrandModels({ models }: { models: Model[] }) {
	return (
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
			<For each={models}>
				{(model) => (
					<div class="flex flex-col gap-4 p-4 border border-gray-100 rounded bg-gray-50/30">
						{/* Image */}
						<div class="w-full aspect-square bg-white rounded border border-gray-100 overflow-hidden flex items-center justify-center relative group p-2">
							{model.image ? (
								<img
									src={model.image}
									alt={model.name}
									class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
								/>
							) : (
								<div class="text-gray-300 text-xs font-mono">无图片</div>
							)}
							{/* Price Tag Overlay */}
							<div class="absolute bottom-2 right-2 bg-black/80 backdrop-blur text-white px-2 py-1 rounded text-[10px] font-mono">
								{model.rmbPrice} RMB
							</div>
						</div>

						{/* Content */}
						<div>
							<div class="flex justify-between items-start mb-2">
								<h5 class="text-sm font-bold text-gray-900">{model.name}</h5>
								<span class="text-[9px] text-gray-400 font-mono">
									{model.price}
								</span>
							</div>

							<div class="space-y-1.5">
								<div class="flex items-baseline gap-2 text-xs">
									<span class="text-[9px] font-bold uppercase tracking-widest text-gray-400 w-8 shrink-0">
										配置
									</span>
									<span class="text-gray-700 font-medium truncate">
										{model.spec}
									</span>
								</div>
								<div class="flex items-baseline gap-2 text-xs">
									<span class="text-[9px] font-bold uppercase tracking-widest text-gray-400 w-8 shrink-0">
										性能
									</span>
									<span class="text-gray-700 truncate">{model.speedRange}</span>
								</div>
								{model.note && (
									<div class="mt-2 pt-2 border-t border-dashed border-gray-200">
										<p class="text-[10px] text-gray-500 italic leading-snug">
											{model.note}
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</For>
		</div>
	);
}
