var phantom = require('phantom');

    phantom.create().then(function(ph) {
      ph.createPage().then(function(page) {
        page.injectJs('./jQuery.min.js', function() {
          page.property('content').then(function(content) {
            console.log(content);
            page.close();
            ph.exit();
          });
        });
      });
    });
