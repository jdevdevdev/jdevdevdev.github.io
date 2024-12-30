"use client"
import styles from "./page.module.css";
import { useState, useMemo, useCallback } from 'react';
import { findMinCycle } from "./findMinCycle";
import { RenderGrid } from "./RenderGrid";
import { objectEquals } from "./objectEquals";
import { swap } from "./swap";

type puzzleItem = {
  letter: string,
  index: number,
  swap: boolean,
}

const gridCycleMapping = ["A1", "B1", "C1", "D1", "E1", "A2", "C2", "E2", "A3", "B3", "C3", "D3", "E3", "A4", "C4", "E4", "A5", "B5", "C5", "D5", "E5"]

export default function Waffle() {
  const [puzzle, setPuzzle] = useState<string>('CACIPWTLMNSLERAILTUEE');
  const [solution, setSolution] = useState<string>('CLUMPRNIAISLEWECLATTE');
  const [puzzleState, setPuzzleState] = useState<puzzleItem[]>(
    'CACIPWTLMNSLERAILTUEE'
      .split('')
      .map((letter: string, index: number): puzzleItem => ({
        letter,
        index,
        swap: false,
      }))
  )
  const [cycleIndex, setCycleIndex] = useState<number>(-1);

  const cycles = useMemo(() => {
    const _p = puzzle.split('').reduce(
      (
        previousValue: Record<typeof puzzle[number], number>,
        currentValue: string,
      ): Record<typeof puzzle[number], number> => {
        previousValue[currentValue] = previousValue[currentValue] ?
          previousValue[currentValue] + 1 : 1;
        return previousValue;
      }, {});
    const _s = solution.split('').reduce(
      (
        previousValue: Record<typeof puzzle[number], number>,
        currentValue: string,
      ): Record<typeof puzzle[number], number> => {
        previousValue[currentValue] = previousValue[currentValue] ?
          previousValue[currentValue] + 1 : 1;
        return previousValue;
      }, {});

    if (puzzle.length === 21 && solution.length === 21 && objectEquals(_p, _s)) {
      return findMinCycle(puzzle, solution)
    }
    return [];
  }, [puzzle, solution])

  const cycleSteps = useMemo(() => {
    const result = [];
    for (let i = 0; i < cycles.length; i++) {
      for (let j = 1; j < cycles[i].length; j++) {
        result.push([cycles[i][0], cycles[i][j]]);
      }
    }
    return result;
  }, [cycles])

  const stepCountTracker = useMemo(() => {
    if(cycleIndex < 0) {
      return 0;
    }
    if(cycleIndex >= cycleSteps.length) {
      return cycleSteps.length
    }
    return cycleIndex + 1
  },[cycleIndex, cycleSteps])

  const next = useCallback(() => {
    setPuzzleState(puzzleState.map((item) => { item.swap = false; return item }));
    const nextCycleIndex = cycleIndex + 1;
    if (nextCycleIndex < cycleSteps.length && cycleSteps[nextCycleIndex]) {
      setPuzzleState(swap(puzzleState, cycleSteps[nextCycleIndex]))
    }
    setCycleIndex(nextCycleIndex);
  }, [cycleIndex, puzzleState, cycleSteps])

  const prev = useCallback(() => {
    setPuzzleState(puzzleState.map((item) => { item.swap = false; return item }));
    const nextCycleIndex = cycleIndex - 1;
    if (cycleIndex >= -1 && cycleSteps[cycleIndex]) {
      setPuzzleState(swap(puzzleState, cycleSteps[cycleIndex]))
    }
    setCycleIndex(nextCycleIndex);
  }, [cycleIndex, puzzleState, cycleSteps])

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.waffleInputContainer}>
          <label
            className={styles.waffleInputLabel}
            htmlFor="puzzleInput"
          >
            Puzzle
          </label>
          <input
            id="puzzleInput"
            className={styles.waffleInput}
            value={puzzle}
            onChange={e => {
              setPuzzle(e.target.value);
              setCycleIndex(-1);
              setPuzzleState(
                e.target.value
                  .split('')
                  .map((letter: string, index: number): puzzleItem => ({
                    letter,
                    index,
                    swap: false,
                  }))
              )
            }}
          >
          </input>
          <label
            className={styles.waffleInputLabel}
            htmlFor="solutionInput"
          >
            Solution
          </label>
          <input
            id="solutionInput"
            className={styles.waffleInput}
            value={solution}
            onChange={e => {
              setSolution(e.target.value)
              setCycleIndex(-1);
            }}
          >
          </input>
        </div>

        <div className={styles.boardGrid}>
          <RenderGrid  arr={puzzleState}></RenderGrid>
        </div>

        <div>
          Step: {stepCountTracker} / {cycleSteps.length}
        </div>
        <div className={styles.buttonBox}>
          <button
            disabled={cycleIndex < -1}
            className={styles.nextprevbutton}
            onClick={() => {
              prev();
            }}
          >
            {'<'}
          </button>
          <button
            disabled={cycleIndex >= cycleSteps.length}
            className={styles.nextprevbutton}
            onClick={() => {
              next();
            }}
          >
            {'>'}
          </button>
        </div>

        <div className={styles.steps}>
          {
            cycleSteps.map(
              (item: number[], index: number) =>
                <div
                  key={`step-${index}`}
                  className={`${index === cycleIndex ? styles.selected : ''} ${styles.step}`}
                >
                  {`${gridCycleMapping[item[0]]} - ${gridCycleMapping[item[1]]}`}
                </div>
            )
          }
        </div>
      </main>
    </div>
  )
}
