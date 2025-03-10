import exceljs from 'exceljs';

export const exportToExcel = (data) => {
    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet('Sheet 1');

    // Get all unique months
    const months = new Set();
    data.forEach(info => {
        Object.keys(info).forEach(month => months.add(month));
    });
    const sortedMonths = Array.from(months).sort();

    // Define columns
    const columns = [
        { header: 'SKU', key: 'SKU', width: 10, style: { font: { bold: true } } },
        { header: 'Fornecedor', key: 'Fornecedor', width: 15, style: { font: { bold: true } } },
        { header: 'Descrição', key: 'Descrição', width: 30, style: { font: { bold: true } } },
        ...sortedMonths.map(month => ({ header: month, key: month, width: 15, style: { font: { bold: true } } }))
    ];
    sheet.columns = columns;

    // Add rows
    data.forEach(item => {
        console.log("Objeto:",item);
        const row = {
            SKU: item.SKU,
            Fornecedor: item.Marca,
            Descrição: item.Descricao,
        };
        sortedMonths.forEach(month => {
            row[month] = item[month] || 0;
        });
        console.log("Linha:",row);
        sheet.addRow(row);
    });

    // Save the workbook
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'report.xlsx';
        link.click();
    });
};