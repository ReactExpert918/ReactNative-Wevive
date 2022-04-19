var injectedJavaScript =  `
setTimeout(function() {
  window.ReactNativeWebView.postMessage('documentReady');
}, 10);
function wrap(fn) {
  return function wrapper() {
    var res = fn.apply(this, arguments);
    window.ReactNativeWebView.postMessage('navigationStateChange');
    return res;
  }
}
history.pushState = wrap(history.pushState);
history.replaceState = wrap(history.replaceState);
window.addEventListener('popstate', function() {
  window.ReactNativeWebView.postMessage('navigationStateChange');
});
`;
export default injectedJavaScript;
