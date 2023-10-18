
/**
 * Randomized array of questions with a gived id as randomizer seed
 * @param arr 
 * @param id 
 * @returns 
 */

/* eslint-disable @typescript-eslint/no-explicit-any*/
export const prelimRandomizer = (arr: any[], id: string) => {
    let currentIndex = arr.length,  randomIndex;
    const newArr = [...arr];
    const temp: any[] = [];
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArr[currentIndex], newArr[randomIndex]] = [
        newArr[randomIndex], newArr[currentIndex]];
    }

    newArr.forEach((item, index) => {
        temp.push(item);
    });
    return temp;
}