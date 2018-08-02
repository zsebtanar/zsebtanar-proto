export function singleChoice(
  control: DB.UCSingleChoice,
  solution: DB.UCSingleChoiceSolution,
  userInput: DB.UCSingleChoiceSolution
): boolean {
  return solution === userInput
}
