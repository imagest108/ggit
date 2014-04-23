/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Data Module for an app
var dataModule = {
   "serialNum":"1234",
   "sender":"example@ggit.com",
   "recipient":"example@ggit.com",
   "goal":[
      {
         "dataType":"steps"
      },
      {
         "frequency-days":"7"
      },
      {
         "amount":10000
      }
   ],
   "isSucceed":false,
   "command":"lock"
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        app.apigeeConfig();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

    },
    apigeeConfig: function() {

      var dataclient = new Apigee.Client({
          orgName: 'JessJJ', // Your Apigee.com username for App Services
          appName: 'sandbox' // Your Apigee App Services app name
      });

      console.log('Apigee client connected');

      var box = new Apigee.Collection({
            'client': dataclient,
            'type': 'devices'
      });

      function loadItems(collection) {
          collection.fetch(
              function(err, data) { // Success
                  if (err) {
                      alert("Read failed - loading offline data");
                      collection = client.restoreCollection(localStorage.getItem(collection));
                      collection.resetEntityPointer();
                      displayData(collection);
                  } else {
                      displayData(collection);
                      localStorage.setItem(collection, collection.serialize());
                  }
              }
          );
      }

      function displayData(collection) {

        $('.app').html("");
        while (collection.hasNextEntity()) {
            var item = collection.getNextEntity();
            var goalobj = item.get('goal');
            var goalStatement = goalobj.amount;
            goalStatement += " ";
            goalStatement += goalobj.dataType;
            goalStatement += " for ";
            goalStatement += goalobj.frequency;
            goalStatement += "days";

            $('.app').append('<p>'+goalStatement+'</p>');
            // console.log(goalobj.amount);
            // console.log(item.get('goal'));
        }

      }
      loadItems(box);
    }
  };
