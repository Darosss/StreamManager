import { BadgeModelImagesUrlsSizes } from "@models";

export const SEPARATOR_BADGE_IMAGE_SIZE = `-xSize-`;
export const badgeModelIMagesUrlsSizesNumbers = Object.values(BadgeModelImagesUrlsSizes).filter(Number) as number[];
