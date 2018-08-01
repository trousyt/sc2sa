import _ from 'lodash';
import log from './log';
import util from './util';
import config from '../config';
import SC from './soundcloud';
import XmlWriter from 'xml-writer';

/*
 * Gets tracks from one or more SoundCloud API playlists.
 * Returns a promise.
 */
export function getPlaylistFromSoundCloud(playlistId) {
  log.debug(`getting tracks from playlist: ${playlistId}`);
  return SC.getPlaylist(playlistId);
};

/*
 * Transforms the feed to the expected JSON format using
 * the provided transformer function.
 */
export function transformPlaylist(transformer, playlist) {
  log.debug('transforming playlist');
  transformer.transformPlaylist(playlist);

  // todo: validate schema
};

/*
 * Write the podcast RSS 2.0 XML.
 */
export function writeChannelXml(channel) {
  log.debug('writing channel XML');

  const xmlWriter = new XmlWriter(true);

  xmlWriter.startDocument();
  xmlWriter.startElement('rss') // rss>
    .writeAttributeNS('itunes', 'http://www.itunes.com/dtds/podcast-1.0.dtd')
    .writeAttributeNS('atom', 'http://www.w3.org/2005/Atom')
    .writeAttribute('version', '2.0');

  xmlWriter
    .startElement('channel') // channel>
      .writeElement('title', channel.title)
      .writeElement('link', channel.link)
      .writeElement('language', 'en')
      .writeElement('copyright', `Copyright ${new Date().getFullYear()} ${channel.owner.name}`)
      .writeElement('description', channel.description)
      .startElement('image')
        .writeElement('url', channel.image)
        .writeElement('title', channel.title)
        .writeElement('link', channel.link)
        .endElement()
      .writeElement('pubDate', channel.pubDate)
      .writeElement('lastBuildDate', channel.pubDate)
      .startElementNS('atom:link')
        .writeAttribute('href', channel.link)
        .writeAttribute('rel', 'self')
        .writeAttribute('type', 'application/rss+xml')
        .endElement()

      // Apple podcast elements
      .writeElementNS('itunes:author', channel.owner.name)
      .writeElementNS('itunes:summary', chanl.description)
      .writeElementNS('itunes:subtitle', '') //todo
      .writeElementNS('itunes:type', 'episodic')
      .startElementNS('itunes:owner')
        .writeElementNS('itunes:name', channel.owner.name)
        .writeElementNS('itunes:email', channel.owner.email)
        .endElement()
      .writeElementNS('itunes:keywords', channel.tags)
      .startElementNS('itunes:image')
        .writeAttribute('href', channel.image)
        .endElement()
      .startElementNS('itunes:category')
        .writeAttribute('text', channel.category)
        .endElement();
    
  // item[...]->
  channel.items.forEach((item) => {
    // SA accepts only single-word tags...
    const keywords = item.tags.replace(' ', '-');

    xmlWriter
      .startElement('item')
        .writeElement('guid', item.id)
        .writeElement('title', item.title)
        .writeElement('speaker', item.author)
        .writeElement('pubDate', item.pubDate)
        .writeElement('bibletext', item.verseRef)
        .writeElement('keywords', keywords)
        .writeElement('description', item.description)
        .startElement('enclosure')
          .writeAttribute('url', )
        
        // Apple podcast elements
        .writeElementNS('itunes:episodeType', 'full')
        .writeElementNS('itunes:author', item.author)
        .writeElementNS('itunes:title', item.title)
        .writeElementNS('itunes:subtitle', item.description)
        .writeElementNS('itunes:summary', item.description)
        .writeElementNS('itunes:duration', item.duration)

  });

  return xmlWriter
    .endElement()   // /channel
    .endElement()   // /rss
    .endDocument()
    .toString();
};

/*
 * Persist the Atom XML to disk.
 */
export function cacheChannelXml(xml) {
  log.debug('caching channel XML');
};

/*
 * Downloads a file at the given URL.
 * Returns a promise.
 */
export function downloadFile(downloadUrl) {
  return SC.downloadFile(downloadUrl);
}