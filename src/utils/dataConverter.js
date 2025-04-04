export function convertDateString(dateString) {
    console.log("conversão de texto")
    const months = {
        "janeiro": "01",
        "fevereiro": "02",
        "marco": "03",
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

    if (typeof dateString !== 'string') {
        throw new Error("Data no formato inválido: entrada não é uma string");
    }

    const regex = /(\d{1,2}) de (\w+) de (\d{4}) (\d{2}):(\d{2}) hs\./;
    const match = dateString.match(regex);

    if (!match) {
        throw new Error("Data no formato inválido");
    }

    const day = match[1].padStart(2, '0');
    const month = months[match[2].toLowerCase()];
    const year = match[3];
    const hour = match[4].padStart(2, '0');
    const minute = match[5].padStart(2, '0');

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