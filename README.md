
# gytfast

A hassle-free npm module for automating Git directory tracking, committing changes, and pushing to your remote repository with a single, simple command

## Installation

Install my-project with npm

```bash
  npm install -g gytfast
 
```
    
## Usage

```bash
  gytfast "commit-message" branch-name files-name
 
```

## Process

- git add files-name
- git commit -m commit-message
- git push origin branch-name
## Example
```bash
  gytfast "initial commit" main . 
 
```

