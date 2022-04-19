#!/bin/bash
while [[ $# -gt 0 ]] ; do
    key="$1"
    case $key in
        --android)
            ANDROID=1
            ;;
        --ios)
            IOS=1
            ;;
        --prod)
            PROD=1
            ;;
        *)
    esac
    shift
done

BUILD_NUMBER="1"
BUNDLE_SHORT_VERSION="21.8.171"
TEAM_ID="ZN624JHU82"


PLIST="ios/app/src/Info.plist"
IMAGEEXT_PLIST="ios/app/ImageNotification/Info.plist"
EXPORT_PLIST="ios/export.plist"

ENTITLEMENTS_PLIST="ios/app/app.entitlements"
COMMIT=$(git rev-parse HEAD)
if [[ -z "$PROD" ]]; then
BUNDLE_DISPLAY_NAME="Wevive Dev"
BUNDLE_NAME="com.wevive.wevivedev"
DOMAIN="appdev.wevive.com"
BUNDLE_NAME_SHORT="wevivedev"
#Prepare configs
cp app.dev.json app.json
else
BUNDLE_DISPLAY_NAME="Wevive"
BUNDLE_NAME="com.wevive.weviveapp"
DOMAIN="app.wevive.com"
BUNDLE_NAME_SHORT="weviveapp"
cp app.prod.json app.json
fi
cp firebase/$BUNDLE_NAME.json android/app/google-services.json
cp firebase/$BUNDLE_NAME.plist ios/app/GoogleService-Info.plist
cp firebase/$BUNDLE_NAME.plist ios/sdk/GoogleService-Info.plist
FIREBASE_APP=$(cat firebase/$BUNDLE_NAME.json | grep "mobilesdk_app_id" | cut -f 4 -d\")
MESSAGE=`git log -1 --pretty=%B`

VERSIONCODE=$(echo "${BUNDLE_SHORT_VERSION}-${BUILD_NUMBER}" | sed "s/[^0-9]//g")

#Android - Set versions etc
#sed -i '' "s/APP_NAME=.*/APP_NAME=$BUNDLE_DISPLAY_NAME/g" android/gradle.properties
sed -i '' "s/APP_ID=.*/APP_ID=$BUNDLE_NAME/g" android/gradle.properties
sed -i '' "s/APP_VERSION=.*/APP_VERSION=$BUNDLE_SHORT_VERSION/g" android/gradle.properties
#sed -i '' "s/APP_VERSION_BUILD=.*/APP_VERSION_BUILD=$BUILD_NUMBER/g" android/gradle.properties
#sed -i '' "s/APP_VERSIONCODE=.*/APP_VERSIONCODE=${VERSIONCODE}/g" android/gradle.properties

#iOS - Set plist values

/usr/libexec/Plistbuddy -c "Set CFBundleShortVersionString $BUNDLE_SHORT_VERSION" "$IMAGEEXT_PLIST"
/usr/libexec/Plistbuddy -c "Set CFBundleIdentifier $BUNDLE_NAME.ImageNotification" "$IMAGEEXT_PLIST"
/usr/libexec/Plistbuddy -c "Set CFBundleVersion $BUILD_NUMBER" "$IMAGEEXT_PLIST"
/usr/libexec/Plistbuddy -c "Set ITSAppUsesNonExemptEncryption bool false" "$PLIST"
/usr/libexec/Plistbuddy -c "Set Comments string '$MESSAGE ($COMMIT)'" "$PLIST"
/usr/libexec/PlistBuddy -c "Set CFBundleURLTypes:0:CFBundleURLSchemes:0 $BUNDLE_NAME" "$PLIST"
/usr/libexec/PlistBuddy -c "Set CFBundleURLTypes:0:CFBundleURLName $BUNDLE_NAME_SHORT" "$PLIST"
/usr/libexec/Plistbuddy -c "Set CFBundleDisplayName $BUNDLE_DISPLAY_NAME" "$PLIST"
/usr/libexec/Plistbuddy -c "Set CFBundleIdentifier $BUNDLE_NAME" "$PLIST"
/usr/libexec/Plistbuddy -c "Set CFBundleVersion $BUILD_NUMBER" "$PLIST"
/usr/libexec/Plistbuddy -c "Set CFBundleShortVersionString $BUNDLE_SHORT_VERSION" "$PLIST"
/usr/libexec/Plistbuddy -c "Set teamID $TEAM_ID" "$EXPORT_PLIST"
#/usr/libexec/Plistbuddy -c "Set application-identifier $BUNDLE_NAME" "$ENTITLEMENTS_PLIST"
/usr/libexec/Plistbuddy -c "Set aps-environment development" "$ENTITLEMENTS_PLIST"
/usr/libexec/Plistbuddy -c "Set com.apple.developer.associated-domains:0 applinks:$DOMAIN" "$ENTITLEMENTS_PLIST"
/usr/libexec/Plistbuddy -c "Set com.apple.developer.associated-domains:0 applinks:$DOMAIN" "$ENTITLEMENTS_PLIST"

if [[ ! -z "$ANDROID" ]]; then
    #Build Android
    yarn androidReleaseAPK

    #Build Android IPA
    cd android && gradle bundleRelease
    cd ..

    #Upload to Firebase
    firebase appdistribution:distribute ./android/app/build/outputs/apk/release/app-release.apk \
    --app "$FIREBASE_APP" \
    --release-notes "$MESSAGE ($COMMIT)" --testers-file testers.txt


fi;
if [[ ! -z "$IOS" ]]; then
#Build iOS
xcodebuild clean archive -workspace ios/jitsi-meet.xcworkspace -scheme Wevive -archivePath builds/wevive.xcarchive -allowProvisioningUpdates && \
#Upload to Testflight
xcodebuild -exportArchive -archivePath builds/wevive.xcarchive -exportPath builds/wevive.ipa -exportOptionsPlist ios/export.plist -allowProvisioningUpdates
fi;