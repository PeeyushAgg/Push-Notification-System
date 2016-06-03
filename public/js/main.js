/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

'use strict';

/*
if ('serviceWorker' in navigator) {
console.log('Service Worker is supported');
navigator.serviceWorker.register('../views/sw.js').then(function(reg) {
console.log('Service Worker is ready :^)', reg);

reg.pushManager.subscribe({
userVisibleOnly: true
}).then(function(sub) {
console.log('endpoint:', sub.endpoint);
var gcm_key = {}
var r = sub.endpoint.split("/")[5];
gcm_key._id = r;
});
}).catch(function(error) {
console.log('Service Worker error :^(', error);
});
}

var key_save = new function() {
  this.saveKey = function(x, callback) {
      execute('saveKey', x, callback, callback);

    }
}
*/

//========================================================


$(document).ready(function() {  

// if(("serviceWorker" in navigator)){
// 	$("popUpWindow").removeClass("hide");
// 	console.log("hello");
// }

bind(".btnSubscribe", function(){
	$(".popUpWindow").removeClass("hide");
	$(".btnSubscribe").addClass("hide");
});

bind('.btnSubmit', function(){
  
var gcm_key = {};
gcm_key.name = $(".name").val();
gcm_key.phone = $(".phoneNumber").val();

if ('serviceWorker' in navigator) {
console.log('Service Worker is supported');
navigator.serviceWorker.register('../views/sw.js').then(function(reg) {
console.log('Service Worker is ready :^)', reg);
console.log(reg);


reg.pushManager.subscribe({
userVisibleOnly: true
}).then(function(sub) {

console.log('endpoint:', sub.endpoint);
$(".popUpWindow").addClass("hide");
var r = sub.endpoint.split("/")[5];
gcm_key._id = r;
console.log(gcm_key);

key_save.saveKey(gcm_key, function(err){
    console.log(err);
  })
});
}).catch(function(error) {
console.log('Service Worker error :^(', error);
});}

var key_save = new function() {
  this.saveKey = function(x, callback) {
      execute('saveKey', x, callback, callback);
    }
}

}) 

});







//=========================================================






//};


// 'use strict';

// if ('serviceWorker' in navigator) {
//   console.log('Service Worker is supported');
//   navigator.serviceWorker.register('/views/sw.js').then(function(reg) {
//     console.log('Service Worker is ready :^)', reg);
//     reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
//       console.log('endpoint:', sub.endpoint);
//     });
//   }).catch(function(error) {
//     console.log('Service Worker error :^(', error);
//   });
// }
