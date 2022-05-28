// https://stackoverflow.com/a/28056903
function hexToRGB(hex) {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// https://stackoverflow.com/a/5624139
function RGBToHex(r, g, b) {
  const componentToHex = (c) => {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// https://stackoverflow.com/a/66124172
export default function colorInterpolate(colorA, colorB, intval) {
  const rgbA = hexToRGB(colorA),
    rgbB = hexToRGB(colorB);
  const colorVal = (prop) =>
    Math.round(rgbA[prop] * (1 - intval) + rgbB[prop] * intval);
  return RGBToHex(colorVal("r"), colorVal("b"), colorVal("g"));
}
