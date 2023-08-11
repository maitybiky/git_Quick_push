#!/usr/bin/env node
const { spawn } = require("child_process");
const path  = require("path");
const { frames } = require("./animationframes.js");
const fs = require('fs');
const directoryPath = process.cwd();
//!? handling command argument
const args = process.argv.slice(2);
const commit_message = args[0];
const brach_name = args[1];
const files = args.slice(2);
const command_name = "git";

//? if neccessery argument provided then continue
if (args.length >= 3) {
  fs.readdir(directoryPath, (err, f) => {
    if (err) {
      console.error("Error reading directory:", err);
    }
    programIntro(f);
  });
  
  gitAdd();
} else {
  console.log(
    changeTextColor("Please provide all three necessary arguments: ", 33)
  );
  console.warn(
    changeTextColor(
      "gitup <commit_message_inside_''> <brach_name> <files)>",
      32
    )
  );
  console.info("Example:  gitup 'design completed..' main .");
}

//!? program intro in terminal

function programIntro(currentfiles) {
  console.log(changeTextColor(`Files to be tracked: `,35));
  if (args[2] == ".") {
   
    currentfiles.forEach(element => {
      console.log(changeTextColor(element,36));
    });
  
  } else {
    console.table(files);
  }
  console.log(changeTextColor(`Commit message    : ${commit_message}`,35));
  console.log(changeTextColor(`Brach name        : ${brach_name}`,35));
  console.log("");

  console.log("");
}

//!? Tracking Changes
function gitAdd() {
  const git_add = spawn(command_name, ["add", ...files]);
  handle_child_process(git_add, (callback) => {
    console.log(changeTextColor("Changes tracked", 32));
    commit();
  });
}

//!? Commiting Changes
const commit = () => {
  const git_commit = spawn(command_name, ["commit", "-m", commit_message]);

  handle_child_process(git_commit, (callback) => {
    if (!callback) {
      console.log(changeTextColor("Changes Committed!", 32));
      push();
    } else {
      console.log(
        changeTextColor(`Work tree clean in ${path.basename(directoryPath)}`, 33)
      );
    }
  });
};

//!? Push Commit

const push = () => {
  const loadingAnimation = showLoadingAnimation();
  console.log("");
  const git_push = spawn(command_name, ["push", "origin", brach_name]);
  handle_child_process(git_push, (callback) => {
    stopLoading(loadingAnimation);
    if (!callback)
      console.log(changeTextColor(`Changes pushed to ${brach_name}`, 32));
  });
};

//!? Handling child process

function handle_child_process(child, callback) {
  // listens for the standard output (stdout) of the child process
  let ERR_CODE = false;
  child.stdout.on("data", (data) => {
    if (data.includes("working tree clean")) ERR_CODE = true;
    console.log(`${data}`);
  });

  // listens for the standard error (stderr) of the child process
  child.stderr.on("data", (data) => {
    console.error(`
: ${data}`);
    callback(true);
  });

  // Listen for 'error' event from the child process
  child.on("error", (error) => {
    console.error(`git error: ${error}`);
    callback(true);
  });

  // Listen for 'close' event from the child process
  child.on("close", (code) => {
    // console.log(`Child process exited with code ${code}`);
    callback(ERR_CODE);
  });
}

//!? Loading
function showLoadingAnimation() {
  // const frames = [`(-(-_(-_-)_-)-)`, `-(_(-_(-)_-)_)-`];
  // const frames=["+","x"]

  let currentFrameIndex = 0;

  const animation = setInterval(() => {
    process.stdout.clearLine(); // Clear the current line
    process.stdout.cursorTo(0); // Move cursor to beginning of line
    process.stdout.write(
      changeTextColor(
        `Pushing... to ${brach_name}      ${frames[currentFrameIndex]}`,
        getRandomInt(35, 36)
      )
    );

    currentFrameIndex = (currentFrameIndex + 1) % frames.length;
  }, 150);

  return animation; // Return the interval ID so you can clear it later
}

// Simulate loading for 5 seconds
function stopLoading(loadingAnimation) {
  clearInterval(loadingAnimation); // Clear the animation interval
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
}
//!Extraa
function changeTextColor(text, colorCode) {
  return `\x1b[${colorCode}m${text}\x1b[0m`; // Reset color after the text
}

function getRandomInt(a, b) {
  const min = Math.ceil(a);
  const max = Math.floor(b);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
