import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function useNotifications() {
  const { utils } = useApp();

  useEffect(() => {
    // Check for browser notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Set up notifications for overdue and today's communications
    const checkNotifications = () => {
      const overdueCommunications = utils.getOverdueCommunications();
      const todaysCommunications = utils.getTodaysCommunications();

      if (Notification.permission === 'granted') {
        // Notify for overdue communications
        overdueCommunications.forEach(company => {
          new Notification('Overdue Communication', {
            body: `Communication with ${company.name} is overdue`,
            icon: '/notification-icon.png'
          });
        });

        // Notify for today's communications
        todaysCommunications.forEach(company => {
          new Notification('Communication Due Today', {
            body: `Communication with ${company.name} is due today`,
            icon: '/notification-icon.png'
          });
        });
      }
    };

    // Check notifications every hour
    const intervalId = setInterval(checkNotifications, 3600000);
    checkNotifications(); // Initial check

    return () => clearInterval(intervalId);
  }, []);
}

export function useAnalytics() {
  const { state } = useApp();

  const getCommunicationStats = () => {
    const stats = {
      totalCommunications: state.communications.length,
      communicationsByType: {},
      communicationsByCompany: {},
      averageResponseTime: 0,
      successRate: 0
    };

    // Calculate communications by type
    state.communications.forEach(comm => {
      stats.communicationsByType[comm.type] = (stats.communicationsByType[comm.type] || 0) + 1;
    });

    // Calculate communications by company
    state.companies.forEach(company => {
      const companyCommunications = state.communications.filter(c => c.companyId === company.id);
      stats.communicationsByCompany[company.name] = companyCommunications.length;
    });

    // Calculate average response time and success rate
    let totalResponseTime = 0;
    let successfulCommunications = 0;

    state.communications.forEach(comm => {
      if (comm.responseDate) {
        const responseTime = new Date(comm.responseDate) - new Date(comm.date);
        totalResponseTime += responseTime;
        successfulCommunications++;
      }
    });

    if (successfulCommunications > 0) {
      stats.averageResponseTime = totalResponseTime / successfulCommunications;
      stats.successRate = (successfulCommunications / state.communications.length) * 100;
    }

    return stats;
  };

  const getCompanyEngagement = (companyId) => {
    const companyCommunications = state.communications.filter(c => c.companyId === companyId);
    const lastSixMonths = new Array(6).fill(0);
    const today = new Date();

    companyCommunications.forEach(comm => {
      const commDate = new Date(comm.date);
      const monthDiff = (today.getMonth() + 12 - commDate.getMonth()) % 12;
      if (monthDiff < 6) {
        lastSixMonths[monthDiff]++;
      }
    });

    return lastSixMonths;
  };

  return {
    getCommunicationStats,
    getCompanyEngagement
  };
}
