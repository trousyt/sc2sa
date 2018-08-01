import _ from 'lodash';
import log from './log';
import util from './util';

/*
 * Transforms the data from an SMPC SoundCloud track.
 */
export default function transformPlaylist(playlist, options) {

  const { overrides } = options;
  const { owner, category, link } = overrides;

  // todo: apply overrides directly to playlist?

  const tagArray = util.splitTagList(playlist.tag_list),
        tagString = tagArray.join(',');

  let transform = {
    channel: {
      id: overrides.id,
      title: playlist.title,
      description: playlist.description,
      link: link,
      category: category,
      author: owner.name,
      tags: tagString,
      image: playlist.artwork_url,
      pubDate: util.formatDate(playlist.created_at),
      // modifiedDate: set below
      owner: {
        name: owner.name,
        email: owner.email
      }
    }
  };

  let maxModified = new Date(playlist.last_modified);

  // Transform the tracks...
  transform.channel.items = _.map(playlist.tracks, (track) => {

    // Disect the parts of the title to get title, verses, date
    // If we fail here, we log and skip this track...
    let match = track.title.match(/^(.+)\s+\-\s+(.+)\s\((.+)\)$/);
    if (match.length < 3) {
      log.error(`failed to parse track [id: ${track.id}, title: ${track.title}]`);
      return;
    }

    const verseRef = match[1],
          sermonTitle = match[2],
          sermonDate = match[3];

    // Attempt to match a speaker with the mapping we defined.
    const matchedSpeaker = _.find(options.speakerMapping, (v) => _.findIndex(tagArray, (w) => v === w));
    if (!matchedSpeaker) {
      log.error(`failed to match a speaker [id: ${track.id}, title: ${track.title}, tag_list: ${tagString}`);
      return;
    }

    // Get comma-delimited tag list
    const itemTagArray = util.splitTagList(track.tag_list),
          itemTagString = itemTagArray.join(',');

    const trackModified = new Date(track.last_modified);
    if (trackModified > maxModified) {
      maxModified = trackModified;
    }
    
    return {
      id: track.id,
      title: sermonTitle,
      link: track.permalink_url,
      description: sermonTitle,
      author: matchedSpeaker,
      category: track.genre,
      tags: itemTagString,
      duration: track.duration,
      image: track.artwork_url,
      enclosure: {
        uri: track.download_url,
        type:  "audio/mpeg",  // todo: use audio mappings in config
        length: track.original_content_size
      },
      pubDate: util.formatDate(sermonDate),
      verseRef: verseRef
    };

  }); // /tracks

  // Add the max modified date for our channel modified-on date.
  transform.channel.modifiedDate = util.formatDate(maxModified);

  return transform.channel;
};