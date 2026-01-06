import fs from "fs";
import path from "path";

const pdf = require("pdf-parse");

const publicDir = path.join(process.cwd(), "public");
const files = [
	"RMV ANLZ 1.pdf",
	"RMV ANLZ.pdf",
	"斯里兰卡电动车市场调研问卷.pdf",
];

async function extract() {
	for (const file of files) {
		const filePath = path.join(publicDir, file);
		if (fs.existsSync(filePath)) {
			console.log(`\n--- Extracting: ${file} ---`);
			const dataBuffer = fs.readFileSync(filePath);
			try {
				const data = await pdf(dataBuffer);
				console.log(data.text.slice(0, 3000)); // Log first 3000 chars
			} catch (e) {
				console.error(`Error parsing ${file}:`, e);
			}
		} else {
			console.log(`File not found: ${filePath}`);
		}
	}
}

extract();
