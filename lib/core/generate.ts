import glob from "glob";

import { alerts } from "./alerts";
import { MainOptions } from "./types";
import { writeFile } from "./write-file";

/**
 * Given a file glob generate the corresponding types once.
 *
 * @param pattern the file pattern to generate type definitions for
 * @param options the CLI options
 */
export const generate = async (
  pattern: string,
  options: MainOptions
): Promise<void> => {
  // Find all the files that match the provied pattern.
  const files = glob.sync(pattern);

  if (!files || !files.length) {
    alerts.error("No files found.");
    return;
  }

  // This case still works as expected but it's easy to do on accident so
  // provide a (hopefully) helpful warning.
  if (files.length === 1) {
    alerts.warn(
      `Only 1 file found for ${pattern}. If using a glob pattern (eg: dir/**/*.less) make sure to wrap in quotes (eg: "dir/**/*.less").`
    );
  }

  alerts.success(`Found ${files.length} files. Generating type defintions...`);

  // Wait for all the type definitions to be written.
  await Promise.all(files.map(file => writeFile(file, options)));
};
