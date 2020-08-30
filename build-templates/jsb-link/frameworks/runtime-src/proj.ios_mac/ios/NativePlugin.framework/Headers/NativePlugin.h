
//
//  NativePlugin.h
//  BeautifulWorld
//
//  Created by adfan on 15/9/24.
//
//

#ifndef NativePlugin_h
#define NativePlugin_h

namespace NativePlugin {
    class IPluginListener {
    public:
        virtual void onMsg(const char *msg) = 0;
    };
    
	// send to engine from plugin
	void sendMsgToEngine(const char* msg);
	
    void listenToEngine(IPluginListener *listener);
}

// for unity
extern "C" {
	typedef void (*__EngineCallback)(const char*);
	void initNativePlugin(__EngineCallback cb);
	
	// send from engine to plugin
	void sendMsgToPlugin(const char* msg);
}

#endif /* NativePlugin_h */
