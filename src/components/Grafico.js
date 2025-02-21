import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Grafico({ data }) {
    // Ordena os dados por ano/mês
    const sortedData = data.sort((a, b) => new Date(a.monthYear) - new Date(b.monthYear));

    return (
        <div className="flex flex-col items-center w-full">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={sortedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthYear" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {/* Concluidas */}
                    <Line type="monotone" dataKey="Individuais_Concluidas" stroke="#01B739" />
                    <Line type="monotone" dataKey="Componentes_Concluidos" stroke="#017539" />
                    <Line type="monotone" dataKey="Diretas_Concluidas" stroke="#4E76EA" />
                    <Line type="monotone" dataKey="Total_Concluido" stroke="#007D08" />
                    {/* Canceladas */}
                    {/* <Line type="monotone" dataKey="canceladoIndividual" stroke="#ffc658" />
                    <Line type="monotone" dataKey="canceladoComponente" stroke="#82ca9d" /> */}
                    <Line type="monotone" dataKey="Total_Cancelado" stroke="#EB1100" />
                    {/* Pendentes */}
                    {/* <Line type="monotone" dataKey="pendenteIndividual" stroke="#ff8042" />
                    <Line type="monotone" dataKey="pendenteComponente" stroke="#ffc658" />
                    <Line type="monotone" dataKey="pendenteTotal" stroke="#8dd1e1" /> */}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}