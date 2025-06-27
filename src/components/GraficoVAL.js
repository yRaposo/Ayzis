import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart } from 'recharts';

export default function GraficoVAL({ data }) {
    // Ordena os dados por ano/mês
    const sortedData = [...data].sort((a, b) => new Date(a.monthYear) - new Date(b.monthYear));

    return (
        <div className="flex flex-col items-center w-full">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={sortedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthYear" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Valor" stroke="#FF7300" name="Valor Vendido" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
