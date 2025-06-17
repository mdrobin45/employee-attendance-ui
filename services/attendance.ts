import { AttendanceRecord } from "@/lib/types";
import apiClient from "./apiClient";

export const clockIn = async (newRecord: AttendanceRecord) => {
   const response = await apiClient.post(
      process.env.NEXT_PUBLIC_API_URL + "/clock-in",
      newRecord
   );
   if (response.status === 200) {
      return response.data;
   }
   return null;
};
