/**
 * Randomized array of questions with a gived id as randomizer seed
 * @param arr
 * @param id
 * @returns
 */


export const prelimRandomizer = <T>(arr: T[], id: string) => {
  let currentIndex = arr.length,
    randomIndex;

  const newArr = [...arr];
  const temp: T[] = [];
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArr[currentIndex], newArr[randomIndex]] = [
      newArr[randomIndex] as T,
      newArr[currentIndex] as T,
    ];
  }

  newArr.forEach((item, index) => {
    temp.push(item);
  });
  return temp;
};
