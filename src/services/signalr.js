/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { SignalRConfiguration } from "./signalr.configuration";
import { SignalRConnection } from "./connection/signalr.connection";
import { NgZone, Injectable, Inject } from "@angular/core";
import { SIGNALR_JCONNECTION_TOKEN } from "./signalr.module";
var SignalR = (function () {
    function SignalR(configuration, zone, jHubConnectionFn) {
        this._configuration = configuration;
        this._zone = zone;
        this._jHubConnectionFn = jHubConnectionFn;
    }
    /**
     * @param {?=} options
     * @return {?}
     */
    SignalR.prototype.createConnection = /**
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        var /** @type {?} */ status;
        var /** @type {?} */ configuration = this.merge(options ? options : {});
        try {
            var /** @type {?} */ serializedQs = JSON.stringify(configuration.qs);
            var /** @type {?} */ serializedTransport = JSON.stringify(configuration.transport);
            if (configuration.logging) {
                console.log("Creating connecting with...");
                console.log("configuration:[url: '" + configuration.url + "'] ...");
                console.log("configuration:[hubName: '" + configuration.hubName + "'] ...");
                console.log("configuration:[qs: '" + serializedQs + "'] ...");
                console.log("configuration:[transport: '" + serializedTransport + "'] ...");
            }
        }
        catch (/** @type {?} */ err) { }
        // create connection object
        var /** @type {?} */ jConnection = this._jHubConnectionFn(configuration.url);
        jConnection.logging = configuration.logging;
        jConnection.qs = configuration.qs;
        // create a proxy
        var /** @type {?} */ jProxy = jConnection.createHubProxy(configuration.hubName);
        // !!! important. We need to register at least one function otherwise server callbacks will not work.
        jProxy.on('noOp', function () { });
        var /** @type {?} */ hubConnection = new SignalRConnection(jConnection, jProxy, this._zone, configuration);
        return hubConnection;
    };
    /**
     * @param {?=} options
     * @return {?}
     */
    SignalR.prototype.connect = /**
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        return this.createConnection(options).start();
    };
    /**
     * @param {?} overrides
     * @return {?}
     */
    SignalR.prototype.merge = /**
     * @param {?} overrides
     * @return {?}
     */
    function (overrides) {
        var /** @type {?} */ merged = new SignalRConfiguration();
        merged.hubName = overrides.hubName || this._configuration.hubName;
        merged.url = overrides.url || this._configuration.url;
        merged.qs = overrides.qs || this._configuration.qs;
        merged.logging = this._configuration.logging;
        merged.jsonp = overrides.jsonp || this._configuration.jsonp;
        merged.withCredentials = overrides.withCredentials || this._configuration.withCredentials;
        merged.transport = overrides.transport || this._configuration.transport;
        return merged;
    };
    SignalR.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SignalR.ctorParameters = function () { return [
        { type: SignalRConfiguration, },
        { type: NgZone, },
        { type: Function, decorators: [{ type: Inject, args: [SIGNALR_JCONNECTION_TOKEN,] },] },
    ]; };
    return SignalR;
}());
export { SignalR };
function SignalR_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    SignalR.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    SignalR.ctorParameters;
    /** @type {?} */
    SignalR.prototype._configuration;
    /** @type {?} */
    SignalR.prototype._zone;
    /** @type {?} */
    SignalR.prototype._jHubConnectionFn;
}
//# sourceMappingURL=signalr.js.map