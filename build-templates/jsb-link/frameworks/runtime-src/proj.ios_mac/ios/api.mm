//
//  api.mm
//  BW
//
//  Created by adfan on 2020/6/4.
//
#import "api.h"

#import <Foundation/Foundation.h>

#import "platform/CCApplication.h"

#import "scripting/js-bindings/jswrapper/SeApi.h"

#import "base/CCScheduler.h"

#import "string.h"


using namespace cocos2d;


@interface APIObject : NSObject

+(void) sendMsgToPlugin:(NSString*)msg;

@end

@implementation APIObject

+(void) sendMsgToPlugin:(NSString *)msg {
    NSLog(msg);
    
    if ([msg isEqualToString:@"test"]) {
        // 显示弹框
        UIAlertController *alertVc = [UIAlertController alertControllerWithTitle:@"标题" message:msg preferredStyle:UIAlertControllerStyleAlert];

        UIAlertAction *sureBtn = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDestructive handler:^(UIAlertAction * _Nonnull   action) {
            NSLog(@"确定");
            
            sendMsgToEngine("test_ok;ios", true);
        }];

        [alertVc addAction :sureBtn];

        UIWindow *window = [[UIApplication sharedApplication].delegate window];
        UIViewController *topViewController = [window rootViewController];
        
        [topViewController presentViewController:alertVc animated:YES completion:nil];
        
    }
}

@end



extern "C" {

    void sendMsgToEngine(const char *msg, bool async) {
        if (!async) {
            std::string s = "window.__native('";
            s += msg;
            s += "')";
            
            se::ScriptEngine::getInstance()->evalString(s.c_str());
        } else {
            
            Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
                sendMsgToEngine(msg, false);
                 });
        }
        
    }

}
