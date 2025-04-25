# Citizen Complaint Platform

A modern web application that allows citizens to report and track civic issues in their community. Built with React.js, TypeScript, and Material-UI.

## Features

- User Authentication (Citizen and Admin roles)
- Complaint Submission with Image Upload and Geolocation
- Complaint Status Tracking with Timeline
- Feedback and Rating System
- Admin Dashboard for Complaint Management
- Responsive and User-Friendly Interface

## Tech Stack

- **Frontend:**
  - React.js with TypeScript
  - Material-UI for UI components
  - React Router for navigation
  - Formik and Yup for form handling and validation
  - React Dropzone for file uploads
  - React Map GL for geolocation features

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd citizen-complaint-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```
   REACT_APP_API_URL=http://localhost:8080/api
   REACT_APP_MAPBOX_TOKEN=your_mapbox_token
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── components/         # Reusable components
├── contexts/          # React contexts (Auth, etc.)
├── pages/             # Page components
├── theme.ts           # Material-UI theme configuration
└── App.tsx            # Main application component
```

## API Integration

The frontend is designed to work with a Spring Boot backend. The following API endpoints are expected:

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login

### Complaints
- GET `/api/complaints` - Get user's complaints
- POST `/api/complaints` - Submit new complaint
- GET `/api/complaints/:id` - Get complaint details
- POST `/api/complaints/:id/feedback` - Submit feedback

### Admin
- GET `/api/admin/complaints` - Get all complaints
- PUT `/api/admin/complaints/:id/status` - Update complaint status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 