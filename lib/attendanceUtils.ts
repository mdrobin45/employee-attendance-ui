/**
 * Utility functions for attendance calculations
 * These functions implement company-specific working day rules:
 * - Holidays are configurable by admin
 * - Saturdays can be configured as alternate weeks
 * - Employees can work on off days (extra days)
 * - Extra days can offset future absences
 */

export interface AttendanceRecord {
   id: number;
   clockIn: string;
   clockOut: string | null;
   totalHours: number | null;
   createdAt: string;
   updatedAt: string;
}

export interface WorkingDayConfig {
   // Fixed holidays (e.g., Fridays)
   fixedHolidays: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday

   // Alternate day configuration
   alternateDays: {
      enabled: boolean;
      dayOfWeek: number; // Which day (e.g., 6 for Saturday)
      pattern: "alternate" | "custom"; // alternate = every other week, custom = specific weeks
      customWeeks?: number[]; // For custom pattern, specify which weeks (1,3,5 etc.)
   };

   // Custom holiday dates (specific dates like national holidays)
   customHolidays: string[]; // Array of date strings in 'YYYY-MM-DD' format
}

// Default configuration (can be overridden by admin)
export const DEFAULT_WORKING_DAY_CONFIG: WorkingDayConfig = {
   fixedHolidays: [5], // Friday is holiday
   alternateDays: {
      enabled: true,
      dayOfWeek: 6, // Saturday
      pattern: "alternate", // Every other week
   },
   customHolidays: [], // No custom holidays by default
};

/**
 * Check if a specific date is a working day according to configurable rules
 */
export const isWorkingDay = (
   date: Date,
   config: WorkingDayConfig = DEFAULT_WORKING_DAY_CONFIG
): boolean => {
   const dayOfWeek = date.getDay();
   const dayOfMonth = date.getDate();
   const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD format

   // Check if it's a custom holiday
   if (config.customHolidays.includes(dateString)) {
      return false;
   }

   // Check if it's a fixed holiday
   if (config.fixedHolidays.includes(dayOfWeek)) {
      return false;
   }

   // Check alternate days configuration
   if (
      config.alternateDays.enabled &&
      dayOfWeek === config.alternateDays.dayOfWeek
   ) {
      const weekOfMonth = Math.ceil(dayOfMonth / 7);

      if (config.alternateDays.pattern === "alternate") {
         // Every other week (odd weeks have office)
         return weekOfMonth % 2 === 1;
      } else if (
         config.alternateDays.pattern === "custom" &&
         config.alternateDays.customWeeks
      ) {
         // Custom weeks specified by admin
         return config.alternateDays.customWeeks.includes(weekOfMonth);
      }

      // If no pattern specified, treat as regular working day
      return true;
   }

   // All other days are working days
   return true;
};

/**
 * Check if a specific date is an off day (not a regular working day)
 */
export const isOffDay = (
   date: Date,
   config: WorkingDayConfig = DEFAULT_WORKING_DAY_CONFIG
): boolean => {
   return !isWorkingDay(date, config);
};

/**
 * Calculate extra days worked (days worked on off days)
 */
export const calculateExtraDays = (
   records: AttendanceRecord[],
   year: number,
   month: number,
   config: WorkingDayConfig = DEFAULT_WORKING_DAY_CONFIG
): number => {
   const startOfMonth = new Date(year, month, 1);
   const endOfMonth = new Date(year, month + 1, 0);

   const extraDates = new Set<string>();

   records.forEach((record) => {
      const recordDate = new Date(record.clockIn);
      if (recordDate >= startOfMonth && recordDate <= endOfMonth) {
         // If it's an off day and employee worked, count as extra day
         if (isOffDay(recordDate, config)) {
            extraDates.add(recordDate.toDateString());
         }
      }
   });

   return extraDates.size;
};

/**
 * Calculate working days in a given month
 */
