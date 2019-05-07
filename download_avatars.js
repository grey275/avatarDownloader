const request = require('request');
const fs = require('fs');
const private = require('./private.json');

const API_ROOT = 'https://api.github.com';


// static configuration options
const config = {
  github_token: private.new_token,
  // images go into here
  image_dirname: 'avatars',
  image_file_extension: '.jpeg',

  // some base request options to be added to for a request
  request_options: {
    headers: {
      'User-Agent': 'request',
      Authorization: 'Bearer ' + config.github_token,
    }
  },
};


/**
 * passes an array of repo contributor objects
 * to the callback (cb)
 *
 * @param  {} owner
 * @param  {} repo
 * @param  {} cb callback
 */
function getRepoContributors(owner, repo, cb) {
  const options = {
    ...config.request_options,
    url: `${API_ROOT}/repos/${owner}/${repo}/contributors`,
  }

  console.log('fetching urls from ' + options.url);
  request(options, (err, _, body) => {
    if (err) {
      console.log(`ERROR: ` + err);
      return;
    }
    console.log('downloaded urls!')
    cb(JSON.parse(body));
  });
}


/**
 * Extracts the avatar_url element from each
 * contributor in the request body * and returns
 * them as an array.
 *
 * @param  {array} body
 */
function getContributorAvatarURLs(body) {
  return body.map((contributor) => contributor.avatar_url);
}


/**
 * Downloads an image at a url to the specified path.
 *
 * @param  {string} url
 * @param  {string} filePath
 */
function downloadImageByURL(url, filePath) {
  const options = {
    ...config.request_options,
    url: url
  };
  request
    .get(options)
    .pipe(fs.createWriteStream(filePath));
}


/**
 * Gets the contributors urls and downloads them all to paths based on their
 * index in the resulting array.
 *
 * @param {array}  body  body object from http request from the selected repo
 *
 */
function downloadContributorAvatars(body) {
  const urls = getContributorAvatarURLs(body);
  console.log('getting urls from')

  // make avatar dir if it doesn't exist
  if (!fs.existsSync(config.image_dirname)) {
    fs.mkdirSync(config.image_dirname);
  }

  urls.forEach((url, index) => {


    // repo is passed from global scope here
    const filePath = `${config.image_dirname}/${repo}_${index}.${config.image_file_extension}`;
    console.log(`downloading to ${filePath}`);
    downloadImageByURL(url, filePath);
  })
  console.log('downloads complete!');
}


/* -- execution start -- */

const [owner, repo] = process.argv.slice(2);

// validate input and if everything checks out download the files
if (!(owner && repo)) {
  console.log('ERROR: invalid arguments.');
  console.log('Structure: [owner, repo]');
} else {
  // run the rest of the program
  getRepoContributors(owner, repo, downloadContributorAvatars);
}