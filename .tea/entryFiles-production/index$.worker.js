
require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../pages/index/index');
require('../../pages/login/index');
require('../../pages/scansucceed/index');
require('../../pages/billing/index');
require('../../pages/userinfo/index');
require('../../pages/settings/index');
require('../../pages/aboutme/index');
require('../../pages/deposit/index');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
