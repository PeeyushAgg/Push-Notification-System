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
//Version 0.1

var eventToUse = 'tap';
var appUrl = 'https://192.168.8.236:18000/';

'use strict';

console.log('Started', self);

var url = "www.realbox.in"; 

self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

// self.addEventListener('push', function(event) {
// //  console.log(event);
//   var title = 'Push Notification';

//   event.waitUntil(
//     self.registration.showNotification(title, {
//       'body': "MSDyyyy",
//       'icon': 'images/icon.png'
//     }));
// });
//========================================================================================

self.addEventListener('push', function(event) {
  event.waitUntil(
    self.registration.pushManager.getSubscription().then(function(subscription) {
      fetch('/api', {
        method: 'post',
        headers: {
          //'Authorization': 'Bearer ' + self.token,
          //'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      })
      .then(function(response) { return response.json(); })
      .then(function(data) {
        self.registration.showNotification(data.title, {
          body: data.body,
          //icon: 'https://letreach.com/assets/letreach/img/ltr-icon.png?url=abcd'
          icon: "https://192.168.8.236:18000/images/realbox.png"
          
        });

        url = data.url;
        console.log("------>" + url);

      })
      .catch(function(err) {
        console.log('err');
        console.log(err);
      });
    })
  );
});





//=========================================================================================

self.addEventListener('notificationclick', function(event) {
    console.log('Notification click: tag ' + url, event.notification.tag);
    event.notification.close();
    //var url = 'https://realbox.in';
    //console.log(url)
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        }).then(function(windowClients) {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});




// self.addEventListener('fetch', function(event) {
//   console.log('Handling fetch event for', event.request.url);

//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       if (response) {
//         console.log('Found response in cache:', response);

//         return response;
//       }
//       console.log('No response found in cache. About to fetch from network...');

//       return fetch(event.request).then(function(response) {
//         console.log('Response from network is:', response);

//         return response;
//       }).catch(function(error) {
//         console.error('Fetching failed:', error);

//         throw error;
//       });
//     })
//   );
// });