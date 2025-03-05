import * as XLSX from 'xlsx';

export const exportToExcel = (data) => {
    // Converte o objeto infoMes em um array de objetos
    const formattedData = [];
    const months = Array.from(new Set(Object.values(data).flatMap(Object.keys))).sort();

    Object.keys(data).forEach(sku => {
        const row = { SKU: sku };
        months.forEach(month => {
            row[month] = data[sku][month] || 0;
        });
        formattedData.push(row);
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório");

    XLSX.writeFile(wb, `Relatorio.xlsx`);
};