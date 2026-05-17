import type { Plant, PlantInGarden, Task } from "@/types";
import { generateId, addDays, todayISO } from "@/lib/utils";

export function generateTasksForPlant(
  pig: PlantInGarden,
  plant: Plant,
  userId: string,
  daysAhead = 30
): Task[] {
  const tasks: Task[] = [];
  const today = new Date();
  const plantingDate = new Date(pig.plantingDate);

  for (let i = 0; i <= daysAhead; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    // Calculate days since planting for this future date
    const daysSincePlanting = Math.floor(
      (date.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSincePlanting < 0) continue;

    // Water task
    if (plant.waterFrequency > 0 && daysSincePlanting % plant.waterFrequency === 0) {
      tasks.push({
        id: generateId(),
        userId,
        plantInGardenId: pig.id,
        plantId: pig.plantId,
        type: "water",
        dueDate: dateStr,
        completed: false,
      });
    }

    // Fertilize task every 14 days
    if (daysSincePlanting > 0 && daysSincePlanting % 14 === 0) {
      tasks.push({
        id: generateId(),
        userId,
        plantInGardenId: pig.id,
        plantId: pig.plantId,
        type: "fertilize",
        dueDate: dateStr,
        completed: false,
      });
    }

    // Harvest task
    if (
      plant.timeToHarvestDays > 0 &&
      daysSincePlanting === plant.timeToHarvestDays
    ) {
      tasks.push({
        id: generateId(),
        userId,
        plantInGardenId: pig.id,
        plantId: pig.plantId,
        type: "harvest",
        dueDate: dateStr,
        completed: false,
      });
    }
  }

  return tasks;
}

export function getTasksForDate(tasks: Task[], dateStr: string): Task[] {
  return tasks.filter((t) => t.dueDate === dateStr && !t.completed);
}

export function getTodayTasks(tasks: Task[]): Task[] {
  return getTasksForDate(tasks, todayISO());
}

export function getOverdueTasks(tasks: Task[]): Task[] {
  const today = todayISO();
  return tasks.filter((t) => t.dueDate < today && !t.completed);
}
