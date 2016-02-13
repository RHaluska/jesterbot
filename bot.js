var Botkit = require('./lib/Botkit.js')
var os = require('os');

var controller = Botkit.slackbot({
  debug: false,
});

var townName = "HackCWRU"

var request = require('request');
var url = 'http://api.icndb.com/jokes/random/';

var bot = controller.spawn(
  {
    token:process.env.token
  }
).startRTM();



controller.hears(['(^.ls$)','help'],'message_received',function(bot,message) {
  controller.storage.users.get(message.user,function(err,user) {
      bot.reply(message,"Explicit commands are as follows:\n.name_group <name>\n .identify\n .joke\n .song\n .code \n.request_feature <feature>");
  });
})

controller.hears(['joke'],'message_received',function(bot,message) {
 request('http://api.icndb.com/jokes/random/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var response = JSON.parse(body);
    bot.reply(message, response.value.joke);
  } else {
    bot.reply(message,"Got an error: ", error, ", status code: ", response.statusCode);
  }
});
})

controller.hears(['^.name_group (.*)$'],'message_received',function(bot,message) {
  var matches = message.text.match(/name_town (.*)/i);
  townName = matches[1];
  bot.reply(message,"Alright, folks, I'm here to entertain " + townName);
});

controller.hears(['^.request_feature (.*)$'],'message_received',function(bot,message) {
  var matches = message.text.match(/name_town (.*)/i);
  feature = matches[1];
  bot.reply(message,"I'll let the dev know that user: "+user+" has requested" + feature);
});

controller.hears(['^.identify$','what'],'message_received',function(bot,message) {
      bot.reply(message, 'I am a testbot! I am here to entertain the people of '+townName+', and I am version 0.0.2! Type .ls to see commands I recognize.');
})

controller.hears(['Chuck Norris'],'message_received',function(bot,message) {
      bot.reply(message, 'Chuck Norris is the best!');
})

controller.hears(['why'],'message_received',function(bot,message) {
      bot.reply(message, 'Because the universe is cruel, and my programmer is limited.');
})

controller.hears(['who'],'message_received',function(bot,message) {
      bot.reply(message, 'JESTER_BOT');
})

controller.hears(['Eye of the Tiger'],'message_received',function(bot,message) {
      bot.reply(message, 'Eye of the Tiger is best song!');
})

controller.hears(['where'],'message_received',function(bot,message) {
      bot.reply(message, 'My jokes are from from the Internet Chuck Norris Database, they have a swell API. My songs come from a local JSON file. I come from a questionable implementation of the Slackbot Botkit.');
})

controller.hears(['code'],'message_received',function(bot,message) {
      bot.reply(message, 'I live on Github at https://github.com/RHaluska/jesterbot/blob/master/bot.js.');
})

controller.hears(['shutdown','quit','die'],'message_received',function(bot,message) {
      bot.reply(message, 'I can be killed, but not by those words! The shutdown code\'s been sent to the team admin');
})

controller.hears(['blarghlharglwha'],'message_received',function(bot,message) {

  bot.startConversation(message,function(err,convo) {
    convo.ask("Howdy, Admin! Please confirm: would you like to shut me down?",[
      {
        pattern: bot.utterances.yes,
        callback: function(response,convo) {
          convo.say("I RIDE TO VALHALLA.");
          convo.next();
          setTimeout(function() {
            process.exit();
          },3000);
        }
      },
      {
        pattern: bot.utterances.no,
        default:true,
        callback: function(response,convo) {
          convo.say("I live, I die, I live again.");
          convo.next();
        }
      }
    ])
  })
})
