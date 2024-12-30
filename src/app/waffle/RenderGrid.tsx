import { Cell } from "./Cell";
import { RenderRow } from "./RenderRow"

type puzzleItem = {
    letter: string,
    index: number,
    swap: boolean,
}

export const RenderGrid = ({ arr } : { arr : puzzleItem[]}) => {
  const result = [];
  let index = 0;
  const _arr = arr.length < 21 ? [...arr, ...Array(21 - arr.length).fill({ letter: '', index: 99, swap: false })] : arr.slice(0, 21);

  while (index < _arr.length) {
    if (result.length % 2 === 0) {
      result.push(
        <RenderRow key={`row-${index}`}>
          {_arr.slice(index, index + 5)
            .map(
              (item: puzzleItem, index: number) =>
                <Cell key={`cell-${index}`} swapped={item.swap}>
                  {item.letter}
                </Cell>
            )
          }
        </RenderRow>
      );
      index += 5;
    } else {
      result.push(
        <RenderRow key={`row-${index}`}>
          {_arr.slice(index, index + 3)
            .map(
              (item: puzzleItem, index: number) =>
                <Cell key={`cell-${index}`} swapped={item.swap}>
                  {item.letter}
                </Cell>
            )
          }
        </RenderRow>
      );
      index += 3;
    }
  }
  return result;
}