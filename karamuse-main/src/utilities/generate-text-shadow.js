export default function generateTextShadow(width = 0, color = "white", blur = 0) {
  if (typeof width === "number") width = [width, width, width, width];
  return `-${width[0]}em -${width[0]}em ${blur}em ${color}, ${width[1]}em -${width[1]}em ${blur}em ${color}, ${width[2]}em ${width[2]}em ${blur}em ${color}, -${width[3]}em ${width[3]}em ${blur}em ${color}`;
}

export const generateLyricsTextShadow = (width, color) => {
  width /= 100;
  return generateTextShadow(width, color);
};