export const getWorkingDaysInMonth = (
   year: number,
   month: number,
   config: WorkingDayConfig = DEFAULT_WORKING_DAY_CONFIG
): number => {
   const startOfMonth = new Date(year, month, 1);
   const endOfMonth = new Date(year, month + 1, 0);

   let workingDays = 0;
   const currentDate = new Date(startOfMonth);

   while (currentDate <= endOfMonth) {
      if (isWorkingDay(currentDate, config)) {
         workingDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
   }

   return workingDays;
};

/**
 * Calculate attendance statistics for a given month
 */
export const calculateAttendanceStats = (
   records: AttendanceRecord[],
   year: number,
   month: number,
   config: WorkingDayConfig = DEFAULT_WORKING_DAY_CONFIG
) => {
   const startOfMonth = new Date(year, month, 1);
   const endOfMonth = new Date(year, month + 1, 0);

   // Get unique dates where employee was present
   const presentDates = new Set<string>();
   const workingDayPresentDates = new Set<string>();
   const offDayPresentDates = new Set<string>();

   records.forEach((record) => {
      const recordDate = new Date(record.clockIn);
      if (recordDate >= startOfMonth && recordDate <= endOfMonth) {
         presentDates.add(recordDate.toDateString());

         if (isWorkingDay(recordDate, config)) {
            workingDayPresentDates.add(recordDate.toDateString());
         } else {
            offDayPresentDates.add(recordDate.toDateString());
         }
      }
   });

   const presentDays = presentDates.size;
   const workingDays = getWorkingDaysInMonth(year, month, config);
   const extraDays = offDayPresentDates.size;

   // Calculate absent days: working days - present on working days
   const absentDays = Math.max(0, workingDays - workingDayPresentDates.size);

   return {
      presentDays,
      absentDays,
      workingDays,
      extraDays,
      workingDayPresentDays: workingDayPresentDates.size,
      offDayPresentDays: offDayPresentDates.size,
   };
};

/**
 * Calculate cumulative extra days (for offsetting future absences)
 * This would typically be calculated across multiple months
 */
export const calculateCumulativeExtraDays = (
   records: AttendanceRecord[],
   upToYear: number,
   upToMonth: number,
   config: WorkingDayConfig = DEFAULT_WORKING_DAY_CONFIG
): number => {
   let totalExtraDays = 0;

   // Calculate extra days for each month up to the specified month
   for (let year = 2024; year <= upToYear; year++) {
      const startMonth = year === 2024 ? 0 : 0; // Adjust based on your data start
      const endMonth = year === upToYear ? upToMonth : 11;

      for (let month = startMonth; month <= endMonth; month++) {
         const extraDays = calculateExtraDays(records, year, month, config);
         totalExtraDays += extraDays;
      }
   }

   return totalExtraDays;
};

/**
 * Calculate adjusted attendance stats that account for extra days offsetting absences
 */
export const calculateAdjustedAttendanceStats = (
   records: AttendanceRecord[],
   year: number,
   month: number,
   config: WorkingDayConfig = DEFAULT_WORKING_DAY_CONFIG
) => {
   const basicStats = calculateAttendanceStats(records, year, month, config);
   const cumulativeExtraDays = calculateCumulativeExtraDays(
      records,
      year,
      month,
      config
   );

   // Extra days can offset absences
   const adjustedAbsentDays = Math.max(
      0,
      basicStats.absentDays - cumulativeExtraDays
   );
   const extraDaysUsed = Math.min(basicStats.absentDays, cumulativeExtraDays);
   const remainingExtraDays = cumulativeExtraDays - extraDaysUsed;

   return {
      ...basicStats,
      adjustedAbsentDays,
      extraDaysUsed,
      remainingExtraDays,
   };
};

/**
 * Format decimal hours to hours and minutes
 */
export const formatHoursToHoursMinutes = (decimalHours: number): string => {
   const hours = Math.floor(decimalHours);
   const minutes = Math.round((decimalHours - hours) * 60);

   if (hours === 0) {
      return `${minutes}m`;
   } else if (minutes === 0) {
      return `${hours}h`;
   } else {
      return `${hours}h ${minutes}m`;
   }
};

/**
 * Calculate hours worked on a specific date
 */
export const calculateHoursForDate = (
   records: AttendanceRecord[],
   targetDate: Date
): number => {
   const targetDateString = targetDate.toDateString();

   return records.reduce((total, record) => {
      const recordDate = new Date(record.clockIn);
      if (recordDate.toDateString() === targetDateString) {
         return total + (record.totalHours || 0);
      }
      return total;
   }, 0);
};
