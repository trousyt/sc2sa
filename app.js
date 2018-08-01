import { express } from 'express';
import log from './src/log';
import config from './config'
import client from './src/client';

const app = express();

const { channels } = config;

/*
 * GET /channel/:name
 * Gets the transformed RSS channel from the SoundCloud playlist.
 */
app.get('/channel/:name', (req, res) => {

  const channelName = req.params.name;

  log.info(`app: feed requested: ${channelName}`);

  // Find the matching channel
  const channel = _.find(channels, (v) => v.name === channelName);

  if (!channel) {
    res.status(400).send(`no channel with name ${channelName}`);
    return;
  }

  const { fn: transformer, options: transformOptions } = channel.transformer;

  // Construct the podcast URL
  // If for whatever reason we can't create the feed we will 
  // simply return the last cached copy (if available)
  // todo: if the cached version hasn't expired, return it instead.
  client.getPlaylistFromSoundcloud(channel.playlistId)
    .then(playlist => client.transformPlaylist(transformer, playlist))
    .then(client.writeChannelXml)
    .then(client.cacheChannelXml)
    .catch(error => {
      log.error(`Failed to perform work: ${error}`);
      // todo: return cached channel XML
    });
});

/*
 * GET /download/:url
 * Downloads an audio file at the given URL.
 */
app.get('/download/:url', (req, res) => {

  const downloadUrl = req.params.url;

 // todo: make a request and pipe the response back to the caller 

  // work.downloadFile(downloadUrl)
  //   .then((scRes) => scRes.pipe(res))
  //   .error(

});


// Start the server
app.listen(3000, () => console.log('listening on port 3000!'));