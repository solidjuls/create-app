import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
const { execSync } = require("child_process");

const access = promisify(fs.access);
const copy = promisify(ncp);
const DEFAULT_TARGET_DIRECTORY =
  "/Users/juli.arnalot/Desktop/projects/create-cli/newProject";

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

function getTemplateDirectory(template) {
  const currentFileUrl = import.meta.url;
  return path.resolve(
    new URL(currentFileUrl).pathname,
    "../../templates",
    template
  );
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || DEFAULT_TARGET_DIRECTORY,
  };

  options.templateDirectory = getTemplateDirectory(
    options.template.toLowerCase()
  );

  try {
    await access(options.templateDirectory, fs.constants.R_OK);
  } catch (err) {
    console.error("%s Invalid template name", err);
    process.exit(1);
  }

  await copyTemplateFiles(options);

  const res = execSync("yarn", {
    cwd: options.targetDirectory,
  });
  console.log(res.toString("utf-8").trim());
  // const { stdout } = await projectInstall({
  //   cwd: options.targetDirectory,
  // });
  // console.log(stdout);

  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}
