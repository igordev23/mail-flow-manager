import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { EmailsByDay } from '@/types/email';

interface EmailsTrendChartProps {
  data: EmailsByDay[];
}

export function EmailsTrendChart({ data }: EmailsTrendChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    dateLabel: new Date(item.date).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    }),
  }));

  return (
    <div className="stat-card animate-fade-in stagger-3">
      <h3 className="text-sm font-semibold text-foreground mb-4">Tendência - Últimos 7 dias</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ left: -20, right: 10 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(226, 71%, 40%)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(226, 71%, 40%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="dateLabel" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 11 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(214, 32%, 91%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`${value} e-mails`, 'Enviados']}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(226, 71%, 40%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
