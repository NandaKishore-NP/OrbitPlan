import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { motion } from 'framer-motion';

const TaskDistributionChart = ({ data }) => {
  if (!data?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[300px] w-full"
    >
      <ResponsiveBar
        data={data}
        keys={['total']}
        indexBy="name"
        margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        colors={({ indexValue }) => {
          switch (indexValue.toLowerCase()) {
            case 'high':
              return '#EF4444';
            case 'medium':
              return '#F59E0B';
            case 'low':
              return '#10B981';
            default:
              return '#6366F1';
          }
        }}
        borderRadius={4}
        borderWidth={2}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Priority Level',
          legendPosition: 'middle',
          legendOffset: 32,
          truncateTickAt: 0
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Task Count',
          legendPosition: 'middle',
          legendOffset: -40,
          truncateTickAt: 0
        }}
        enableGridY={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]]
        }}
        role="application"
        ariaLabel="Task distribution by priority"
        barAriaLabel={e => e.id + ": " + e.formattedValue + " tasks"}
      />
    </motion.div>
  );
};

export default TaskDistributionChart;
