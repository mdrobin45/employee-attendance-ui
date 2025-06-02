export interface User {
  id: string
  name: string
  department: string
}

export interface AttendanceRecord {
  id: string
  date: string
  clockIn: string
  clockOut: string
  totalHours: string
}
