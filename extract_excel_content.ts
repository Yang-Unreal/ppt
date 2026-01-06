import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

const publicDir = path.join(process.cwd(), "public");
const files = ["RMV ANLZ.xlsx", "斯里兰卡电动车市场调研问卷.xlsx"];

function extract() {
	files.forEach((file) => {
		const filePath = path.join(publicDir, file);
		if (fs.existsSync(filePath)) {
			console.log(`\n--- Extracting: ${file} ---`);
			const workbook = XLSX.readFile(filePath);
			const sheetNames = workbook.SheetNames;

			sheetNames.forEach((sheetName) => {
				console.log(`\n[Sheet: ${sheetName}]`);
				const sheet = workbook.Sheets[sheetName];
				const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
				// Log first 10 rows to avoid overwhelming output
				console.log(JSON.stringify(jsonData.slice(0, 20), null, 2));
			});
		} else {
			console.log(`File not found: ${filePath}`);
		}
	});
}

extract();
