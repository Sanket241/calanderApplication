export const dummyCompanies = [
  {
    id: 1,
    name: "Tech Innovators Inc.",
    communicationPeriodicity: 30,
    email: "contact@techinnovators.com",
    phone: "+1-555-0123"
  },
  {
    id: 2,
    name: "Global Solutions Ltd.",
    communicationPeriodicity: 15,
    email: "info@globalsolutions.com",
    phone: "+1-555-0124"
  },
  {
    id: 3,
    name: "Digital Dynamics",
    communicationPeriodicity: 45,
    email: "hello@digitaldynamics.com",
    phone: "+1-555-0125"
  },
  {
    id: 4,
    name: "Future Systems",
    communicationPeriodicity: 20,
    email: "contact@futuresystems.com",
    phone: "+1-555-0126"
  },
  {
    id: 5,
    name: "Smart Analytics Co.",
    communicationPeriodicity: 25,
    email: "info@smartanalytics.com",
    phone: "+1-555-0127"
  }
];

export const dummyCommunicationMethods = [
  {
    id: 1,
    name: "Email",
    description: "Electronic mail communication"
  },
  {
    id: 2,
    name: "Phone Call",
    description: "Voice call communication"
  },
  {
    id: 3,
    name: "Video Conference",
    description: "Virtual face-to-face meeting"
  },
  {
    id: 4,
    name: "In-Person Meeting",
    description: "Physical face-to-face meeting"
  }
];

// Helper function to create dates relative to today
const getRelativeDate = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

export const dummyCommunications = [
  {
    id: 1,
    companyId: 1,
    date: getRelativeDate(-40),
    method: "Email",
    notes: "Discussed Q4 project timeline and deliverables"
  },
  {
    id: 2,
    companyId: 1,
    date: getRelativeDate(-10),
    method: "Video Conference",
    notes: "Project status update and resource allocation review"
  },
  {
    id: 3,
    companyId: 2,
    date: getRelativeDate(-20),
    method: "Phone Call",
    notes: "Contract renewal discussion"
  },
  {
    id: 4,
    companyId: 2,
    date: getRelativeDate(-5),
    method: "Email",
    notes: "Follow-up on contract terms and pricing"
  },
  {
    id: 5,
    companyId: 3,
    date: getRelativeDate(-60),
    method: "In-Person Meeting",
    notes: "Initial project kickoff meeting"
  },
  {
    id: 6,
    companyId: 3,
    date: getRelativeDate(-15),
    method: "Video Conference",
    notes: "Project milestone review"
  },
  {
    id: 7,
    companyId: 4,
    date: getRelativeDate(-25),
    method: "Email",
    notes: "Product feature requirements discussion"
  },
  {
    id: 8,
    companyId: 4,
    date: getRelativeDate(-3),
    method: "Phone Call",
    notes: "Urgent bug fix coordination"
  },
  {
    id: 9,
    companyId: 5,
    date: getRelativeDate(-30),
    method: "Video Conference",
    notes: "Quarterly business review"
  },
  {
    id: 10,
    companyId: 5,
    date: getRelativeDate(-1),
    method: "Email",
    notes: "Follow-up on action items from QBR"
  }
];
