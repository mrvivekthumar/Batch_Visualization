import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ScatterChart,
    Scatter,
} from 'recharts';
import { PerformanceResult } from '../../types/index';
import { format } from 'date-fns';

interface PerformanceChartsProps {
    testResults: PerformanceResult[];
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ testResults }) => {
    // Prepare chart data
    const chartData = useMemo(() => {
        return testResults.map((result, index) => ({
            index: index + 1,
            name: `${result.operationType} #${index + 1}`,
            operation: result.operationType,
            records: result.recordsProcessed,
            batchSize: result.batchSize,
            duration: result.durationMs,
            throughput: Math.round(result.throughputRecordsPerSecond),
            memory: Math.round(result.memoryUsedMB),
            cpu: Math.round(result.cpuUsagePercent),
            avgTimePerRecord: Number(result.avgTimePerRecord.toFixed(3)),
            avgTimePerBatch: Math.round(result.avgTimePerBatch),
            timestamp: result.timestamp
                ? format(new Date(result.timestamp), 'HH:mm:ss')
                : `Test ${index + 1}`,
            fullTimestamp: result.timestamp || new Date().toISOString(),
        }));
    }, [testResults]);

    // Separate data by operation type
    const insertData = chartData.filter(d => d.operation === 'INSERT');
    const deleteData = chartData.filter(d => d.operation === 'DELETE');

    // Custom tooltip formatter
    const formatTooltip = (value: any, name: string, props: any) => {
        const { payload } = props;

        switch (name) {
            case 'throughput':
                return [`${value} records/sec`, 'Throughput'];
            case 'duration':
                return [`${value}ms`, 'Duration'];
            case 'memory':
                return [`${value}MB`, 'Memory Used'];
            case 'cpu':
                return [`${value}%`, 'CPU Usage'];
            case 'records':
                return [`${value.toLocaleString()}`, 'Records'];
            case 'avgTimePerRecord':
                return [`${value}ms`, 'Avg Time/Record'];
            case 'avgTimePerBatch':
                return [`${value}ms`, 'Avg Time/Batch'];
            default:
                return [value, name];
        }
    };

    if (chartData.length === 0) {
        return (
            <div className="charts-container">
                <div className="no-data">
                    <h3>📊 No Performance Data Yet</h3>
                    <p>Run some performance tests to see visualizations here!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="charts-container">
            <h2 className="charts-title">📊 Performance Analytics Dashboard</h2>

            <div className="charts-grid">
                {/* Throughput Comparison Chart */}
                <div className="chart-card">
                    <h3>⚡ Throughput Comparison (Records/Second)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                label={{ value: 'Records/Second', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                formatter={formatTooltip}
                                labelStyle={{ color: '#333' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="throughput"
                                fill="#667eea"
                                name="Throughput"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Duration Timeline */}
                <div className="chart-card">
                    <h3>⏱️ Execution Time Timeline</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="timestamp"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                label={{ value: 'Duration (ms)', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                formatter={formatTooltip}
                                labelStyle={{ color: '#333' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="duration"
                                stroke="#28a745"
                                strokeWidth={3}
                                dot={{ fill: '#28a745', strokeWidth: 2, r: 6 }}
                                name="Duration"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Memory vs CPU Usage */}
                <div className="chart-card">
                    <h3>💾 Resource Usage</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                yAxisId="memory"
                                orientation="left"
                                tick={{ fontSize: 12 }}
                                label={{ value: 'Memory (MB)', angle: -90, position: 'insideLeft' }}
                            />
                            <YAxis
                                yAxisId="cpu"
                                orientation="right"
                                tick={{ fontSize: 12 }}
                                label={{ value: 'CPU (%)', angle: 90, position: 'insideRight' }}
                            />
                            <Tooltip
                                formatter={formatTooltip}
                                labelStyle={{ color: '#333' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Line
                                yAxisId="memory"
                                type="monotone"
                                dataKey="memory"
                                stroke="#dc3545"
                                strokeWidth={2}
                                dot={{ fill: '#dc3545', strokeWidth: 2, r: 4 }}
                                name="Memory Usage"
                            />
                            <Line
                                yAxisId="cpu"
                                type="monotone"
                                dataKey="cpu"
                                stroke="#ffc107"
                                strokeWidth={2}
                                dot={{ fill: '#ffc107', strokeWidth: 2, r: 4 }}
                                name="CPU Usage"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Batch Size vs Performance Scatter Plot */}
                <div className="chart-card">
                    <h3>📈 Batch Size vs Throughput Analysis</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="batchSize"
                                tick={{ fontSize: 12 }}
                                label={{ value: 'Batch Size', position: 'insideBottom', offset: -10 }}
                            />
                            <YAxis
                                dataKey="throughput"
                                tick={{ fontSize: 12 }}
                                label={{ value: 'Throughput (Records/Sec)', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                formatter={formatTooltip}
                                labelStyle={{ color: '#333' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px'
                                }}
                                cursor={{ strokeDasharray: '3 3' }}
                            />
                            <Legend />
                            <Scatter
                                dataKey="throughput"
                                fill="#667eea"
                                name="INSERT"
                                data={insertData}
                            />
                            <Scatter
                                dataKey="throughput"
                                fill="#dc3545"
                                name="DELETE"
                                data={deleteData}
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Summary Statistics */}
            <div className="performance-summary">
                <h3>📋 Performance Summary</h3>
                <div className="summary-grid">
                    <div className="summary-item">
                        <span className="summary-label">Total Tests:</span>
                        <span className="summary-value">{testResults.length}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Best Throughput:</span>
                        <span className="summary-value">
                            {Math.max(...chartData.map(d => d.throughput)).toLocaleString()} records/sec
                        </span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Fastest Execution:</span>
                        <span className="summary-value">
                            {Math.min(...chartData.map(d => d.duration))}ms
                        </span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Total Records Processed:</span>
                        <span className="summary-value">
                            {testResults.reduce((sum, r) => sum + r.recordsProcessed, 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceCharts;