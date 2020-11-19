export function makeArray(n: number): number[] {
  let arr = [];
  for (let k = 1; k <= n; k++) {
    arr.push(k);
  }
  return arr;
}
