import { format, parseISO, isAfter, isSameDay } from 'date-fns';

export const generateCommunicationReport = (communications, companies) => {
  // Group communications by company
  const groupedComms = communications.reduce((acc, comm) => {
    const company = companies.find(c => c.id === comm.companyId);
    if (!company) return acc;

    if (!acc[company.name]) {
      acc[company.name] = [];
    }
    acc[company.name].push({
      ...comm,
      companyName: company.name,
      status: getCommunicationStatus(comm, company),
      nextDueDate: getNextDueDate(comm, company)
    });
    return acc;
  }, {});

  // Generate CSV content
  let csvContent = 'Company,Communication Date,Method,Notes,Status,Next Due Date\n';

  Object.entries(groupedComms).forEach(([companyName, comms]) => {
    comms.forEach(comm => {
      const row = [
        companyName,
        format(parseISO(comm.date), 'yyyy-MM-dd'),
        comm.method,
        comm.notes.replace(/,/g, ';'), // Replace commas with semicolons in notes
        comm.status,
        format(comm.nextDueDate, 'yyyy-MM-dd')
      ];
      csvContent += row.join(',') + '\n';
    });
  });

  return csvContent;
};

export const generateSummaryReport = (communications, companies) => {
  const summary = companies.map(company => {
    const companyComms = communications.filter(c => c.companyId === company.id);
    const lastComm = companyComms.length > 0 
      ? companyComms.reduce((latest, current) => 
          isAfter(parseISO(current.date), parseISO(latest.date)) ? current : latest
        )
      : null;

    const nextDueDate = lastComm 
      ? getNextDueDate(lastComm, company)
      : new Date();

    const status = lastComm 
      ? getCommunicationStatus({ ...lastComm, nextDueDate }, company)
      : 'No Communications';

    return {
      companyName: company.name,
      totalCommunications: companyComms.length,
      lastCommunicationDate: lastComm ? format(parseISO(lastComm.date), 'yyyy-MM-dd') : 'Never',
      nextDueDate: format(nextDueDate, 'yyyy-MM-dd'),
      status,
      communicationPeriodicity: company.communicationPeriodicity
    };
  });

  // Generate CSV content
  let csvContent = 'Company,Total Communications,Last Communication,Next Due Date,Status,Communication Periodicity (days)\n';
  
  summary.forEach(row => {
    const csvRow = [
      row.companyName,
      row.totalCommunications,
      row.lastCommunicationDate,
      row.nextDueDate,
      row.status,
      row.communicationPeriodicity
    ];
    csvContent += csvRow.join(',') + '\n';
  });

  return csvContent;
};

const getCommunicationStatus = (communication, company) => {
  const today = new Date();
  const dueDate = getNextDueDate(communication, company);

  if (isAfter(today, dueDate)) {
    return 'Overdue';
  } else if (isSameDay(today, dueDate)) {
    return 'Due Today';
  }
  return 'On Track';
};

const getNextDueDate = (communication, company) => {
  const commDate = parseISO(communication.date);
  const dueDate = new Date(commDate);
  dueDate.setDate(dueDate.getDate() + company.communicationPeriodicity);
  return dueDate;
};
