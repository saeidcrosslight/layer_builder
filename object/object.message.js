'use strict';

angular
        .module('object.messages', [])
        .factory('message', function () {
            var factory = {},
                    message = function () {
                        this.content = [];
                        this.isActive = false;
                        this.setMessage = function (data) {
                            this.content.push(data);
                        };
                        this.cleanMessage = function () {
                            this.content = [];
                        };
                        this.copyMessage = function () {

                        };
                        this.saveMessage = function(){
                            
                        };                        
                    },
                    messageObject = function () {
                        this.runtime = $.extend({}, new message(), {name:"runtime"});
                        this.simu = $.extend({}, new message(), {name:"simu"});
                        this.error = $.extend({}, new message(), {name:"error"});
                        this.readme = $.extend({}, new message(), {name:"readme"});
                        this.cleanAllMessageState = cleanAllMessageState;
                        this.setMessageActive = setMessageActive;
                        this.getCurrentMessageObject = getCurrentMessageObject;
                    },
                    cleanAllMessageState = function (messageObject) {
                        messageObject.runtime.isActive = false;
                        messageObject.simu.isActive = false;
                        messageObject.error.isActive = false;
                        messageObject.readme.isActive = false;
                    },
                    setMessageActive = function(messageObject,messageTypeObject,type){
                        if(type===1)
                            messageTypeObject.cleanMessage(); //run app need to clean message
                        cleanAllMessageState(messageObject);
                        messageTypeObject.isActive = true;
                    },
                    getCurrentMessageObject = function(){
                        if (this.runtime.isActive)
                            return this.runtime;
                        if (this.simu.isActive)
                            return this.simu;
                        if (this.error.isActive)
                            return this.error;
                        if (this.readme.isActive)
                            return this.readme;
                    };

            factory.createMessageObject = function () {
                return new messageObject();
            };

            return factory;
        });
