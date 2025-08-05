export interface PersonalityExamData {
  id: string;
  name: string;
  personalityExam: {
    type: string;
    traits: Record<string, number>;
    evaluations: any[],
    strengths: string[];
    growthAreas: string[];
    recommendedRoles: string[];
  };
  programReadiness: Record<string, number>;
}
