// View Layer - Emails Trend Chart Component

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { EmailsByDay } from '@/model/entities';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EmailsTrendChartProps {
  data: EmailsByDay[];
}

export function EmailsTrendChart({ data }: EmailsTrendChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    displayDate: format(parseISO(item.date), 'dd/MM', { locale: ptBR }),
  }));

  return (
    <div className="stat-card animate-fade-in stagger-3">
      <h3 className="text-sm font-semibold text-foreground mb-4">Tendência - Últimos 7 dias</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ left: 0, right: 10, top: 10 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="displayDate" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
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
