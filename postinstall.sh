#!/bin/sh

if [[ "$OSTYPE" == "msys" ]] #if system is windows
then
	./postinstall.bat
else
    yarn patch-package
    npx copy-files-from-to

    rm -rf  node_modules/react-native-chat-plugin/node_modules/react-native-webview/
    cp node_modules/react-native-sqlite-storage/package.json node_modules/react-native-sqlite-storage/platforms/package.json
    cd node_modules/react-native-webrtc/apple && tar -xvf WebRTC.xcframework.tgz && cd ../../../
    mkdir node_modules/lib-jitsi-meet
    cp lib-jitsi-meet.min.js node_modules/lib-jitsi-meet
fi
