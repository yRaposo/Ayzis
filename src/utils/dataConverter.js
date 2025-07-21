export function convertDateString(dateString) {
    console.log("conversão de texto", "Input:", dateString);

    const months = {
        "janeiro": "01",
        "fevereiro": "02",
        "março": "03",
        "abril": "04",
        "maio": "05",
        "junho": "06",
        "julho": "07",
        "agosto": "08",
        "setembro": "09",
        "outubro": "10",
        "novembro": "11",
        "dezembro": "12"
    };

    // Verificar se a entrada é uma string válida e não vazia
    if (typeof dateString !== 'string' || dateString.trim() === '') {
        throw new Error("Data no formato inválido: entrada deve ser uma string não vazia");
    }

    // Regex mais flexível para capturar o formato "24 de junho de 2025 16:54 hs."
    const regex = /(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})\s+(\d{1,2}):(\d{2})\s+hs\./i;

    let match;
    try {
        match = dateString.trim().match(regex);
        if (!match) {
            throw new Error(`Data no formato inválido: "${dateString}" não corresponde ao padrão esperado "DD de MMMM de AAAA HH:MM hs."`);
        }
    } catch (error) {
        console.error("Erro ao converter data:", error.message);
        throw error;
    }

    const day = match[1].padStart(2, '0');
    const monthName = match[2].toLowerCase();
    const month = months[monthName];
    const year = match[3];
    const hour = match[4].padStart(2, '0');
    const minute = match[5].padStart(2, '0');

    // Verificar se o mês foi encontrado
    if (!month) {
        throw new Error(`Mês inválido: "${match[2]}" não foi reconhecido`);
    }

    return `${year}-${month}-${day}T${hour}:${minute}:00`;
}

export function convertDateDate(dateDate) {
    console.log("conversão de data")
    if (typeof dateDate !== 'string') {
        throw new Error("Data no formato inválido: entrada não é uma string");
    }

    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateDate.match(regex);

    if (!match) {
        throw new Error("Data no formato inválido");
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10); // Ajustar para formato ISO 8601 (1-based)
    const year = parseInt(match[3], 10);

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00:00`;
}