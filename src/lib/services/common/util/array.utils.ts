export function areArraysEqual(arr1, arr2): boolean {
  // Check if both are the same reference
  if (arr1 === arr2) return true;

  // Check for null or undefined arrays
  if (arr1 == null || arr2 == null) return false;

  // Check if the lengths are different
  if (arr1.length !== arr2.length) return false;

  // Iterate through the elements and compare
  for (let i = 0; i < arr1.length; i++) {
    // Use strict equality (===) for element comparison
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  // If all checks pass, the arrays are equal
  return true;
}
