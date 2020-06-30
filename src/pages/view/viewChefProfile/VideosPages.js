import React, {Component} from 'react';
import {
  Text,
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
// import Video from 'react-native-video';
//Import React Native Video to play video
// import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
//Media Controls to control Play/Pause/Seek and full screen
import {WebView} from 'react-native-webview';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    width: '100%',
    paddingRight: 15,
    paddingLeft: 15,
    marginBottom: 30,
  },
  header: {
    color: '#D3AB52',
    fontSize: 22,
    width: '100%',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'red',
  },
});

class VideosPages extends Component {
  videoPlayer;

  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0,
      isFullScreen: false,
      isLoading: true,
      paused: false,
      // playerState: PLAYER_STATES.PLAYING,
      screenType: 'content',
      visible: false,
    };
  }

  // onSeek = (seek) => {
  //   //Handler for change in seekbar
  //   this.videoPlayer.seek(seek);
  // };

  // onPaused = (playerState) => {
  //   //Handler for Video Pause
  //   this.setState({
  //     paused: !this.state.paused,
  //     playerState,
  //   });
  // };

  // onReplay = () => {
  //   //Handler for Replay
  //   this.setState({playerState: PLAYER_STATES.PLAYING});
  //   this.videoPlayer.seek(0);
  // };

  onProgress = (data) => {
    const {isLoading, playerState} = this.state;
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      this.setState({currentTime: data.currentTime});
    }
  };

  onLoad = (data) => this.setState({duration: data.duration, isLoading: false});

  onLoadStart = (data) => this.setState({isLoading: true});

  onEnd = () => this.setState({playerState: PLAYER_STATES.ENDED});

  onError = () => alert('Oh! ', error);

  exitFullScreen = () => {
    alert('Exit full screen');
  };

  enterFullScreen = () => {};

  onFullScreen = () => {
    if (this.state.screenType == 'content')
      this.setState({screenType: 'cover'});
    else this.setState({screenType: 'content'});
  };
  renderToolbar = () => (
    <View>
      <Text> toolbar </Text>
    </View>
  );
  onSeeking = (currentTime) => this.setState({currentTime});
  regExGetVMID(url) {
    var regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/gm;
    return regExp.test(url);
  }
  regExGetYTID(url) {
    return /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/.test(url);
  }
  hideSpinner() {
    this.setState({visible: false});
  }
  showSpinner() {
    this.setState({visible: true});
  }
  render() {
    const {
      propsData: {coordinateData},
    } = this.props;
    console.log(console.log(coordinateData.chef.video_url));

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Videos</Text>
        {(coordinateData.chef.video_url &&
          this.regExGetYTID(coordinateData.chef.video_url)) ||
        (coordinateData.chef.video_url &&
          this.regExGetVMID(coordinateData.chef.video_url)) ? (
          <View style={{height: 250, marginTop: 10}}>
            <WebView
              onLoadStart={() => this.showSpinner()}
              onLoad={() => this.hideSpinner()}
              originWhitelist={['*']}
              onError={(e) => {
                console.log(e, 'err');
              }}
              source={{
                html: `<iframe width="100%" height="100%" src=https://www.youtube.com/embed/${coordinateData.chef.video_url.substr(
                  coordinateData.chef.video_url.lastIndexOf('/') + 1,
                )} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
              }}
            />
            {this.state.visible ? (
              <ActivityIndicator
                color="blue"
                style={{
                  left: '50%',
                  top: 90,
                  position: 'absolute',
                  alignSelf: 'center',
                }}
                size="small"
              />
            ) : null}
            {/* <Video
              onEnd={this.onEnd}
              onLoad={this.onLoad}
              onLoadStart={this.onLoadStart}
              onProgress={this.onProgress}
              paused={this.state.paused}
              ref={(videoPlayer) => (this.videoPlayer = videoPlayer)}
              resizeMode={this.state.screenType}
              onFullScreen={this.state.isFullScreen}
              onError={(e) => {
                console.log(e, 'error');
              }}
              onVideoError={(e) => {
                console.log(e, 'video error');
              }}
              source={{uri: coordinateData.chef.video_url}}
              style={styles.mediaPlayer}
              volume={10}
              controls={false}
            />
            <MediaControls
              duration={this.state.duration}
              isLoading={this.state.isLoading}
              mainColor="#333"
              onFullScreen={this.onFullScreen}
              onPaused={this.onPaused}
              onReplay={this.onReplay}
              onSeek={this.onSeek}
              onSeeking={this.onSeeking}
              playerState={this.state.playerState}
              progress={this.state.currentTime}
              toolbar={this.renderToolbar()}
            /> */}
          </View>
        ) : (
          <Text>No Video found</Text>
        )}
      </View>
    );
  }
}

mapStateToProps = (state) => ({
  getUser: state.authReducer.getUser,
  propsData: state.userReducer.propsData,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(VideosPages);
