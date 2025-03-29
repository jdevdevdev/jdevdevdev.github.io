import { expect, test, describe } from "vitest";
import decompress from "brotli/decompress";
import { findMinCycle } from "@/app/waffle/findMinCycle";
import archive from "@/artifacts/archive.json";

const transpose = (cycles: number[][]) => {
  const result = [];
  for (let i = 0; i < cycles.length; i++) {
    for (let j = 1; j < cycles[i].length; j++) {
      result.push([cycles[i][0], cycles[i][j]]);
    }
  }
  return result;
};

function swapLetters(str: string, index1: number, index2: number): string {
  const charArray = str.split("");

  if (index1 < 0 || index1 >= charArray.length || index2 < 0 || index2 >= charArray.length) {
    throw new Error("Indexes are out of bounds");
  }

  const temp = charArray[index1];
  charArray[index1] = charArray[index2];
  charArray[index2] = temp;

  return charArray.join("");
}

describe("findMinCycle", () => {
  const keys = Object.keys(archive);

  keys.map((key, index) => {
    const cypher: string = archive[key as keyof typeof archive];
    const decodedItem = decompress(Buffer.from(cypher, "base64"));
    const archiveItem = JSON.parse(new TextDecoder().decode(decodedItem));
    let puzzle = archiveItem.puzzle;
    const solution = archiveItem.solution;

    const cycles = findMinCycle(puzzle, solution);
    const steps = transpose(cycles);
    steps.forEach((step) => {
      puzzle = swapLetters(puzzle, step[0], step[1]);
    });
    test(`produces correct number of steps ${index} ${archiveItem.puzzle} ${solution}`, () => {
      expect(steps.length).toEqual(10);
    });
    test("produces the solution", () => {
      expect(puzzle).toEqual(solution);
    });
  });
});
