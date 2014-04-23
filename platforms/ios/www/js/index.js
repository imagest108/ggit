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


var boxUUID;

var appUser;


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        //app.senderConfig();
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


    },
    // Update DOM on a Received Event
    //**********p1: Welcome screen**********//
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        $('#page1').css('display','block');

        console.log('Received Event: ' + id);
        app.bleSetup();

    },

    //**********p2: GGIT Connection / Box connection status here Change Page! **********//
    bleSetup: function(){

    // scan BLE devices & get connection

      // bLEcallback(param,function(err){
      //   if(err){
      //
      //   }else{
      //     app.selectOne();
      //   }
      // });
      setTimeout(displayConnection, 3000); ////temporary function for next page

    // display BLE connection results in html
      function displayConnection(){
        $('.app').css('display','none');
        $('#page1').css('display','none');
        $('#page2').css('display','block');
        setTimeout(app.selectOne, 1000); ////temporary function for next page

      }
    },

    //**********p3: choose status-Sender or Recipient **********//
    selectOne: function(){
      console.log('selectOne');

    //button display in html
      $('#page2').css('display','none');
      $('#page3').css('display','block');

    //if a user chooses 'sender,'
      $('#page3').on('click', '#sender', app.senderConfig);
    //if a user chooses 'recipient,'
      $('#page3').on('click', '#recipient', app.recipientConfig);
    },

    //**********p4-1: sender configuration- Set up your GGIT box **********//
    senderConfig: function() {

      var client = new Apigee.Client({
          orgName: 'JessJJ', // Your Apigee.com username for App Services
          appName: 'sandbox' // Your Apigee App Services app name
      });

      console.log('Apigee client connected');

      var boxes = new Apigee.Collection({
            'client': client,
            'type': 'devices'
      });

      //console.log('senderConfig');
      $('#page3').css('display','none');
      $('#page4').css('display','block');

      client.getLoggedInUser(function(err, data, user) {
          if (err) {
              //error - could not get logged in user
              window.location = "#";
          } else {
              if (client.isLoggedIn()) {
                  appUser = user;
                  //loadItems(myList);
                  console.log(user);
              }
          }
      });

      function login(username, password) {

          if (username && password) {
              var username = username;
              var password = password;
          } else {
              // var username = $("#form-username").val();
              // var password = $("#form-password").val();
              console.log("no username && password");
          }

          client.login(username, password,
              function(err) {
                  if (err) {
                      console.log(err)
                  } else {
                      //login succeeded
                      client.getLoggedInUser(function(err, data, user) {
                          if (err) {
                              //error - could not get logged in user
                          } else {
                              if (client.isLoggedIn()) {
                                  appUser = user;
                                  console.log("you're logged in!");
                              }
                          }
                      });
                  }
              }
          );
      }

      $('#form-sender-config').on('click', '#btn-submit', function() {
            console.log("sending addBoxRequest..");
            if ($('#form-serial').val() !== '') {
              var newBox = {
                  'serialNum': $('#form-serial').val(),
                  'sender': $('#form-sender-email').val(),
                  'recipient': $('#form-recipient-email').val(),
              }
              var account = $('#form-sender-email').val();
              var password = $('#form-serial').val();
              var role = "sender";

              boxes.addEntity(newBox, function(error, response) {
                  if (error) {
                    alert("write failed");
                  } else {
                    alert("You create a new box!");

                    boxUUID = response._data.uuid;
                    /*
                    var options = {
                        "type": "devices",
                        "uuid": response._data.uuid
                    }
                    client.getEntity(options, function(error, response) {
                          if (error) {
                              alert("error!");
                          } else {
                              console.log(options.uuid);
                          }
                    });
                    */
                    app.senderInit();
                  }
              });

              // client.signup(account,password,role, function(err, data) {
              //   if (err) {
              //       console.log('FAIL')
              //   } else {
              //       console.log('SUCCESS');
              //       login(account, password);
              //   }
              // });
          }
          $("#form-sender-email").val('');
          $("#form-recipient-email").val('');
          $("#form-serial").val('');

      });


    },

    //**********p4-2: welcome sender **********//
    senderInit: function() {

    //button display in html
      $('#page4').css('display','none');
      $('#page5').css('display','block');

      $('#page5').on('click', '#next', function() {

        app.setGoal();

      });
    },

    //**********p4-3: set up a goal for the recipient **********//
    setGoal: function() {

    var client = new Apigee.Client({
        orgName: 'JessJJ', // Your Apigee.com username for App Services
        appName: 'sandbox' // Your Apigee App Services app name
    });

    console.log('Apigee client connected');

    var boxes = new Apigee.Collection({
          'client': client,
          'type': 'devices'
    });

    //button display in html
      $('#page5').css('display','none');
      $('#page6').css('display','block');

      $('#form-set-goal').on('click', '#btn-submit', function() {
            console.log("sending goalSetupRequest..");
            if ($('#form-steps').val() !== '' && $('#form-freq').val() !== '') {

              var amount = $('#form-steps').val();
              var frequency = $('#form-freq').val();

              var options = {
                  "type": "devices",
                  "uuid": boxUUID
              }
              client.getEntity(options, function(error, response) {
                    if (error) {
                        alert("error!");
                    } else {
                        //console.log("Success to retrieve entity!");
                        var properties = {
                            'client':client, //Required
                            'data':{'type':'devices',
                            'uuid':boxUUID, //UUID of the entity to be updated is required
                            'goal':{
                              'frequency':frequency,
                              'amount':amount,
                              'dataType':'steps'
                                  }
                            }
                        };

                        //Create a new entity object that contains the updated properties
                        var entity = new Apigee.Entity(properties);

                        //Call Entity.save() to initiate the API PUT request
                        entity.save(function (error, result) {

                            if (error) {
                                //error
                                alert("error!");
                        	} else {
                        		//success
                                alert("You set up a new goal!");
                                app.confirmGoal();
                        	}

                        });
                      }
              });
            }
      });
    },
    confirmGoal: function() {

      var dataclient = new Apigee.Client({
          orgName: 'JessJJ', // Your Apigee.com username for App Services
          appName: 'sandbox' // Your Apigee App Services app name
      });

      console.log('Apigee client connected');

      var box = new Apigee.Collection({
            'client': dataclient,
            'type': 'devices',
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

        $('h1').html("");
        $('form').html("");
        while (collection.hasNextEntity()) {
            var item = collection.getNextEntity();
            var goalobj = item.get('goal');
            var goalStatement = goalobj.amount;
            goalStatement += " ";
            goalStatement += goalobj.dataType;
            goalStatement += " for ";
            goalStatement += goalobj.frequency;
            goalStatement += "days";

            $('h1').html(goalStatement);
            // console.log(goalobj.amount);
            // console.log(item.get('goal'));
        }

      }
      loadItems(box);
    }

  };
