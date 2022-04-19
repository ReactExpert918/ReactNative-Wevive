## Installation
0) Install all required prerequisites (Android Studio, Xcode if available, and yarn)
1) Run "yarn install" to install all dependencies
2) (iOS) Install Pods: "cd ios && pod install"

## Running for development
1) Connect the device to your computer

2a) Android: Run "yarn android" - this builds the app and installs the debug version of the application on the device

2b) iOS: Open ios/jitsi-meet.xcworkspace  and press "Start"

## Android Prerequisites

1) Install Android Studio, download SDK and NDK

To run Android on Mac:

brew tap homebrew/cask
brew install ant gradle maven
brew cask install adoptopenjdk8
brew cask install android-sdk

echo "export ANDROID_HOME=/usr/local/share/android-sdk" >> ~/.bash_profile
source ~/.bash_profile

touch ~/.android/repositories.cfg
sdkmanager --update
sdkmanager "platform-tools" "platforms;android-28"

##  iOS Prerequisites

1) Install Xcode & Xcode command line tools
2) xcode-select --switch /Applications/Xcode.app

CocoaPods:
gem install cocoapods

Brew:
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

Yarn:
brew install yarn

## Distribution
To create *.ipa for ad-hoc distribution:
1) Open ios/jitsi-meet.xcworkspace
2) Select Generic iOS device as build target,
3) Run Product->Archive
4) Distribute for team
5) Get *.ipa from exported folder

To create *.apk and *.aab:
1) yarn androidRelease
3) Get *.apk and *.aab from android/app/build/outputs/apk/release


## Known issues:

1) Can't install dependencies:
Make sure you set up the SSH key in Gitlab

(Windows only) 2) “.ps1 is not digitally signed. The script will not execute on the system.”
Run:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

3) To see console.log in console, comment out this in babel.config.js:
    //plugins: ['transform-remove-console'],
