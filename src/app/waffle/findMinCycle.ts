type cycleIndexItem = { target: string, index: number, visited: boolean, source: string }

export const findMinCycle = (source: string, target: string): number[][] => {
  let finalCycles: number[][] = [];
  let finalCyclesInverse: number[][] = [];

  finalCycles = findCycle(source, target);
  finalCyclesInverse = findCycleInverse(source, target);

  return finalCycles.length < finalCyclesInverse.length ? finalCyclesInverse : finalCycles;
};

const findCycle = (source: string, target: string): number[][] => {
  const puzzleLength = source.length;
  const indexMap: cycleIndexItem[] = [];

  for (let i = 0; i < puzzleLength; i++) {
    if (source[i] !== target[i]) {
      indexMap.push({
        target: target[i],
        index: i,
        visited: false,
        source: source[i]
      });
    }
  }

  return generateCycles(
    source,
    target,
    indexMap,
    puzzleLength
  );
};

const findCycleInverse = (source: string, target: string): number[][] => {
  const puzzleLength = source.length;
  const indexMap: cycleIndexItem[] = [];

  for (let i = puzzleLength - 1; i >= 0; i--) {
    if (source[i] !== target[i]) {
      indexMap.push({
        target: target[i],
        index: i,
        visited: false,
        source: source[i]
      });
    }
  }

  return generateCycles(
    source,
    target,
    indexMap,
    puzzleLength
  );
};

const generateCycles = (
  source: string,
  target: string,
  indexMap: {target: string, index: number, visited: boolean, source: string}[],
  puzzleLength: number
): number[][] => {
  const visited = new Array(puzzleLength).fill(false);
  let visitedTemp = new Array(puzzleLength).fill(false);
  const finalCycles: number[][] = [];
  for (let k = 0; k < puzzleLength; k++) {
    const cycles: number[][] = [];
    for (let i = 0; i < puzzleLength; i++) {
      if (source[i] == target[i]) {
        continue;
      }
      if (!visited[i]) {
        let j = i;
        const cycle: number[] = [];
        const key: Record<string, boolean> = {};
        while (!visitedTemp[j] && !key[source[j]]) {
          key[source[j]] = true;
          visitedTemp[j] = true;
          cycle.push(j);
          const next = indexMap.find(
            (element: cycleIndexItem): boolean => element.target == source[j] && !visited[element.index] && !visitedTemp[element.index]
          );
          const looped = indexMap.find(
            (element: cycleIndexItem): boolean => element.target == source[j] && !visited[element.index] && !!visitedTemp[element.index]
          );
          if (looped) {
            j = looped.index;
            cycles[i] = [...cycle];
          } else if (next) {
            j = next.index;
          }
        }
        visitedTemp = new Array(puzzleLength).fill(false);
      }
    }
    let hold: number[] = [];
    cycles.forEach(c => {
      if (hold.length == 0 || c.length < hold.length) {
        hold = [...c];
      }
    });
    hold.forEach(visit => {
      visited[visit] = true;
    });
    if (hold.length) {
      finalCycles.push([...hold]);
    }
  }
  return finalCycles;
};