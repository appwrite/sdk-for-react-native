#import <React/RCTBridgeModule.h>

@interface AppwriteCookies : NSObject <RCTBridgeModule>
@end

@implementation AppwriteCookies

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

// Read by Tracking for app_updated, so the SDK needs no app-info dependency.
- (NSDictionary *)constantsToExport
{
    NSString *version = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
    return @{@"appVersion": version ?: @""};
}

RCT_EXPORT_METHOD(session:(NSString *)url
                  project:(NSString *)project
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSString *name = [@"a_session_" stringByAppendingString:project];
    NSURL *target = [NSURL URLWithString:url];
    if (target == nil) {
        resolve([NSNull null]);
        return;
    }
    for (NSHTTPCookie *cookie in [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookiesForURL:target]) {
        if ([cookie.name isEqualToString:name]) {
            resolve(cookie.value);
            return;
        }
    }
    resolve([NSNull null]);
}

@end
