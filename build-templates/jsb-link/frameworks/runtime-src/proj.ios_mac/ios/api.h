//
//  api.h
//  BW
//
//  Created by adfan on 2020/6/4.
//

#ifndef api_h
#define api_h

extern "C" {
    void sendMsgToEngine(const char *msg, bool async);
}

#endif /* api_h */
