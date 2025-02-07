export function convertDateString(dateString) {
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