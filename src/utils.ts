/**
 * A utilities class for static functions.
 */
export default class Utils {

  /**
   * Takes in a notebook and finds all env vars accessed in it.
   * @param notebookStr Raw notebook JSON in string format
   * @returns A string array of the env vars accessed in the given notebook
   */
  static getEnvVars(notebookStr: string): string[] {
    let envVars: string[] = [];
    let notebook = JSON.parse(notebookStr);

    for (let cell of notebook['cells']) {
      if (cell['cell_type'] == 'code') {
        let matchedEnv: string[][] = this.findInCode(cell['source'], /os\.environ\[([^\]]+)\]/);
        for (let match of matchedEnv) {
          envVars.push(match[1].slice(1,-1))
        }
      }
    }

    return [...new Set(envVars)];
  }

  /**
   * Splits code string on new lines and matches each line on the given regex.
   * @param code Multi-line string to match on
   * @param regex Match regex to run on each line of code
   * @returns A 2d string array containing an array of the matched array results
   */
  static findInCode(code: string, regex: RegExp): string[][] {
    let matched: string[][] = [];
    let codeLines = code.split(/\r?\n/);

    for (let codeLine of codeLines) {
      let match = codeLine.match(regex);
      if (match) {
        matched.push(match);
      }
    }

    return matched;
  }

}