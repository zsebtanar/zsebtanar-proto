export function singleNumber(
  control: DB.UCSingleNumber,
  solution: DB.UCSingleNumberSolution,
  userInput: DB.UCSingleNumberSolution
): boolean {
  return solution === userInput
}
