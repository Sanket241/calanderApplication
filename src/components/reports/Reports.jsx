import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Tooltip
} from '@mui/material';
import {
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { generateCommunicationReport, generateSummaryReport } from '../../utils/reportGenerator';

const Reports = () => {
  const { state } = useApp();

  const downloadReport = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleDownloadCommunicationReport = () => {
    const csvContent = generateCommunicationReport(state.communications, state.companies);
    downloadReport(csvContent, 'communication_report.csv');
  };

  const handleDownloadSummaryReport = () => {
    const csvContent = generateSummaryReport(state.communications, state.companies);
    downloadReport(csvContent, 'summary_report.csv');
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Reports
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">
                  Communication Report
                </Typography>
              </Box>
              <Typography color="text.secondary" paragraph>
                Download a detailed report of all communications with companies, including dates, methods, notes, and status.
              </Typography>
              <Tooltip title="Download Communication Report">
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadCommunicationReport}
                  sx={{ mt: 2 }}
                >
                  Download Report
                </Button>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">
                  Summary Report
                </Typography>
              </Box>
              <Typography color="text.secondary" paragraph>
                Download a summary report showing communication statistics, status, and next due dates for each company.
              </Typography>
              <Tooltip title="Download Summary Report">
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadSummaryReport}
                  sx={{ mt: 2 }}
                >
                  Download Report
                </Button>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
