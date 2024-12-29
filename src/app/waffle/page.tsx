"use client"
import styles from "./page.module.css";
import Cell from "./cell";
import { useState, useMemo, useCallback, PropsWithChildren } from 'react';
import { findMinCycle } from "./findMinCycle";

type puzzleItem = {
  letter: string,
  index: number,
  swap: boolean,
}

const gridCycleMapping = ["A1", "B1", "C1", "D1", "E1", "A2", "C2", "E2", "A3", "B3", "C3", "D3", "E3", "A4", "C4", "E4", "A5", "B5", "C5", "D5", "E5"]

const objectEquals = <T extends object>(obj1: T, obj2: T): boolean => {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
      if (!objectEquals(val1, val2)) return false;
    } else if (val1 !== val2) {
      return false;
    }
  }

  return true;
}
const RenderRows = ({ children }: PropsWithChildren) => {
  return <div className={styles.boardRow}>{children}</div>;
}

const splitArray = (arr: puzzleItem[]) => {
  const result = [];
  let index = 0;
  const _arr = arr.length < 21 ? [...arr, ...Array(21 - arr.length).fill({ letter: '', index: 99, swap: false })] : arr.slice(0, 21);

  while (index < _arr.length) {
    if (result.length % 2 === 0) {
      result.push(
        <RenderRows key={`row-${index}`}>
          {_arr.slice(index, index + 5)
            .map(
              (item: puzzleItem, index: number) =>
                <Cell key={`cell-${index}`} swapped={item.swap}>
                  {item.letter}
                </Cell>
            )
          }
        </RenderRows>
      );
      index += 5;
    } else {
      result.push(
        <RenderRows key={`row-${index}`}>
          {_arr.slice(index, index + 3)
            .map(
              (item: puzzleItem, index: number) =>
                <Cell key={`cell-${index}`} swapped={item.swap}>
                  {item.letter}
                </Cell>
            )
          }
        </RenderRows>
      );
      index += 3;
    }
  }
  return result;
}

const swap = (puzzleState: puzzleItem[], swapStep: number[]): puzzleItem[] => {
  const _puzzleState = [...puzzleState];
  const temp = _puzzleState[swapStep[0]];
  _puzzleState[swapStep[0]] = _puzzleState[swapStep[1]];
  _puzzleState[swapStep[1]] = temp;
  _puzzleState[swapStep[0]].swap = true;
  _puzzleState[swapStep[1]].swap = true;
  return _puzzleState;
}

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

  const next = useCallback(() => {
    const nextCycleIndex = cycleIndex + 1;
    if (nextCycleIndex < cycleSteps.length) {
      setPuzzleState(puzzleState.map((item) => { item.swap = false; return item }));
      setCycleIndex(nextCycleIndex);
      setPuzzleState(swap(puzzleState, cycleSteps[nextCycleIndex]))
    }
  }, [cycleIndex, puzzleState, cycleSteps])

  const prev = useCallback(() => {
    const nextCycleIndex = cycleIndex - 1;
    if (nextCycleIndex >= 0) {
      setPuzzleState(puzzleState.map((item) => { item.swap = false; return item }));
      setPuzzleState(swap(puzzleState, cycleSteps[nextCycleIndex]))
      setCycleIndex(nextCycleIndex);
    }
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
          {splitArray(puzzleState)}
        </div>

        <div>
          Step: {cycleIndex < 0 ? 0 : cycleIndex + 1} / {cycleSteps.length}
        </div>
        <div className={styles.buttonBox}>
          <button
            disabled={cycleIndex <= 0}
            className={styles.nextprevbutton}
            onClick={() => {
              prev();
            }}
          >
            {'<'}
          </button>
          <button
            disabled={cycleIndex >= cycleSteps.length - 1}
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
