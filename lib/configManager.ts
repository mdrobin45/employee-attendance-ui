/**
 * Configuration management system for working days and holidays
 * This system allows admins to configure holidays and alternate days
 */

import {
   DEFAULT_WORKING_DAY_CONFIG,
   WorkingDayConfig,
} from "./attendanceUtils";

export interface ConfigManager {
   // Get current working day configuration
   getWorkingDayConfig(): Promise<WorkingDayConfig>;

   // Update working day configuration
   updateWorkingDayConfig(config: WorkingDayConfig): Promise<void>;

   // Add a custom holiday
   addCustomHoliday(date: string): Promise<void>;

   // Remove a custom holiday
   removeCustomHoliday(date: string): Promise<void>;

   // Get all custom holidays
   getCustomHolidays(): Promise<string[]>;

   // Set fixed holidays (days of week)
   setFixedHolidays(daysOfWeek: number[]): Promise<void>;

   // Configure alternate days
   setAlternateDays(config: {
      enabled: boolean;
      dayOfWeek: number;
      pattern: "alternate" | "custom";
      customWeeks?: number[];
   }): Promise<void>;
}

/**
 * Database-based configuration manager
 * This implementation stores configuration in the database
 */
export class DatabaseConfigManager implements ConfigManager {
   async getWorkingDayConfig(): Promise<WorkingDayConfig> {
      try {
         // In a real implementation, this would fetch from database
         // For now, return default config
         const storedConfig = localStorage.getItem("workingDayConfig");
         if (storedConfig) {
            return JSON.parse(storedConfig);
         }
         return DEFAULT_WORKING_DAY_CONFIG;
      } catch (error) {
         console.error("Error fetching working day config:", error);
         return DEFAULT_WORKING_DAY_CONFIG;
      }
   }

   async updateWorkingDayConfig(config: WorkingDayConfig): Promise<void> {
      try {
         // In a real implementation, this would save to database
         localStorage.setItem("workingDayConfig", JSON.stringify(config));
      } catch (error) {
         console.error("Error updating working day config:", error);
         throw error;
      }
   }

   async addCustomHoliday(date: string): Promise<void> {
      const config = await this.getWorkingDayConfig();
      if (!config.customHolidays.includes(date)) {
         config.customHolidays.push(date);
         await this.updateWorkingDayConfig(config);
      }
   }

   async removeCustomHoliday(date: string): Promise<void> {
      const config = await this.getWorkingDayConfig();
      config.customHolidays = config.customHolidays.filter((d) => d !== date);
      await this.updateWorkingDayConfig(config);
   }

   async getCustomHolidays(): Promise<string[]> {
      const config = await this.getWorkingDayConfig();
      return config.customHolidays;
   }

   async setFixedHolidays(daysOfWeek: number[]): Promise<void> {
      const config = await this.getWorkingDayConfig();
      config.fixedHolidays = daysOfWeek;
      await this.updateWorkingDayConfig(config);
   }

   async setAlternateDays(alternateConfig: {
      enabled: boolean;
      dayOfWeek: number;
      pattern: "alternate" | "custom";
      customWeeks?: number[];
   }): Promise<void> {
      const config = await this.getWorkingDayConfig();
      config.alternateDays = alternateConfig;
      await this.updateWorkingDayConfig(config);
   }
}

/**
 * API-based configuration manager
 * This implementation communicates with backend API
 */
export class APIConfigManager implements ConfigManager {
   private baseUrl: string;

   constructor(baseUrl: string = "/api/v1/config") {
      this.baseUrl = baseUrl;
   }

   async getWorkingDayConfig(): Promise<WorkingDayConfig> {
      try {
         const response = await fetch(`${this.baseUrl}/working-days`);
         if (response.ok) {
            return await response.json();
         }
         return DEFAULT_WORKING_DAY_CONFIG;
      } catch (error) {
         console.error("Error fetching working day config:", error);
         return DEFAULT_WORKING_DAY_CONFIG;
      }
   }

   async updateWorkingDayConfig(config: WorkingDayConfig): Promise<void> {
      try {
         const response = await fetch(`${this.baseUrl}/working-days`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(config),
         });

         if (!response.ok) {
            throw new Error("Failed to update working day config");
         }
      } catch (error) {
         console.error("Error updating working day config:", error);
         throw error;
      }
   }

   async addCustomHoliday(date: string): Promise<void> {
      try {
         const response = await fetch(`${this.baseUrl}/custom-holidays`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ date }),
         });

         if (!response.ok) {
            throw new Error("Failed to add custom holiday");
         }
      } catch (error) {
         console.error("Error adding custom holiday:", error);
         throw error;
      }
   }

   async removeCustomHoliday(date: string): Promise<void> {
      try {
         const response = await fetch(
            `${this.baseUrl}/custom-holidays/${date}`,
            {
               method: "DELETE",
            }
         );

         if (!response.ok) {
            throw new Error("Failed to remove custom holiday");
         }
      } catch (error) {
         console.error("Error removing custom holiday:", error);
         throw error;
      }
   }

   async getCustomHolidays(): Promise<string[]> {
      try {
         const response = await fetch(`${this.baseUrl}/custom-holidays`);
         if (response.ok) {
            return await response.json();
         }
         return [];
      } catch (error) {
         console.error("Error fetching custom holidays:", error);
         return [];
      }
   }

   async setFixedHolidays(daysOfWeek: number[]): Promise<void> {
      const config = await this.getWorkingDayConfig();
      config.fixedHolidays = daysOfWeek;
      await this.updateWorkingDayConfig(config);
   }

   async setAlternateDays(alternateConfig: {
      enabled: boolean;
      dayOfWeek: number;
      pattern: "alternate" | "custom";
      customWeeks?: number[];
   }): Promise<void> {
      const config = await this.getWorkingDayConfig();
      config.alternateDays = alternateConfig;
      await this.updateWorkingDayConfig(config);
   }
}

// Export default config manager (can be switched between implementations)
export const configManager: ConfigManager = new DatabaseConfigManager();

// Helper functions for common configurations
export const createConfig = {
   // Create a config with Friday as holiday and alternating Saturdays
   fridayHolidayWithAlternatingSaturdays: (): WorkingDayConfig => ({
      fixedHolidays: [5], // Friday
      alternateDays: {
         enabled: true,
         dayOfWeek: 6, // Saturday
         pattern: "alternate",
      },
      customHolidays: [],
   }),

   // Create a config with custom holidays
   withCustomHolidays: (holidays: string[]): WorkingDayConfig => ({
      ...DEFAULT_WORKING_DAY_CONFIG,
      customHolidays: holidays,
   }),

   // Create a config with specific alternate weeks
   withCustomAlternateWeeks: (weeks: number[]): WorkingDayConfig => ({
      ...DEFAULT_WORKING_DAY_CONFIG,
      alternateDays: {
         enabled: true,
         dayOfWeek: 6, // Saturday
         pattern: "custom",
         customWeeks: weeks,
      },
   }),
};
