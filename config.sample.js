
/* 
 * Plug in your values and save/ln the file as 'config.js' in the root
*/

export default {
  soundcloud: {
    baseUrl = "https://api.soundcloud.com",
    clientId = "<fill_me_in>",

    // List of playlists to aggregate the tracks for
    playlists = []
  },
  parsing: {
    // The speakers that will parsed out of the tag_list
    speakers: [],

    // The function that will transform the feed into the expected format
    transformer: null
  }
}