export interface User {
   id: string;
   name: string;
   department: string;
}

export interface AttendanceRecord {
   employeeId: string;
   clockIn: string;
   clockOut?: string | null;
}
