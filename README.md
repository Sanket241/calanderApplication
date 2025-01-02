# Communication Calendar Application

A React-based calendar application for tracking and managing company communications. This tool provides a centralized platform to log past interactions, plan future communications, and manage the frequency of engagement based on predefined schedules.

## Features

### Admin Module
- Company Management
  - Add, edit, and delete companies
  - Manage company details (name, location, contact info)
  - Set communication periodicity
- Communication Method Management
  - Configure available communication methods
  - Set sequence and mandatory flags
  - Default methods include LinkedIn Post, LinkedIn Message, Email, Phone Call

### User Module
- Dashboard
  - Grid view of companies and their communication status
  - Color-coded highlights for overdue and due communications
  - Interactive tooltips for communication details
- Calendar View
  - Monthly calendar interface
  - View past and upcoming communications
  - Add new communication events

### Analytics Module (Optional)
- Communication frequency reports
- Engagement effectiveness dashboard
- Overdue communication trends
- Downloadable reports in PDF/CSV format
- Real-time activity log

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Technology Stack

- React 18
- Material-UI (MUI)
- Date-fns for date manipulation
- Vite for build tooling

## Known Limitations

- Currently uses local state management (no persistence)
- Authentication and authorization not implemented
- Limited to single-user mode

## Future Enhancements

- Add database integration
- Implement user authentication
- Add email notification system
- Enable multi-user collaboration
- Add data export/import functionality
