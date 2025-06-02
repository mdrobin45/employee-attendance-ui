import { AttendanceRecord } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const attendanceService = {
   async clockIn(employeeId: string): Promise<AttendanceRecord> {
      const now = new Date();
      const response = await fetch(`${API_BASE_URL}/records/clock`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
         body: JSON.stringify({
            date: now.toISOString(),
            clockIn: now.toLocaleTimeString("en-US", {
               hour12: false,
               hour: "2-digit",
               minute: "2-digit",
            }),
            clockOut: "",
            totalHours: 0,
            employeeId,
         }),
      });

      if (!response.ok) {
         throw new Error("Failed to clock in");
      }

      return response.json();
   },

   async clockOut(employeeId: string): Promise<AttendanceRecord> {
      const cookieStore = await cookies();
      const now = new Date();
      const response = await fetch(`${API_BASE_URL}/records/clock`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookieStore.get("access_token")?.value}`,
         },
         body: JSON.stringify({
            date: now.toISOString(),
            clockIn: "", // This will be updated by the backend
            clockOut: now.toLocaleTimeString("en-US", {
               hour12: false,
               hour: "2-digit",
               minute: "2-digit",
            }),
            totalHours: 0, // This will be calculated by the backend
            employeeId,
         }),
      });

      if (!response.ok) {
         throw new Error("Failed to clock out");
      }

      return response.json();
   },

   async getRecords(): Promise<AttendanceRecord[]> {
      const response = await fetch(`${API_BASE_URL}/records`, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
      });

      if (!response.ok) {
         throw new Error("Failed to fetch records");
      }

      return response.json();
   },
};
