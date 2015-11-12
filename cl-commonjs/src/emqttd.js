
var Paho = require('emqttws');

function Emqttd() {
	this.client = null;
	this.onConnected = null;
}

// called when the client connects
function onConnect(context) {
  // Once a connection has been made, make a subscription and send a message.
  console.log("Client Connected");
  this.onConnected && this.onConnected(context);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("Connection Lost: "+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log('Message Recieved: Topic: ', message.destinationName, '. Payload: ', message.payloadString, '. QoS: ', message.qos);
  this.onMsgArrived && this.onMsgArrived(message.payloadString);
}

Emqttd.prototype.connect = function(hostname, port, clientId) {
    console.info('Connecting to Server: Hostname: ', hostname, '. Port: ', port, '. Client ID: ', clientId);
    this.client = new Paho.MQTT.Client(hostname, Number(port), clientId);
    
    // set callback handlers
    this.client.onConnectionLost = onConnectionLost;
    this.client.onMessageArrived = onMessageArrived.bind(this);

    // connect the client
    this.client.connect({
    	onSuccess: onConnect.bind(this),
    	cleanSession: false,
        invocationContext: {host : hostname, port: port, clientId: clientId}
    });
}

Emqttd.prototype.disconnect = function() {
    console.info('Disconnecting from Server');
    this.client.disconnect();
}


Emqttd.prototype.publish = function(topic, qos, message) {
    console.info('Publishing Message: Topic: ', topic, '. QoS: ' + qos + '. Message: ', message);
    message = new Paho.MQTT.Message(message);
    message.destinationName = topic;
    message.qos = Number(qos);
    this.client.send(message);
}


Emqttd.prototype.subscribe = function(topic, qos) {
    console.info('Subscribing to: Topic: ', topic, '. QoS: ', qos);
    this.client.subscribe(topic, {qos: Number(qos)});
}

Emqttd.prototype.unsubscribe = function(topic) {
    console.info('Unsubscribing from ', topic);
    this.client.unsubscribe(topic, {
         onSuccess: unsubscribeSuccess,
         onFailure: unsubscribeFailure,
         invocationContext: {topic : topic}
    });
}


function unsubscribeSuccess(context){
    console.info('Successfully unsubscribed from ', context.invocationContext.topic);
}

function unsubscribeFailure(context){
    console.info('Failed to  unsubscribe from ', context.invocationContext.topic);
}

module.exports = new Emqttd();

