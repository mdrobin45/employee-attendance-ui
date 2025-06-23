"use client";

import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { WorkingDayConfig } from "@/lib/attendanceUtils";
import { configManager, createConfig } from "@/lib/configManager";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const DAYS_OF_WEEK = [
   { value: 0, label: "Sunday" },
   { value: 1, label: "Monday" },
   { value: 2, label: "Tuesday" },
   { value: 3, label: "Wednesday" },
   { value: 4, label: "Thursday" },
   { value: 5, label: "Friday" },
   { value: 6, label: "Saturday" },
];

export default function WorkingDayConfigPanel() {
   const [config, setConfig] = useState<WorkingDayConfig | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [newHoliday, setNewHoliday] = useState("");

   useEffect(() => {
      loadConfig();
   }, []);

   const loadConfig = async () => {
      try {
         const currentConfig = await configManager.getWorkingDayConfig();
         setConfig(currentConfig);
      } catch (error) {
         console.error("Error loading config:", error);
         toast.error("Failed to load configuration");
      }
   };

   const saveConfig = async () => {
      if (!config) return;

      setIsLoading(true);
      try {
         await configManager.updateWorkingDayConfig(config);
         toast.success("Configuration saved successfully");
      } catch (error) {
         console.error("Error saving config:", error);
         toast.error("Failed to save configuration");
      } finally {
         setIsLoading(false);
      }
   };

   const addCustomHoliday = async () => {
      if (!newHoliday) return;

      try {
         await configManager.addCustomHoliday(newHoliday);
         setNewHoliday("");
         await loadConfig();
         toast.success("Custom holiday added");
      } catch (error) {
         console.error("Error adding holiday:", error);
         toast.error("Failed to add custom holiday");
      }
   };

   const removeCustomHoliday = async (date: string) => {
      try {
         await configManager.removeCustomHoliday(date);
         await loadConfig();
         toast.success("Custom holiday removed");
      } catch (error) {
         console.error("Error removing holiday:", error);
         toast.error("Failed to remove custom holiday");
      }
   };

   const updateFixedHolidays = (dayOfWeek: number, checked: boolean) => {
      if (!config) return;

      const newFixedHolidays = checked
         ? [...config.fixedHolidays, dayOfWeek]
         : config.fixedHolidays.filter((d) => d !== dayOfWeek);

      setConfig({ ...config, fixedHolidays: newFixedHolidays });
   };

   const updateAlternateDays = (
      updates: Partial<WorkingDayConfig["alternateDays"]>
   ) => {
      if (!config) return;

      setConfig({
         ...config,
         alternateDays: { ...config.alternateDays, ...updates },
      });
   };

   const applyPreset = (preset: () => WorkingDayConfig) => {
      const newConfig = preset();
      setConfig(newConfig);
   };

   if (!config) {
      return <div>Loading configuration...</div>;
   }

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Working Day Configuration</h2>
            <Button onClick={saveConfig} disabled={isLoading}>
               {isLoading ? "Saving..." : "Save Configuration"}
            </Button>
         </div>

         {/* Preset Configurations */}
         <Card>
            <CardHeader>
               <CardTitle>Quick Presets</CardTitle>
               <CardDescription>
                  Apply common working day configurations
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
               <Button
                  variant="outline"
                  onClick={() =>
                     applyPreset(
                        createConfig.fridayHolidayWithAlternatingSaturdays
                     )
                  }
                  className="w-full">
                  Friday Holiday + Alternating Saturdays
               </Button>
               <Button
                  variant="outline"
                  onClick={() =>
                     applyPreset(() =>
                        createConfig.withCustomHolidays([
                           "2024-12-25",
                           "2024-01-01",
                        ])
                     )
                  }
                  className="w-full">
                  Add Christmas & New Year Holidays
               </Button>
            </CardContent>
         </Card>

         {/* Fixed Holidays */}
         <Card>
            <CardHeader>
               <CardTitle>Fixed Holidays</CardTitle>
               <CardDescription>
                  Select days of the week that are always holidays
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
               {DAYS_OF_WEEK.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                     <Checkbox
                        id={`day-${day.value}`}
                        checked={config.fixedHolidays.includes(day.value)}
                        onCheckedChange={(checked) =>
                           updateFixedHolidays(day.value, checked as boolean)
                        }
                     />
                     <Label htmlFor={`day-${day.value}`}>{day.label}</Label>
                  </div>
               ))}
            </CardContent>
         </Card>

         {/* Alternate Days Configuration */}
         <Card>
            <CardHeader>
               <CardTitle>Alternate Days</CardTitle>
               <CardDescription>
                  Configure days that work on alternating weeks
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center space-x-2">
                  <Switch
                     checked={config.alternateDays.enabled}
                     onCheckedChange={(enabled) =>
                        updateAlternateDays({ enabled })
                     }
                  />
                  <Label>Enable Alternate Days</Label>
               </div>

               {config.alternateDays.enabled && (
                  <>
                     <div className="space-y-2">
                        <Label>Day of Week</Label>
                        <Select
                           value={config.alternateDays.dayOfWeek.toString()}
                           onValueChange={(value) =>
                              updateAlternateDays({
                                 dayOfWeek: parseInt(value),
                              })
                           }>
                           <SelectTrigger>
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              {DAYS_OF_WEEK.map((day) => (
                                 <SelectItem
                                    key={day.value}
                                    value={day.value.toString()}>
                                    {day.label}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>

                     <div className="space-y-2">
                        <Label>Pattern</Label>
                        <Select
                           value={config.alternateDays.pattern}
                           onValueChange={(value: "alternate" | "custom") =>
                              updateAlternateDays({ pattern: value })
                           }>
                           <SelectTrigger>
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="alternate">
                                 Every Other Week
                              </SelectItem>
                              <SelectItem value="custom">
                                 Custom Weeks
                              </SelectItem>
                           </SelectContent>
                        </Select>
                     </div>

                     {config.alternateDays.pattern === "custom" && (
                        <div className="space-y-2">
                           <Label>Custom Weeks (comma-separated)</Label>
                           <Input
                              placeholder="1,3,5"
                              value={
                                 config.alternateDays.customWeeks?.join(",") ||
                                 ""
                              }
                              onChange={(e) => {
                                 const weeks = e.target.value
                                    .split(",")
                                    .map((w) => parseInt(w.trim()))
                                    .filter((w) => !isNaN(w));
                                 updateAlternateDays({ customWeeks: weeks });
                              }}
                           />
                        </div>
                     )}
                  </>
               )}
            </CardContent>
         </Card>

         {/* Custom Holidays */}
         <Card>
            <CardHeader>
               <CardTitle>Custom Holidays</CardTitle>
               <CardDescription>
                  Add specific dates as holidays (e.g., national holidays)
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex space-x-2">
                  <Input
                     type="date"
                     value={newHoliday}
                     onChange={(e) => setNewHoliday(e.target.value)}
                     placeholder="YYYY-MM-DD"
                  />
                  <Button onClick={addCustomHoliday} disabled={!newHoliday}>
                     Add
                  </Button>
               </div>

               <div className="space-y-2">
                  {config.customHolidays.map((date) => (
                     <div
                        key={date}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>{new Date(date).toLocaleDateString()}</span>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => removeCustomHoliday(date)}>
                           Remove
                        </Button>
                     </div>
                  ))}
                  {config.customHolidays.length === 0 && (
                     <p className="text-gray-500">No custom holidays added</p>
                  )}
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
