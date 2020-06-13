package com.bw.plugin;

import android.util.Log;
import android.widget.Toast;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.lib.Cocos2dxHelper;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

public class NativePlugin {
    static final String TAG = "NativePlugin";

    public static void sendMsgToPlugin(String s) {
        Log.i(TAG, "sendMsgToPlugin:" + s);

        if (s.equals("test")) {
            // 当前是引擎GL线程,UI调用需要在UI线程
            final String msg = s;

            AppActivity app = (AppActivity)Cocos2dxHelper.getActivity();
            app.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(Cocos2dxHelper.getActivity(), msg, Toast.LENGTH_SHORT).show();

                    sendMsgToEngine("test_ok;android", true);
                }
            });
        }
    }

    public static void sendMsgToEngine(String s, boolean async) {
        if (!async) {
            Cocos2dxJavascriptJavaBridge.evalString("window.__native('" + s + "')");
        } else {
            final String msg = s;
            Cocos2dxHelper.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    sendMsgToEngine(msg, false);
                }
            });
        }
    }
}