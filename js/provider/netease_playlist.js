function build_netease_playlist(){

  function ne_search_playlist(url, hm, se) {
    // use chrome extension to modify referer.
    const target_url = 'http://music.163.com/api/search/pc';
    const keyword = getParameterByName('keywords', url);
    const curpage = getParameterByName('curpage', url);
    const req_data = {
      s: keyword,
      offset: 20 * (curpage - 1),
      limit: 20,
      type: 1000,
    };
    return {
      success(fn) {
        hm({
          url: target_url,
          method: 'POST',
          data: se(req_data),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }).then((response) => {
          const { data } = response;
          const tracks = data.result.playlists.map(play_list_info => ({
            playlist: true,
            id: `neplaylist_${play_list_info.id}`,
            title: play_list_info.name,
            trackCount: play_list_info.trackCount,
            bookCount: play_list_info.bookCount,
            creator: play_list_info.creator.nickname,
            artist: "",
            artist_id: "",
            album: "",
            album_id: "",
            source: 'netease',
            source_url: `https://music.163.com/#/playlist?id=${play_list_info.id}`,
            img_url: play_list_info.coverImgUrl,
            url: "",
            disabled: false,
          }));
          return fn({
            result: tracks,
            total: data.result.playlistCount,
          });
        });
      },
    };
  }
  
  return {
    search : ne_search_playlist
  };
}

const netease_playlist = build_netease_playlist();