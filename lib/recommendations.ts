import type { Plant, LandAssessment } from "@/types";

export interface PlantScore {
  plant: Plant;
  score: number;
  reasons: string[];
}

export function scorePlant(plant: Plant, assessment: LandAssessment): PlantScore {
  let score = 0;
  const reasons: string[] = [];

  // Light match (weight: 40)
  if (plant.lightRequirement === assessment.sunlight) {
    score += 40;
    reasons.push("Cocok dengan kondisi cahaya kamu");
  } else if (
    (plant.lightRequirement === "partial" && assessment.sunlight === "full") ||
    (plant.lightRequirement === "partial" && assessment.sunlight === "shade")
  ) {
    score += 20;
    reasons.push("Cahaya cukup sesuai");
  } else {
    score += 5;
  }

  // Space match (weight: 25)
  const areaPerCellCm = assessment.areaSqm * 10000;
  if (plant.spacingCm * plant.spacingCm <= areaPerCellCm / 4) {
    score += 25;
    reasons.push("Ruang kamu cukup untuk tanaman ini");
  } else if (plant.spacingCm <= 25) {
    score += 15;
    reasons.push("Bisa muat di area yang kamu miliki");
  } else {
    score += 5;
  }

  // Experience match (weight: 20)
  const expMap = { pemula: 1, menengah: 3, berpengalaman: 5 };
  const expScore = expMap[assessment.experienceLevel];
  if (plant.difficulty <= expScore) {
    score += 20;
    reasons.push("Sesuai dengan level pengalamanmu");
  } else if (plant.difficulty === expScore + 1) {
    score += 10;
    reasons.push("Sedikit menantang tapi bisa dicoba");
  } else {
    score += 0;
  }

  // Category match with goals (weight: 15)
  if (assessment.goals.includes(plant.category as "sayur" | "buah" | "herbal" | "hias")) {
    score += 15;
    reasons.push(`Sesuai dengan tujuanmu: ${plant.category}`);
  }

  // Space type bonus
  if (assessment.spaceType === "indoor" && plant.lightRequirement === "shade") {
    score += 5;
    reasons.push("Cocok untuk indoor");
  }
  if (assessment.spaceType === "balkon" && plant.spacingCm <= 30) {
    score += 3;
  }

  return { plant, score: Math.min(Math.round(score), 100), reasons };
}

export function getRecommendations(
  plants: Plant[],
  assessment: LandAssessment,
  limit = 20
): PlantScore[] {
  return plants
    .map((p) => scorePlant(p, assessment))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
