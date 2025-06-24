import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Grafico({ data }) {
    // Ordena os dados por ano/mês
    const sortedData = [...data].sort((a, b) => new Date(a.monthYear) - new Date(b.monthYear));

    return (
        <div className="flex flex-col items-center w-full">
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sortedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthYear" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Quantidade" fill="#4E76EA" name="Quantidade Vendida" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
