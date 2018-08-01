import log from './log';
import https from 'https';
import config from '../config';

const { clientId } = config.soundCloud;

const SCAPI_BASEURL = 'https://api.soundcloud.com';

function readBody(res) {
  return new Promise((resolve, reject) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      resolve(body);
    });
  });
};

/*
 * Gets playlist JSON from the SC API.
 */
export function getPlaylist(playlistId) {
  const url = `${SCAPI_BASEURL}/playlists/${playlistId}?client_id=${clientId}`;

  return new Promise((resolve, reject) => {
    return https.get(url, (res) => {
      resolve(readBody(res));
    }).on('error', (e) => reject(e));
  });
};

/*
 * Initiates a request to a SC file and returns the response.
 */
export function downloadFile(downloadUrl) {
  const url = `${downloadUrl}?client_id=${clientId}`;

  return new Promise((resolve, reject) => {
    return https.get(url, (res) => {
      resolve(res);
    }).on('error', () => reject(e));
  });
};