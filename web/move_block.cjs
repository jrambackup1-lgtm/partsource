const fs = require('fs');
const content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const gridStart = content.indexOf('            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">');
const bomStart = content.indexOf('            <div className="flex justify-between items-center mt-2">\n              <h2 className="m-0 text-lg font-bold text-[var(--text-primary)]">BOM Items</h2>');
const bomEnd = content.indexOf('          </div>\n        </div>\n        <div className={`absolute inset-0 p-6 transition-opacity');

if (gridStart > -1 && bomStart > -1 && bomEnd > -1) {
    const bomSection = content.substring(bomStart, bomEnd);
    const withoutBom = content.substring(0, bomStart) + content.substring(bomEnd);
    const newGridStart = withoutBom.indexOf('            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">');
    const finalContent = withoutBom.substring(0, newGridStart) + bomSection + withoutBom.substring(newGridStart);
    fs.writeFileSync('src/pages/Home.tsx', finalContent);
    console.log("Moved successfully.");
} else {
    console.log("Could not find sections.");
}
