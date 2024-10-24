
/**
 * Trims leading whitespace from the input string.
 *
 * @param {string} string - The input string.
 * @returns {string} - The left-trimmed string or an empty string if only whitespace.
 */
export function skipSpace(string) {
    let first = string.search(/\S/);
    if (first == -1) return "";
    return string.slice(first);
  }