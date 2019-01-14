const print = require('../index.js');
const extFs = require('yyl-fs');
const fs = require('fs');
const path = require('path');
const FRAG_PATH = path.join(__dirname, './__frag');

const fn = {
  frag: {
    async build() {
      if (fs.existsSync(FRAG_PATH)) {
        await extFs.removeFiles(FRAG_PATH);
      } else {
        await extFs.mkdirSync(FRAG_PATH);
      }
    },
    async destory() {
      if (fs.existsSync(FRAG_PATH)) {
        await extFs.removeFiles(FRAG_PATH, true);
      }
    }
  },
  async buildFile(iPath) {
    const dirname = path.dirname(iPath);
    if (!fs.existsSync(dirname)) {
      await extFs.mkdirSync(dirname);
    }
    fs.writeFileSync(iPath, '');
  }
};

(async () => {
  await fn.frag.build();

  await fn.buildFile(path.join(FRAG_PATH, 'js/index.js'));
  await fn.buildFile(path.join(FRAG_PATH, 'css/index.css'));
  await fn.buildFile(path.join(FRAG_PATH, 'html/index.html'));
  await fn.buildFile(path.join(FRAG_PATH, '.eslintrc'));
  await fn.buildFile(path.join(FRAG_PATH, 'yyl.config.js'));
  await fn.buildFile(path.join(FRAG_PATH, '.sass-cache/cache.js'));

  console.log(
    print.fn.decolor(
      print.buildTree({
        path: 'yyl-print',
        dirList: [
          'yyl-print/images/1.png',
          'yyl-print/js/1.js',
          'yyl-print/js/lib/lib.js',
          'yyl-print/css/1.css',
          'yyl-print/html/1.html'
        ]
      })
    )
  );

  // TODO
  await fn.frag.destory();
})();
