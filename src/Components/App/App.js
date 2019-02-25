import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component{
constructor(props){
  super(props);
  this.state ={
    searchResults:[],
    playListTracks:[],
    playlistName:'PlayListNameTest',
  }
  this.addTrack = this.addTrack.bind(this);
  this.removeTrack = this.removeTrack.bind(this);
  this.updatePlaylistName = this.updatePlaylistName.bind(this);
  this.savePlaylist = this.savePlaylist.bind(this);
  this.search = this.search.bind(this);
};

render(){
  return (
    <div>
      <h1>Ja<span className ="highlight">mmm</span>ing</h1>
      <div className ="App">
          <SearchBar onSearch={this.search} />
        <div className ="App-playlist">
          <SearchResults searchResults ={this.state.searchResults} onAdd={this.addTrack} />
          <Playlist playlistName = {this.state.playlistName} playlistTracks={this.state.playlistTracks}onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />

        </div>
      </div>
    </div>
  )
};
//adds a track to the playlist
addTrack(track){
  if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id )){
    let plistTracks = this.state.playlistTracks;
    plistTracks.push(track);
     this.setState({playlistTracks: plistTracks});
     return;
  }
}
//removes a track from the play list
removeTrack(track){
  let remPlaylist = this.state.playlistTracks.filter(plTrack => {
    if(plTrack.id !== track.id ){
      return true;
    }return false;
  });
  this.setState({playlistTracks:remPlaylist})
}
//changes the playlist's name
updatePlaylistName(name){
  this.setState({playlistName: name })
}
//saves playlist to spotify account
savePlaylist(){

 const trackURIs = this.state.playlistTracks.map(target => target.uri);
 Spotify.savePlaylist(this.state.playlistName,trackURIs).then(() => {
   this.setState({
     playlistName: 'New Playlist',
     playlistTracks:[],
   })
 })

}

search(term){
  Spotify.search(term).then( sResults => {
    this.setState({searchResults : sResults})
  });
}

}
export default App;
