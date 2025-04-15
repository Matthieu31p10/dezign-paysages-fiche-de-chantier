
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { WorkLog } from '@/types/models';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AmountDistributionProps {
  workLogs: WorkLog[];
  invoicedAmount?: number;
  nonInvoicedAmount?: number;
  totalAmount?: number;
}

const AmountDistribution: React.FC<AmountDistributionProps> = ({ 
  workLogs,
  invoicedAmount,
  nonInvoicedAmount,
  totalAmount
}) => {
  // Calculating data for the pie chart
  const calculateChartData = () => {
    const thresholds = [
      { name: "< 500€", value: 0, color: "#A2D2FF" },
      { name: "500€ - 1000€", value: 0, color: "#BDE0FE" },
      { name: "1000€ - 2000€", value: 0, color: "#FFAFCC" },
      { name: "> 2000€", value: 0, color: "#FFC8DD" }
    ];

    workLogs.forEach(log => {
      const amount = calculateTotalAmount(log);
      
      if (amount < 500) {
        thresholds[0].value++;
      } else if (amount < 1000) {
        thresholds[1].value++;
      } else if (amount < 2000) {
        thresholds[2].value++;
      } else {
        thresholds[3].value++;
      }
    });

    return thresholds.filter(item => item.value > 0);
  };

  const calculateTotalAmount = (log: WorkLog): number => {
    // Check if there's a signed quote amount
    if (log.signedQuoteAmount && typeof log.signedQuoteAmount === 'number') {
      return log.signedQuoteAmount;
    }
    
    // Otherwise calculate from hours and rate
    const totalHours = log.timeTracking?.totalHours || 0;
    const hourlyRate = log.hourlyRate || 0;
    const personnelCount = log.personnel?.length || 1;
    
    return typeof totalHours === 'number' 
      ? totalHours * hourlyRate * personnelCount 
      : parseFloat(totalHours as string || '0') * hourlyRate * personnelCount;
  };

  const data = calculateChartData();

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribution des montants</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Aucune donnée disponible</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Distribution des montants</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} fiches`, '']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AmountDistribution;
