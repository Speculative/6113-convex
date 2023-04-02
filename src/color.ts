const INT32_MAX = Math.pow(2, 31) - 1;
// https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
function hashStringToRatio(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  console.log(hash);

  return hash / INT32_MAX;
}

// https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
const GOLDEN_RATIO_CONJUGATE = 2 / (Math.sqrt(5) + 1);
export function generateColors(n: number, seed?: string): string[] {
  const colors = [];
  let num = (seed && hashStringToRatio(seed)) || Math.random();
  for (let i = 0; i < n; i++) {
    num = (num + GOLDEN_RATIO_CONJUGATE) % 1;
    colors[i] = `hsl(${num * 360} 99% 50%)`;
  }
  return colors;
}
