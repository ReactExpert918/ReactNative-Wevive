call yarn patch-package
call yarn copy-files-from-to

RMDIR /S /Q node_modules\react-native-chat-plugin\node_modules\react-native-webview

copy node_modules\react-native-sqlite-storage\package.json node_modules\react-native-sqlite-storage\platforms\package.json

mkdir node_modules\lib-jitsi-meet
copy lib-jitsi-meet.min.js node_modules\lib-jitsi-meet
