import React from 'react';
import { Startup, Campaign, StartupProportion } from '../types';

interface Props {
  startups: Startup[];
  proportions: StartupProportion[];
  campaigns: Campaign[];
}

const InvestmentAllocationChart: React.FC<Props> = ({
  startups,
  proportions,
  campaigns
}) => {
  // Create campaign to startup mapping
  const campaignToStartupMap = campaigns.reduce((map, campaign) => {
    if (campaign && campaign.id && campaign.startupId) {
      map[campaign.id] = campaign.startupId;
    }
    return map;
  }, {} as Record<string, string>);

  // Calculate total goal from campaigns' steerup amounts
  const totalGoal = campaigns.reduce((sum, campaign) => {
    return sum + (campaign?.steerup_amount || 0);
  }, 0);

  const chartData = proportions.map((p, index) => {
    const startupId = campaignToStartupMap[p.campaignId];
    const startup = startups.find(s => s.id === startupId);
    const campaign = campaigns.find(c => c.id === p.campaignId);
    
    // Calculate amount based on the campaign's steerup_amount
    const amount = campaign?.steerup_amount || 0;
    // Calculate proportion based on actual amount relative to total
    const calculatedProportion = totalGoal > 0 ? (amount / totalGoal) * 100 : 0;
    
    return {
      name: startup?.name || 'Unknown',
      value: calculatedProportion,
      amount: amount,
      color: [
        'var(--primary-color)',
        'var(--success-color)',
        'var(--secondary-color)',
        'var(--additional-funding-bg-color)',
      ][index % 4],
    };
  });

  const total = chartData.reduce((sum, item) => sum + item.amount, 0);

  // Calculate the SVG paths for pie slices
  const radius = 50;
  const centerX = radius;
  const centerY = radius;
  let currentAngle = 0;

  const slices = chartData.map((item) => {
    const angle = (item.value / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    // Calculate path
    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const path = `
      M ${centerX} ${centerY}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;
    
    currentAngle += angle;
    return { path, color: item.color };
  });

  return (
    <div className="flex items-start gap-8" style={{ height: '120px' }}>
      {/* Pie Chart */}
      <div style={{ width: '100px', height: '100px', flexShrink: 0 }}>
        <svg viewBox="0 0 100 100">
          {slices.map((slice, index) => (
            <path
              key={index}
              d={slice.path}
              fill={slice.color}
              opacity={0.85}
              stroke="var(--card-bg-color)"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 flex-grow" style={{ minWidth: 0 }}>
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: item.color, opacity: 0.85 }}
            />
            <div className="flex items-baseline gap-1 min-w-0 text-white">
              <span className="font-medium truncate">{item.name}</span>
              <span className="text-xs whitespace-nowrap opacity-90">
                ({item.value.toFixed(1)}% - ${item.amount.toLocaleString()})
              </span>
            </div>
          </div>
        ))}
        <div className="text-xs text-white opacity-90 mt-1">
          Total Goal: ${total.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default InvestmentAllocationChart;
