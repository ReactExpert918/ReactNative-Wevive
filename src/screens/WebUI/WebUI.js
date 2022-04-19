import React, { Component } from 'react';
import {
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import jsCode from './injectedJavaScript';
import originWhitelist from './originWhitelist';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
export default class WebUI extends Component {
  state = {
    loading: true,
    canGoBack: false,
  };
  goBack = () => {
    if (this.state.canGoBack) {
      this.webView.goBack();
      return true;
    } else {
      return false;
    }
  }
  render() {
    return (
      <>
      <WebView
        source={{ uri: this.props.url ? this.props.url : this.props.route.params.URL }}
        style={{
          flex :1,
          opacity: this.state.loading ? 0 : 1,
          marginTop: this.props.route.params && this.props.route.params.hiddenHeader ? this.props.route.params.insets.top : 0,
        }}
          onError={syntheticEvent => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
        injectedJavaScript={jsCode}
        originWhitelist={originWhitelist}
        mixedContentMode="always"
        useWebKit={true}
        javaScriptEnabledAndroid={true}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={true}
          automaticallyAdjustContentInsets={true}
          domStorageEnabled
        onLoadStart = {() => {this.setState({loading:true}) }}
        ref={webView => (this.webView = webView)}
        onNavigationStateChange = {(state) => {
            this.state.canGoBack  = state.canGoBack;
            if (this.props.route.params && this.props.route.params.navigationStateChange) {
              this.props.route.params.navigationStateChange(state,state,this.goBack);
            }
            return true;
        }}
        onMessage={({ nativeEvent: sstate }) => {
            if (sstate.data == "documentReady") {
              this.setState({loading:false});
            }
            if (this.props.navigationStateChange) {
              if (sstate.data === "navigationStateChange") {
                this.state.canGoBack  = sstate.canGoBack;
                this.props.navigationStateChange(state);
              }
            }
          }
        }
      />
      {this.state.loading ? <ActivityIndicator  style={{position:"absolute",top:responsiveHeight(35),left:responsiveWidth(50)-10}}/> : null}
      </>
    );
  }
}