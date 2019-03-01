/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

const LaunchHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechOutput = GET_FACT_MESSAGE;

    console.log(1111111111111111);

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt('')
      .getResponse();
  },
};

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const factArr = data;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt('')
      .getResponse();
  },
};

const SaveItemHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'SaveItemIntent');
  },
  handle(handlerInput) {
    const color = handlerInput.requestEnvelope.request.intent.slots.item.value;
    const AWS = require('aws-sdk');
    const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
    AWS.config.update({region: process.env.AWS_REGION});
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    if (sessionAttributes.color == undefined) {
      sessionAttributes.color =  [color];
    } else {
      sessionAttributes.color.push(color);
    }
    
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        'color': {S: color}
      }
    };

    ddb.putItem(params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('Wrote '+ color +' to DynamoDB Colors table');
      }
    });
  
    return handlerInput.responseBuilder
      .speak('Wrote '+ color +' to DynamoDB Colors table')
      .reprompt('')
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Your colors are '+ handlerInput.attributesManager.getSessionAttributes().color.toString() + STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'Glados Quotes';
const GET_FACT_MESSAGE = 'Welcome' ;
const HELP_MESSAGE = 'Help message';
const HELP_REPROMPT = 'Help message reprompt';
const STOP_MESSAGE = 'Stop message';

const data = [
  'Random glados quote one',
  'Random glados quote two',
  'Random glados quote three',
];

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchHandler,
    GetNewFactHandler,
    SaveItemHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
