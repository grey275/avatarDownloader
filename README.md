# GitHub Avatar Downloader

## Problem Statement

Given a GitHub repository name and owner, download all the contributors' profile images and save them to a subdirectory, `avatars/`.

## Expected Usage

This program should be executed from the command line, in the following manner:

`node download_avatars.js jquery jquery`


## setup
This project requires a personal access token from your github account.

Aquire one via [these instructions]( https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line ).

Install only dependency ([request](https://www.npmjs.com/package/request)):
```
npm install
```

Then, copy private_template.json to private.json and add your token.

Enjoy!