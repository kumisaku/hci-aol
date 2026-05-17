export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  city: string;
  avatar?: string;
  createdAt: string;
  assessment?: LandAssessment;
  notifications?: NotificationPreferences;
  language?: "id" | "en";
  theme?: "light" | "dark" | "system";
  onboardingCompleted?: boolean;
}

export interface LandAssessment {
  spaceType: "balkon" | "teras" | "halaman" | "indoor";
  sunlight: "full" | "partial" | "shade";
  areaSqm: number;
  experienceLevel: "pemula" | "menengah" | "berpengalaman";
  goals: ("sayur" | "buah" | "herbal" | "hias")[];
  climate?: string;
}

export interface NotificationPreferences {
  watering: boolean;
  fertilizing: boolean;
  harvest: boolean;
  tips: boolean;
}

export interface Plant {
  id: string;
  name: string;
  latinName: string;
  category: "sayur" | "buah" | "herbal" | "hias";
  lightRequirement: "full" | "partial" | "shade";
  waterFrequency: number;
  spacingCm: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  timeToHarvestDays: number;
  imageUrl: string;
  images?: string[];
  description: string;
  plantingSteps: string[];
  careInstructions: {
    watering: string;
    fertilizing: string;
    pruning?: string;
    harvesting?: string;
  };
  companionPlants: string[];
  commonProblems: {
    problem: string;
    solution: string;
  }[];
  videoTutorials?: string[];
  season?: string;
  popular?: boolean;
}

export interface Layout {
  id: string;
  userId: string;
  name: string;
  spaceType: string;
  widthM: number;
  heightM: number;
  cellSizeCm: number;
  plants: PlacedPlant[];
  sunZones: SunZone[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlacedPlant {
  id: string;
  plantId: string;
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
}

export interface SunZone {
  col: number;
  row: number;
  type: "sunny" | "partial" | "shaded";
}

export interface PlantInGarden {
  id: string;
  userId: string;
  plantId: string;
  plantingDate: string;
  notes?: string;
  growthStage: "seedling" | "growing" | "mature" | "harvesting" | "done";
  layoutId?: string;
}

export interface Task {
  id: string;
  userId: string;
  plantInGardenId: string;
  plantId: string;
  type: "water" | "fertilize" | "prune" | "harvest" | "repot";
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  snoozed?: boolean;
}

export interface Article {
  id: string;
  slug: string;
  type: "article" | "video";
  title: string;
  excerpt: string;
  content?: string;
  coverImage: string;
  author?: string;
  readTime?: number;
  duration?: string;
  youtubeId?: string;
  category: "pemula" | "penyiraman" | "pupuk-tanah" | "hama-penyakit" | "panen" | "umum";
  tags: string[];
  publishedAt: string;
  featured?: boolean;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  plantInGardenId?: string;
  plantId?: string;
  photo?: string;
  notes: string;
  mood?: "great" | "good" | "okay" | "bad";
  createdAt: string;
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  icon: string;
}

export type Language = "id" | "en";
export type Theme = "light" | "dark" | "system";
