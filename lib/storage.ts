import type {
  User,
  Layout,
  PlantInGarden,
  Task,
  JournalEntry,
} from "@/types";

const KEYS = {
  USERS: "ecopath_users",
  ACTIVE_USER: "ecopath_active_user",
  LAYOUTS: "ecopath_layouts",
  PLANTS_IN_GARDEN: "ecopath_plants_in_garden",
  TASKS: "ecopath_tasks",
  JOURNAL: "ecopath_journal",
  COMPLETED_TASKS: "ecopath_completed_tasks",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function get<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

// ── Users ──────────────────────────────────────────────────────────────────

export function getUsers(): User[] {
  return get<User[]>(KEYS.USERS) ?? [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  set(KEYS.USERS, users);
}

export function getUserByEmail(email: string): User | null {
  return getUsers().find((u) => u.email === email) ?? null;
}

export function getActiveUser(): User | null {
  const id = get<string>(KEYS.ACTIVE_USER);
  if (!id) return null;
  return getUsers().find((u) => u.id === id) ?? null;
}

export function setActiveUser(userId: string): void {
  set(KEYS.ACTIVE_USER, userId);
}

export function clearActiveUser(): void {
  if (isBrowser()) localStorage.removeItem(KEYS.ACTIVE_USER);
}

export function deleteAccount(userId: string): void {
  const users = getUsers().filter((u) => u.id !== userId);
  set(KEYS.USERS, users);
  clearActiveUser();
  // Clear user-specific data
  const layouts = getLayouts().filter((l) => l.userId !== userId);
  set(KEYS.LAYOUTS, layouts);
  const pigs = getPlantsInGarden().filter((p) => p.userId !== userId);
  set(KEYS.PLANTS_IN_GARDEN, pigs);
  const tasks = getTasks().filter((t) => t.userId !== userId);
  set(KEYS.TASKS, tasks);
  const journal = getJournalEntries().filter((j) => j.userId !== userId);
  set(KEYS.JOURNAL, journal);
}

// ── Layouts ────────────────────────────────────────────────────────────────

export function getLayouts(userId?: string): Layout[] {
  const all = get<Layout[]>(KEYS.LAYOUTS) ?? [];
  return userId ? all.filter((l) => l.userId === userId) : all;
}

export function getLayout(id: string): Layout | null {
  return getLayouts().find((l) => l.id === id) ?? null;
}

export function saveLayout(layout: Layout): void {
  const all = getLayouts();
  const idx = all.findIndex((l) => l.id === layout.id);
  if (idx >= 0) all[idx] = layout;
  else all.push(layout);
  set(KEYS.LAYOUTS, all);
}

export function deleteLayout(id: string): void {
  const all = getLayouts().filter((l) => l.id !== id);
  set(KEYS.LAYOUTS, all);
}

// ── Plants in Garden ───────────────────────────────────────────────────────

export function getPlantsInGarden(userId?: string): PlantInGarden[] {
  const all = get<PlantInGarden[]>(KEYS.PLANTS_IN_GARDEN) ?? [];
  return userId ? all.filter((p) => p.userId === userId) : all;
}

export function getPlantInGarden(id: string): PlantInGarden | null {
  return getPlantsInGarden().find((p) => p.id === id) ?? null;
}

export function savePlantInGarden(pig: PlantInGarden): void {
  const all = getPlantsInGarden();
  const idx = all.findIndex((p) => p.id === pig.id);
  if (idx >= 0) all[idx] = pig;
  else all.push(pig);
  set(KEYS.PLANTS_IN_GARDEN, all);
}

export function removePlantFromGarden(id: string): void {
  const all = getPlantsInGarden().filter((p) => p.id !== id);
  set(KEYS.PLANTS_IN_GARDEN, all);
}

// ── Tasks ──────────────────────────────────────────────────────────────────

export function getTasks(userId?: string): Task[] {
  const all = get<Task[]>(KEYS.TASKS) ?? [];
  return userId ? all.filter((t) => t.userId === userId) : all;
}

export function saveTask(task: Task): void {
  const all = getTasks();
  const idx = all.findIndex((t) => t.id === task.id);
  if (idx >= 0) all[idx] = task;
  else all.push(task);
  set(KEYS.TASKS, all);
}

export function saveTasks(tasks: Task[]): void {
  set(KEYS.TASKS, tasks);
}

export function deleteTask(id: string): void {
  const all = getTasks().filter((t) => t.id !== id);
  set(KEYS.TASKS, all);
}

export function deleteTasksByPlantInGarden(pigId: string): void {
  const all = getTasks().filter((t) => t.plantInGardenId !== pigId);
  set(KEYS.TASKS, all);
}

// ── Journal ────────────────────────────────────────────────────────────────

export function getJournalEntries(userId?: string): JournalEntry[] {
  const all = get<JournalEntry[]>(KEYS.JOURNAL) ?? [];
  return userId ? all.filter((j) => j.userId === userId) : all;
}

export function saveJournalEntry(entry: JournalEntry): void {
  const all = getJournalEntries();
  const idx = all.findIndex((j) => j.id === entry.id);
  if (idx >= 0) all[idx] = entry;
  else all.push(entry);
  set(KEYS.JOURNAL, all);
}

export function deleteJournalEntry(id: string): void {
  const all = getJournalEntries().filter((j) => j.id !== id);
  set(KEYS.JOURNAL, all);
}
