/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { BroadcastEventListener } from "../eventing/broadcast.event.listener";
import { ConnectionStatus } from "./connection.status";
import { Subject } from "rxjs/Subject";
var SignalRConnection = (function () {
    function SignalRConnection(jConnection, jProxy, zone, configuration) {
        this._jProxy = jProxy;
        this._jConnection = jConnection;
        this._zone = zone;
        this._errors = this.wireUpErrorsAsObservable();
        this._status = this.wireUpStatusEventsAsObservable();
        this._configuration = configuration;
    }
    Object.defineProperty(SignalRConnection.prototype, "errors", {
        get: /**
         * @return {?}
         */
        function () {
            return this._errors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignalRConnection.prototype, "status", {
        get: /**
         * @return {?}
         */
        function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SignalRConnection.prototype.start = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ jTransports = this.convertTransports(this._configuration.transport);
        var /** @type {?} */ $promise = new Promise(function (resolve, reject) {
            _this._jConnection
                .start({
                jsonp: _this._configuration.jsonp,
                transport: jTransports,
                withCredentials: _this._configuration.withCredentials,
            })
                .done(function () {
                console.log('Connection established, ID: ' + _this._jConnection.id);
                console.log('Connection established, Transport: ' + _this._jConnection.transport.name);
                resolve(_this);
            })
                .fail(function (error) {
                console.log('Could not connect');
                reject('Failed to connect. Error: ' + error.message); // ex: Error during negotiation request.
            });
        });
        return $promise;
    };
    /**
     * @return {?}
     */
    SignalRConnection.prototype.stop = /**
     * @return {?}
     */
    function () {
        this._jConnection.stop();
    };
    Object.defineProperty(SignalRConnection.prototype, "id", {
        get: /**
         * @return {?}
         */
        function () {
            return this._jConnection.id;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} method
     * @param {...?} parameters
     * @return {?}
     */
    SignalRConnection.prototype.invoke = /**
     * @param {?} method
     * @param {...?} parameters
     * @return {?}
     */
    function (method) {
        var _this = this;
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        if (method == null) {
            throw new Error('SignalRConnection: Failed to invoke. Argument \'method\' can not be null');
        }
        this.log("SignalRConnection. Start invoking '" + method + "'...");
        var /** @type {?} */ $promise = new Promise(function (resolve, reject) {
            (_a = _this._jProxy).invoke.apply(_a, [method].concat(parameters)).done(function (result) {
                _this.log("'" + method + "' invoked succesfully. Resolving promise...");
                resolve(result);
                _this.log("Promise resolved.");
            })
                .fail(function (err) {
                console.log("Invoking '" + method + "' failed. Rejecting promise...");
                reject(err);
                console.log("Promise rejected.");
            });
            var _a;
        });
        return $promise;
    };
    /**
     * @template T
     * @param {?} listener
     * @return {?}
     */
    SignalRConnection.prototype.listen = /**
     * @template T
     * @param {?} listener
     * @return {?}
     */
    function (listener) {
        var _this = this;
        if (listener == null) {
            throw new Error('Failed to listen. Argument \'listener\' can not be null');
        }
        this.log("SignalRConnection: Starting to listen to server event with name " + listener.event);
        this._jProxy.on(listener.event, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this._zone.run(function () {
                var /** @type {?} */ casted = null;
                if (args.length > 0) {
                    casted = /** @type {?} */ (args[0]);
                }
                ;
                _this.log('SignalRConnection.proxy.on invoked. Calling listener next() ...');
                listener.next(casted);
                _this.log('listener next() called.');
            });
        });
    };
    /**
     * @template T
     * @param {?} event
     * @return {?}
     */
    SignalRConnection.prototype.listenFor = /**
     * @template T
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event == null || event === '') {
            throw new Error('Failed to listen. Argument \'event\' can not be empty');
        }
        var /** @type {?} */ listener = new BroadcastEventListener(event);
        this.listen(listener);
        return listener;
    };
    /**
     * @param {?} transports
     * @return {?}
     */
    SignalRConnection.prototype.convertTransports = /**
     * @param {?} transports
     * @return {?}
     */
    function (transports) {
        if (transports instanceof Array) {
            return transports.map(function (t) { return t.name; });
        }
        return transports.name;
    };
    /**
     * @return {?}
     */
    SignalRConnection.prototype.wireUpErrorsAsObservable = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ sError = new Subject();
        this._jConnection.error(function (error) {
            //this._zone.run(() => {  /*errors don't need to run in a  zone*/
            sError.next(error);
            //});
        });
        return sError;
    };
    /**
     * @return {?}
     */
    SignalRConnection.prototype.wireUpStatusEventsAsObservable = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ sStatus = new Subject();
        // aggregate all signalr connection status handlers into 1 observable.
        // handler wire up, for signalr connection status callback.
        this._jConnection.stateChanged(function (change) {
            _this._zone.run(function () {
                sStatus.next(new ConnectionStatus(change.newState));
            });
        });
        return sStatus.asObservable();
    };
    /**
     * @template T
     * @param {?} listener
     * @param {...?} args
     * @return {?}
     */
    SignalRConnection.prototype.onBroadcastEventReceived = /**
     * @template T
     * @param {?} listener
     * @param {...?} args
     * @return {?}
     */
    function (listener) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log('SignalRConnection.proxy.on invoked. Calling listener next() ...');
        var /** @type {?} */ casted = null;
        if (args.length > 0) {
            casted = /** @type {?} */ (args[0]);
        }
        this._zone.run(function () {
            listener.next(casted);
        });
        this.log('listener next() called.');
    };
    /**
     * @param {...?} args
     * @return {?}
     */
    SignalRConnection.prototype.log = /**
     * @param {...?} args
     * @return {?}
     */
    function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._jConnection.logging === false) {
            return;
        }
        console.log(args.join(', '));
    };
    return SignalRConnection;
}());
export { SignalRConnection };
function SignalRConnection_tsickle_Closure_declarations() {
    /** @type {?} */
    SignalRConnection.prototype._status;
    /** @type {?} */
    SignalRConnection.prototype._errors;
    /** @type {?} */
    SignalRConnection.prototype._jConnection;
    /** @type {?} */
    SignalRConnection.prototype._jProxy;
    /** @type {?} */
    SignalRConnection.prototype._zone;
    /** @type {?} */
    SignalRConnection.prototype._configuration;
}
//# sourceMappingURL=signalr.connection.js.map