const clientID = 'ebf45a6df79a4214a34c7b2b876138ad';
const redirectURL = "http://CHIPSY.surge.sh";
//http://localhost:3000/

let userAccessToken;
const Spotify = {
  getAccessToken(){
    if(userAccessToken !== ''){
      return userAccessToken;
    }
    const userToken = window.location.href.match(/access_token=([^&]*)/);
    const userExpTime = window.location.href.match(/expires_in=([^&]*)/);

    if(userToken && userExpTime){
      userAccessToken = userToken[1];
      const expTime = userExpTime[1];
      window.setTimeout(() => userToken = '', userExpTime * 1000);
      window.history.pushState('Access Token', null, '/');
    }else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`;
    }
  },

  search(term){
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers:{Authorization:`Bearer ${userAccessToken}`}
      }).then(response => {
        if(response.ok){
          return response.json();
        }}).then(jsonResponse => {
        if(!jsonResponse){
          return [];
        }else{
          return jsonResponse.tracks.items.map(track =>
          ({
            id :track.id,
            name : track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
          })
          )
        }
      })
  },

  savePlaylist(playListName, trackURIs){
    if(!playListName && !trackURIs){
      return;
    }else if(playListName && trackURIs){
      const accessToken = userAccessToken;
      const headers = {Authorization:`Bearer ${userAccessToken}`};
      const userID=''

      fetch(`https://api.spotify.com/v1/me`,{headers: headers}).then(response =>{
        if(response.ok){
          return response.json()
        }}).then(jsonResponse => {
        if(!jsonResponse){
          return
        } userID = jsonResponse.id;

        //adds pList to spotify
        return fetch(`/v1/users/${userID}/playlists`,{
          headers: headers,
          method: 'POST',
          body:JSON.stringify({name: playListName}),
        }).then(response => {
          if(response.ok){
            return response.json();
          }else {
            console.log('Failed Request!');
          }
        }).then(
          jsonResponse => {
            const playlistID = jsonResponse.id;

            //insert new tracks to playlist
            fetch(`/v1/users/${userID}/playlists/${playlistID}/tracks`,{
              headers: headers,
              method:'POST',
              body: JSON.stringify({uris: trackURIs})
            })
        })

      })
    }
  }

}
export default Spotify;
