import exceljs from 'exceljs';

export const exportQTDToExcel = (data) => {
    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet('Sheet 1');

    // Define columns fixas conforme o que está sendo exportado
    sheet.columns = [
        { header: 'SKU', key: 'SKU', width: 20 },
        { header: 'Descrição', key: 'Descricao', width: 30 },
        { header: 'Marca', key: 'Marca', width: 20 },
        { header: 'Mês', key: 'Mes', width: 15 },
        { header: 'Quantidade', key: 'Quantidade', width: 15 }
    ];

    // Adiciona as linhas
    data.forEach(item => {
        sheet.addRow({
            SKU: item.SKU,
            Descricao: item.Descricao,
            Marca: item.Marca,
            Mes: item.Mes,
            Quantidade: item.Quantidade
        });
    });

    // Salva o arquivo
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'report.xlsx';
        link.click();
    });
};
