var signajs = (function() {
    var SIGNAJS_PROP = '__signajs_events__';

    function signajs_object_property(object) {
        if(typeof(object[SIGNAJS_PROP]) === 'undefined') {
            Object.defineProperty(object, SIGNAJS_PROP, {
                enumerable: false,
                writable: true
            });

            object[SIGNAJS_PROP] = {};
        }

        return object[SIGNAJS_PROP];
    }

    function signajs_event_slots(object, event) {
        var objectSignajs = signajs_object_property(object);

        if(typeof(objectSignajs[event]) === 'undefined')
            objectSignajs[event] = []

        return objectSignajs[event];
    }

    var signajs = {
        connect: function signajs_connect(object, events, callback) {
            if(typeof(callback) === 'function') {
                events = events.split(/\s+/);

                for (var i = 0; i < events.length; ++i)
                    signajs_event_slots(object, events[i]).push(callback)
            }

            return this;
        },
        disconnect: function signajs_disconnect(object, events, callback) {
            var objectSignajs = signajs_object_property(object);
            events = events.split(/\s+/);

            for (var i = 0; i < events.length; ++i) {
                if (events[i] in objectSignajs) {
                    var eventSlots = signajs_event_slots(object, events[i]);

                    if (typeof(callback) === 'function') {
                        var found = false;

                        for (var k; k < eventSlots[i].length; ++k) {
                            if (eventSlots[k] == callback) {
                                found = true;
                                break;
                            }
                        }

                        if (found)
                            eventSlots[i].splice(k, 1)
                    } else {
                        delete objectSignajs[events[i]];
                    }
                }
            }

            return this;
        },
        signal: function signajs_signal(object, event) {
            var objectEvent, dot, eventName
                , callbacksQueue = []
                , args = Array.prototype.slice.apply(arguments, [2])
                , objectSignajs = signajs_object_property(object);
            ;

            for (objectEvent in objectSignajs) {
                dot = objectEvent.indexOf('.');

                if (dot !== -1)
                    eventName = objectEvent.substr(0, dot);
                else
                    eventName = objectEvent

                if (eventName === event)
                    callbacksQueue.push.apply(
                        callbacksQueue, signajs_event_slots(object, objectEvent)
                    )
            }

            if (callbacksQueue.length) {
                setTimeout(function () {
                    for (var i=0;i<callbacksQueue.length; ++i) {
                        if (typeof(callbacksQueue[i]) === 'function') {
                            callbacksQueue[i].call(object, args)
                        }
                    }
                }, 0);
            }

            return this;
        }
    };

    signajs.SignableObject = function SignableObject() {}
    signajs.SignableObject.prototype.on = function signajs_connect_proto(events, callback) {
        signajs.connect(this, events, callback);
        return this;
    };
    signajs.SignableObject.prototype.off = function signajs_disconnect_proto(events, callback) {
        signajs.disconnect(this, events, callback);
        return this;
    };
    signajs.SignableObject.prototype.fire = function signajs_signal_proto(event, data) {
        signajs.signal.apply(
            this, Array.prototype.slice.call(arguments, [])
        );

        return this;
    };

    return signajs;
})();
