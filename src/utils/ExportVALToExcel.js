import exceljs from 'exceljs';

export const exportVALToExcel = (data) => {
    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet('Sheet 1');

    // Colunas para valores
    sheet.columns = [
        { header: 'SKU', key: 'SKU', width: 20 },
        { header: 'Descrição', key: 'Descricao', width: 30 },
        { header: 'Marca', key: 'Marca', width: 20 },
        { header: 'Mês', key: 'Mes', width: 15 },
        { header: 'Valor', key: 'Valor', width: 18 }
    ];

    // Adiciona as linhas
    data.forEach(item => {
        sheet.addRow({
            SKU: item.SKU,
            Descricao: item.Descricao,
            Marca: item.Marca,
            Mes: item.Mes,
            Valor: item.Valor
        });
    });

    // Salva o arquivo
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'valores-mensais.xlsx';
        link.click();
    });
};
