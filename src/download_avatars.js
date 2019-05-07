const request = require('request');
const fs = require('fs');
const private = require('../private.json');

const [owner, repo] = process.argv.slice(2) || ['jquery', 'jquery'];

const TOKEN = private.new_token;
const API_ROOT = 'https://api.github.com';

const request_options = {
  headers: {
    'User-Agent': 'request',
    Authorization: 'Bearer ' + TOKEN,
  }
};

function getRepoContributors(owner, repo, cb) {
  console.log(TOKEN)
  const options = {
    ...request_options,
    url: `${API_ROOT}/repos/${owner}/${repo}/contributors`,
  }

  console.log(`url: ${options.url})`);

  request(options, (err, response, body) => {
    if (err) {
      console.log(err);
      return
    }
    return cb(JSON.parse(body));
  });
}

function getContributorAvatarURLs(body) {
  return body.map((contributor) => contributor.avatar_url );
}

function downloadImageByURL(url, filePath) {
    const options = {
      ...request_options,
      url: url
    };
    request
      .get(options)
      .pipe(fs.createWriteStream(filePath));
}

function downloadContributorAvatars(body) {
  const urls = getContributorAvatarURLs(body);
  urls.forEach((url, index) => {
    downloadImageByURL(url, `${repo}_${index}.jpeg`);
  })
}
if (!(owner && repo)) {
  console.log('ERROR: invalid arguments.');
  console.log('Structure: [owner, repo]');
} else {
  console.log(`owner: ${owner}, repo: ${repo}`);
  getRepoContributors(owner, repo, downloadContributorAvatars);
}