export const swap = <T extends {swap: boolean}>(puzzleState: T[], swapStep: number[]): T[] => {
  const _puzzleState : T[] = [...puzzleState];
  const temp = _puzzleState[swapStep[0]];
  _puzzleState[swapStep[0]] = _puzzleState[swapStep[1]];
  _puzzleState[swapStep[1]] = temp;
  _puzzleState[swapStep[0]].swap = true;
  _puzzleState[swapStep[1]].swap = true;
  return _puzzleState;
};
