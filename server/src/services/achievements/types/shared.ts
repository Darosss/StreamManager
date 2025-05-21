export interface UpdateAchievementUserProgressProgressesArgs {
  achievementName: string;
  userId: string;
  progress: { increment?: boolean; value: number };
}
