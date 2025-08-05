export interface VisionBoardData {
  id: string;
  name: string;
  visionBoard: {
    goals: string[];
    focusAreas: string[];
    keywords: string[];
    journalEntries: Array<{ date: string; content: string }>;
  };
  programReadiness: Record<string, number>;
  relatedSkills: Array<{ skill: string; count: number }>;
  coverUrl: string | null;
}
