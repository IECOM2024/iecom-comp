/*
 *  Get an array of n elements choosen from arr
 */
export function arrayRandomPicker<T>(arr: T[], n: number) {
  if (arr.length < n) {
    return arr;
  }

  const newArr = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(Math.random() * arr.length);
    newArr.push(arr[r]);
    arr.splice(r, 1);
  }
  return newArr;
}
