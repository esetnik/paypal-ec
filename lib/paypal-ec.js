/*!
 * paypal-ec
 * Copyright(c) 2012 Mason Chang <mason@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 * A simple API wrapper for PayPal's Express Checkout
 */

var NVPRequest = require( './nvprequest' );
var url        = require( 'url' );

var SANDBOX_URL = 'www.sandbox.paypal.com';
var REGULAR_URL = 'www.paypal.com';

/**
 * Creates a new PayPalEC.
 * @class Represents a PayPal Express Checkout.
 * @requires nvprequest
 * @param {Object} cred Contain the credential required to make an API call
 * @param {Object} opts Contain the options like sandbox and version
 * @constructor
 */
var PayPalEC = function ( cred, opts ){
  this.nvpreq  = new NVPRequest( cred, opts );
  if(!opts){
    new Error("opts missing");
  }

  this.sandbox = opts.sandbox ? opts.sandbox : false;
  this.useraction = opts.useraction;
  this.mobile = opts.mobile ? opts.mobile : false;
};

/**
 * Determine to use sandbox mode or not.
 * @public
 * @this {PayPalEC}
 * @param {Bool} bool Whether to use sandbox mode or not.
 */
PayPalEC.prototype.use_sandbox = function ( bool ){
  this.nvpreq.use_sandbox( bool );
  this.sandbox = ( bool == true );
};

/**
 * Make a `SetExpressCheckout` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contain all the payment information.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.set = function ( params, callback ){
  var self = this;

  this.nvpreq.execute( 'SetExpressCheckout', params, function ( err, data ){
    if( !err ){
      data.PAYMENTURL = url.format({
        protocol : 'https:',
        host     : ( self.sandbox ) ? SANDBOX_URL : REGULAR_URL,
        pathname : '/cgi-bin/webscr',
        query    : {
          cmd   : '_express-checkout',
          useraction : self.useraction,
          token : data.TOKEN
        }

      });
    }

    callback( err, data );
  });
};

/**
 * Make a `GetExpressCheckoutDetails` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contain the token for the payment.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.get_details = function ( params, callback ){
  this.nvpreq.execute( 'GetExpressCheckoutDetails', params, callback );
};

/**
 * Make a `DoExpressCheckoutPayment` API call to PayPal.
 * @public
 * @this {PayPalEC}
 * @param {Object} params Contain the token and all the payment information.
 * @param {Function} callback Function to get called when done.
 */
PayPalEC.prototype.do_payment = function ( params, callback ){
  this.nvpreq.execute( 'DoExpressCheckoutPayment', params, callback );
};

module.exports = PayPalEC;


