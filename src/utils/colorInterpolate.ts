type RGBData = {
  r: number;
  g: number;
  b: number;
};

// https://stackoverflow.com/a/28056903
function hexToRGB(hex: string): RGBData {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// https://stackoverflow.com/a/5624139
function RGBToHex(r: number, g: number, b: number): string {
  const componentToHex = (c: number) => {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// https://stackoverflow.com/a/66124172
export default function colorInterpolate(
  colorA: string,
  colorB: string,
  intval: number
): string {
  const rgbA = hexToRGB(colorA),
    rgbB = hexToRGB(colorB);
  const colorVal = (prop: string) =>
    Math.round(
      rgbA[prop as keyof RGBData] * (1 - intval) +
        rgbB[prop as keyof RGBData] * intval
    );
  return RGBToHex(colorVal("r"), colorVal("g"), colorVal("b"));
}
