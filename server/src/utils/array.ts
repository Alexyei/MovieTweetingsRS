export function combinations<T>(array:T[], n:number):T[][] {
    if (n === 0) {
      return [[]];
    }
    
    if (array.length === 0 || n > array.length) {
      return [];
    }
    
    const [first, ...rest] = array;
    const combinationsWithoutFirst = combinations(rest, n);
    const combinationsWithFirst = combinations(rest, n - 1).map((combination:T[]) => [first, ...combination]);
    
    return [...combinationsWithoutFirst, ...combinationsWithFirst];
  }