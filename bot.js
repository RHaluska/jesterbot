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



controller.hears(['(^.ls$)','help'],'ambient,direct_message,direct_mention,mention',function(bot,message) {
  controller.storage.users.get(message.user,function(err,user) {
      bot.reply(message,"Explicit commands are as follows:\n.name_group <name>\n .identify\n .joke\n .catpic\n .song\n .code");
  });
})

controller.hears(['joke'],'ambient,direct_message,direct_mention,mention',function(bot,message) {
 request('http://api.icndb.com/jokes/random/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var response = JSON.parse(body);
    bot.reply(message, response.value.joke);
  } else {
    bot.reply(message,"Got an error: ", error, ", status code: ", response.statusCode);
  }
});
})

controller.hears(['joke'],'ambient,direct_message,direct_mention,mention',function(bot,message) {
 request('http://api.icndb.com/jokes/random/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var response = JSON.parse(body);
    bot.reply(message, response.value.joke);
  } else {
    bot.reply(message,"Got an error: ", error, ", status code: ", response.statusCode);
  }
});
})

controller.hears(['^.name_town (.*)$'],'ambient,direct_message,direct_mention,mention',function(bot,message) {
  var matches = message.text.match(/name_town (.*)/i);
  townName = matches[1];
  bot.reply(message,"Alright, folks, I'm here to entertain " + townName);
});

controller.hears(['^.identify$','what'],'ambient,direct_message,direct_mention,mention',function(bot,message) {
      bot.reply(message, 'I am a testbot! I am here to entertain the people of '+townName+'. I have been running for ' + uptime + ', and I am version 0.0.1! Type .ls to see commands I recognize.');
})

controller.hears(['Chuck Norris'],'ambient,direct_message,direct_mention,mention',function(bot,message) {
      bot.reply(message, 'Chuck Norris is the best!');
})

controller.hears(['why'],'ambient,direct_message,direct_mention,mention',function(bot,message) {
      bot.reply(message, 'Because the universe is cruel and uncaring.');
})

controller.hears(['who'],'ambient,direct_message,direct_mention,mention',function(bot,message) {
      bot.reply(message, 'I\'m jester_bot, and my programmer is pretty easy to find!');
})

controller.hears(['Eye of the Tiger'],'ambient,direct_message,direct_mention,mention',function(bot,message) {
      bot.reply(message, 'Eye of the Tiger is the only song you\'ll ever need!');
})

controller.hears(['where'],'ambient,direct_message,direct_mention,mention',function(bot,message) {
      bot.reply(message, 'My jokes are from from the Internet Chuck Norris Database, they have a swell API. My songs come from a local JSON file. I come from a questionable implementation of the Slackbot Botkit.');
})

controller.hears(['code'],'ambient,direct_message,direct_mention,mention',function(bot,message) {
      bot.reply(message, '');
})

controller.hears(['shutdown','quit','die'],'ambient,direct_message,direct_mention,mention',function(bot,message) {
      bot.reply(message, 'I can be killed, but not by those words! The shutdown code's been sent to the team admin, );
})

controller.hears(['blarghlharglwha'],'ambient,direct_message,direct_mention,mention',function(bot,message) {

  bot.startConversation(message,function(err,convo) {
    convo.ask("Are you sure you want me to shutdown?",[
      {
        pattern: bot.utterances.yes,
        callback: function(response,convo) {
          convo.say("Bye!");
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
          convo.say("*Phew!*");
          convo.next();
        }
      }
    ])
  })
})

function formatUptime(uptime) {
  var unit = 'second';
  if (uptime > 60) {
    uptime = uptime / 60;
    unit = 'minute';
  }
  if (uptime > 60) {
    uptime = uptime / 60;
    unit = 'hour';
  }
  if (uptime != 1) {
    unit = unit +'s';
  }

  uptime = uptime + ' ' + unit;
  return uptime;
}
