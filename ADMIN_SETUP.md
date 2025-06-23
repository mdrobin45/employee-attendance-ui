# Admin Panel Setup Guide

## Overview

This guide will help you set up and test the admin panel functionality for the Attendance Management System.

## Prerequisites

-  Node.js and npm installed
-  Database set up and running
-  Prisma migrations applied

## Setup Steps

### 1. Create Admin User

Run the following command to create a dummy admin user:

```bash
npm run seed:admin
```

This will create an admin user with the following credentials:

-  **Employee ID**: `ADMIN001`
-  **Password**: `admin123`
-  **Name**: Admin User
-  **Email**: admin@company.com
-  **Department**: admin

### 2. Login as Admin

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to the login page: `http://localhost:3000/login`

3. Login with the admin credentials:
   -  Employee ID: `ADMIN001`
   -  Password: `admin123`

### 3. Access Admin Panel

After successful login, you should see an "Admin Panel" button in the top navigation. Click it to access the admin dashboard at `/admin`.

## Admin Panel Features

### Dashboard Overview

-  System statistics and health monitoring
-  Quick access to all admin functions

### Employee Management

-  View all employees
-  Add new employees
-  Search and filter employees
-  View employee attendance status

### Working Day Configuration

-  Set fixed holidays (e.g., Fridays)
-  Configure alternate working days (e.g., alternating Saturdays)
-  Add custom holidays
-  Apply preset configurations

### Attendance Reports

-  Generate monthly, weekly, daily reports
-  Filter by department and date range
-  Export reports in CSV, PDF, Excel formats
-  View attendance statistics and trends

### System Overview

-  Monitor system health (database, API, authentication)
-  View attendance trends
-  Check recent system activities

## Testing Scenarios

### 1. Basic Admin Access

-  Login with admin credentials
-  Verify admin panel button appears
-  Access admin dashboard
-  Check all tabs are functional

### 2. Employee Management

-  Add a new employee
-  Search for employees
-  Filter by department
-  View employee details

### 3. Working Day Configuration

-  Apply "Friday Holiday + Alternating Saturdays" preset
-  Add a custom holiday
-  Save configuration
-  Verify changes are applied

### 4. Report Generation

-  Generate a monthly report
-  Filter by department
-  Export report in different formats
-  View summary statistics

### 5. Access Control

-  Login with non-admin user
-  Verify admin panel button is not visible
-  Try to access `/admin` directly (should redirect to employee dashboard)

## Troubleshooting

### Admin Panel Not Accessible

1. Verify admin user was created successfully
2. Check that you're logged in with admin credentials
3. Ensure the department is set to "admin" (not "adminstrator" or similar)
4. Check browser console for any errors

### Admin Button Not Visible

1. Verify you're logged in with admin user
2. Check that `session.user.department === 'admin'`
3. Refresh the page after login

### Database Connection Issues

1. Ensure database is running
2. Check Prisma connection
3. Verify environment variables are set correctly

## Security Notes

-  The admin user is for testing purposes only
-  Change the default password in production
-  Implement proper role-based access control
-  Add audit logging for admin actions
-  Use environment variables for sensitive data

## Production Considerations

Before deploying to production:

1. **Remove or secure the seed script**
2. **Change default admin password**
3. **Implement proper authentication middleware**
4. **Add rate limiting for admin endpoints**
5. **Set up proper logging and monitoring**
6. **Configure HTTPS and security headers**
7. **Implement session management best practices**

## API Endpoints

The admin panel uses these API endpoints:

-  `GET /api/v1/admin/stats` - Admin statistics
-  `GET /api/v1/admin/employees` - Employee list
-  `POST /api/v1/admin/employees` - Create employee
-  `GET /api/v1/config/working-days` - Get working day config
-  `PUT /api/v1/config/working-days` - Update working day config

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure database is properly configured
4. Check the application logs
5. Verify environment variables are set correctly
