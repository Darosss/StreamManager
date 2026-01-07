import { Tag, Mood } from "@models";

export const createTestTag = async (name: string) => await Tag.create({ name });
export const createTestMood = async (name: string) => await Mood.create({ name });

export const clearTagsAndMoodsTables = async () => {
  await Tag.deleteMany({});
  await Mood.deleteMany({});
};

export const createTestTagAndMood = async (tagName = "test tag", moodName = "test mood") => {
  const tag = await Tag.create({ name: tagName });
  const mood = await Mood.create({ name: moodName });
  return { tag, mood };
};
