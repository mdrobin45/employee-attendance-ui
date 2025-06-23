# Admin Panel Documentation

## Overview

The Admin Panel is a comprehensive management interface for the Attendance Management System. It provides administrators with tools to manage employees, configure working days, generate reports, and monitor system health.

## Access

-  **URL**: `/admin`
-  **Access Control**: Only users with admin privileges can access the panel
-  **Navigation**: Available via "Admin Panel" button in the main attendance page (for admin users)

## Features

### 1. Dashboard Overview

The main dashboard provides:

-  **System Statistics**: Total employees, active employees, total records, today's records
-  **System Health**: Database, API, and authentication status monitoring
-  **Quick Actions**: Direct access to common administrative tasks

### 2. Employee Management

**Location**: Employees tab

**Features**:

-  View all employees with their current status
-  Search and filter employees by department
-  Add new employees
-  View employee details including:
   -  Current clock-in/out status
   -  Last active time
   -  Total attendance records
   -  Department assignment

**Actions**:

-  Add Employee: Create new employee accounts
-  View Details: See detailed employee information
-  Edit Employee: Modify employee information
-  Delete Employee: Remove employees from the system

### 3. Working Day Configuration

**Location**: Settings tab

**Features**:

-  **Fixed Holidays**: Set specific days of the week as holidays (e.g., Fridays)
-  **Alternate Days**: Configure days that work on alternating weeks (e.g., Saturdays)
-  **Custom Holidays**: Add specific dates as holidays (national holidays, etc.)
-  **Preset Configurations**: Quick setup for common working day patterns

**Configuration Options**:

-  **Fixed Holidays**: Select days of the week (Sunday-Saturday)
-  **Alternate Days**:
   -  Enable/disable alternate day system
   -  Choose which day of the week
   -  Pattern: Every other week or custom weeks
   -  Custom weeks: Specify which weeks (1,3,5, etc.)
-  **Custom Holidays**: Add specific dates in YYYY-MM-DD format

### 4. Attendance Reports

**Location**: Reports tab

**Features**:

-  **Report Types**: Monthly, weekly, daily, or custom period reports
-  **Filtering**: By month, year, and department
-  **Export Options**: CSV, PDF, and Excel formats
-  **Summary Statistics**: Total present/absent/extra days and average attendance rates

**Report Data**:

-  Employee attendance breakdown
-  Present, absent, and extra days
-  Total hours worked
-  Average hours per day
-  Attendance rate percentages

### 5. System Overview

**Location**: Overview tab

**Features**:

-  **System Health Monitoring**: Real-time status of database, API, and authentication
-  **Attendance Trends**: 7-day attendance overview with trend indicators
-  **Recent Activity**: Latest system events and actions
-  **Quick Actions**: Direct access to common tasks

## API Endpoints

### Admin Statistics

-  **GET** `/api/v1/admin/stats`
-  Returns system statistics and recent activity

### Employee Management

-  **GET** `/api/v1/admin/employees`
-  Returns list of all employees
-  **POST** `/api/v1/admin/employees`
-  Creates a new employee

### Working Day Configuration

-  **GET** `/api/v1/config/working-days`
-  Returns current working day configuration
-  **PUT** `/api/v1/config/working-days`
-  Updates working day configuration

## Configuration Management

The system uses a configurable working day system that supports:

### Default Configuration

```typescript
{
  fixedHolidays: [5], // Friday is holiday
  alternateDays: {
    enabled: true,
    dayOfWeek: 6, // Saturday
    pattern: "alternate", // Every other week
  },
  customHolidays: [], // No custom holidays by default
}
```

### Configuration Options

1. **Fixed Holidays**: Days of the week that are always holidays

   -  0 = Sunday, 1 = Monday, ..., 6 = Saturday

2. **Alternate Days**: Days that work on alternating weeks

   -  Can be configured for any day of the week
   -  Supports "alternate" (every other week) or "custom" patterns
   -  Custom patterns allow specifying exact weeks

3. **Custom Holidays**: Specific dates as holidays
   -  Format: YYYY-MM-DD
   -  Examples: National holidays, company events

## Usage Examples

### Setting Up Friday as Holiday with Alternating Saturdays

1. Go to Settings tab
2. Click "Friday Holiday + Alternating Saturdays" preset
3. Click "Save Configuration"

### Adding Custom Holidays

1. Go to Settings tab
2. Scroll to "Custom Holidays" section
3. Enter date in YYYY-MM-DD format
4. Click "Add"
5. Click "Save Configuration"

### Generating Monthly Report

1. Go to Reports tab
2. Select "Monthly Report" from Report Type
3. Choose month and year
4. Optionally filter by department
5. View report or export in desired format

### Adding New Employee

1. Go to Employees tab
2. Click "Add Employee"
3. Fill in required fields:
   -  Employee ID
   -  Full Name
   -  Email
   -  Department
4. Click "Add Employee"

## Security Considerations

-  Admin panel access is restricted to users with admin privileges
-  All configuration changes are logged
-  API endpoints include proper validation
-  Sensitive operations require confirmation

## Integration Points

The admin panel integrates with:

-  **Attendance System**: Uses the same working day configuration
-  **Employee Records**: Manages employee data used by the attendance system
-  **Reporting System**: Generates reports based on attendance data
-  **Configuration Management**: Updates working day rules used throughout the system

## Future Enhancements

Planned features include:

-  **Calendar View**: Visual calendar showing attendance patterns and holidays
-  **Advanced Analytics**: Detailed attendance analytics and trends
-  **Bulk Operations**: Import/export employee data
-  **Notification System**: Alerts for attendance issues
-  **Audit Logs**: Detailed logs of all administrative actions
