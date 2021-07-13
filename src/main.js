import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import { projectInstall } from "pkg-install";

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || '/Users/juli.arnalot/Desktop/projects/create-cli/newProject',
  };
  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    "../../templates",
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  try {
    console.log("templateDir", templateDir);
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error("%s Invalid template name", err);
    process.exit(1);
  }

  console.log("Copy project files");
  await copyTemplateFiles(options);

  const { stdout } = await projectInstall({
    cwd: options.targetDirectory,
  });
  console.log(stdout);

  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}
