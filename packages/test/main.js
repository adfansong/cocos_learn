'use strict';

let child_process = require('child_process');

module.exports = {
  load () {
    // execute when package loaded
    this.onBeforeBuildFinish = this.onBeforeBuildFinish.bind(this);
    Editor.Builder.on('before-change-files', this.onBeforeBuildFinish);
  },

  unload () {
    // execute when package unloaded
    Editor.Builder.removeListener('before-change-files', this.onBeforeBuildFinish);
  },

  // register your ipc messages here
  messages: {
    'open' () {
      // open entry panel registered in package.json
      Editor.Panel.open('test');
    },
    'say-hello' () {
      Editor.log('Hello World!');
      // send ipc message to panel
      Editor.Ipc.sendToPanel('test', 'test:hello');
    },
    'clicked' () {
      Editor.log('Button clicked!');
    }
  },

  // function
  onBeforeBuildFinish(options, callback) {
    Editor.log('Building ' + options.platform + ' to ' + options.dest);

    if (options.platform == 'ios') {
      this.makeXcodeProj(options);
    }

    callback();
  },

  makeXcodeProj(options) {
      let root = options.dest;
      let projName = options.title;
      let proj = root + `/frameworks/runtime-src/proj.ios_mac/${projName}.xcodeproj`;
      Editor.log('make xcodeproj: ' + proj);

      try {
          let script = __dirname + '/make_xcodeproj.rb';
          let cmd = `ruby ${script} ${proj}`;
          let ret = child_process.execSync(cmd);
          // console.log(ret);

      } catch (e) {
        Editor.error(`cmd error: ${e.message}`);
          return false;
      }
  }
};