// Converted version of MetricBoxes.jsx with Tailwind CSS
import React from 'react';

const MetricBoxes = ({ drowsinessData }) => {
    const metrics = [
        { label: "EAR", value: drowsinessData.ear.toFixed(2), color: 'text-green-500' },
        { label: "Blink Count", value: drowsinessData.blink, color: 'text-blue-500' },
        { label: "Status", value: drowsinessData.status, color: drowsinessData.alarm_on ? 'text-red-600' : 'text-yellow-500' },
        { label: "Drowsy Prob.", value: `${(drowsinessData.probability * 100).toFixed(2)}%`, color: 'text-purple-600' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            {metrics.map((metric) => (
                <div key={metric.label} className="p-4 rounded-lg bg-white shadow-sm flex flex-col items-center">
                    <p className="text-sm font-semibold text-gray-600 mb-2">{metric.label}</p>
                    <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
            ))}
        </div>
    );
};

export default MetricBoxes;
