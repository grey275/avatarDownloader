const request = require('request');
const fs = require('fs');

// const user = 'grey275';
// const repo = 'requestIntro';

const user = 'jquery';
const repo = 'jquery';

const TOKEN = JSON.stringify(fs.ReadStream('./private.json')).github_token
const API_ROOT = 'https://api.github.com';

function getRepoContributors(owner, repo) {
  const options = {
    url: `${API_ROOT}/repos/${owner}/${repo}/contributors`,
    headers: {
      'User-Agent': 'request'
    }
  }

  console.log(`url: ${options.url})`);

  request(options, (err, response, body) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`body: ${body}`);
  });
}

getRepoContributors(user, repo);


