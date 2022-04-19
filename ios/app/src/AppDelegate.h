#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>
#import <CallKit/CallKit.h>
@interface AppDelegate : UIResponder <UIApplicationDelegate, CXCallObserverDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) NSString *last_uuid;
@property (nonatomic) BOOL hasConnected;
@property (nonatomic, strong) CXCallObserver *callObserver;
@end
