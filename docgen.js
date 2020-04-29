const documentation = require('documentation');
const fs = require('fs');

documentation.build(['./server', './middleware', './mixins', './scripts'], {})
  .then(documentation.formats.md)
  .then(output => {
    // output is a string of Markdown data
    fs.writeFileSync('./documentation.md', output);
  });
