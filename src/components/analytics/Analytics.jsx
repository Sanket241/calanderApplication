import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { useAnalytics } from '../../hooks/useNotifications';
import { format, subMonths } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = () => {
  const { state } = useApp();
  const { getCommunicationStats, getCompanyEngagement } = useAnalytics();
  const [selectedCompany, setSelectedCompany] = useState('');
  const [stats, setStats] = useState(null);
  const [engagementData, setEngagementData] = useState([]);

  useEffect(() => {
    setStats(getCommunicationStats());
  }, [state.communications]);

  useEffect(() => {
    if (selectedCompany) {
      const engagement = getCompanyEngagement(selectedCompany);
      const data = engagement.map((count, index) => ({
        month: format(subMonths(new Date(), index), 'MMM yyyy'),
        communications: count
      })).reverse();
      setEngagementData(data);
    }
  }, [selectedCompany]);

  const prepareTypeData = () => {
    if (!stats) return [];
    return Object.entries(stats.communicationsByType).map(([type, count]) => ({
      type,
      count
    }));
  };

  const prepareCompanyData = () => {
    if (!stats) return [];
    return Object.entries(stats.communicationsByCompany).map(([name, count]) => ({
      name,
      count
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Communication Analytics
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Communications
              </Typography>
              <Typography variant="h4">
                {stats?.totalCommunications || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4">
                {stats?.successRate.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Response Time
              </Typography>
              <Typography variant="h4">
                {Math.round(stats?.averageResponseTime / (1000 * 60 * 60))}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Companies
              </Typography>
              <Typography variant="h4">
                {state.companies.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Communication Types Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Communications by Type
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={prepareTypeData()}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {prepareTypeData().map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Communications by Company */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Communications by Company
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepareCompanyData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Company Engagement Trend */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Company Engagement Trend
              </Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Select Company</InputLabel>
                <Select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  label="Select Company"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {state.companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="communications"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
