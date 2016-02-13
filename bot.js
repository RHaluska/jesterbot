var Botkit = require('./lib/Botkit.js')
var os = require('os');

var controller = Botkit.slackbot({
  debug: false,
});

var version = "0.0.3"
var townName = "HackCWRU"


var songs = ["You ever hear Eye of the Tiger?","I highly recommend Eye of the Tiger.", "Top pick? Eye of the Tiger.",
"I know one that'll blow your mind: Eye of the Tiger.", "The only song I know is Eye of the Tiger.",
"Eye of the Tiger!","What about Eye of the Tiger?","You know what song always pumps me up? Eye of the Tiger.",
"Honestly? Eye of the Tiger.","Experts recommend Eye of the Tiger.","How about Eye of the Tiger?",
"I don't know about you,but I'd love to listen to Eye of the Tiger.","Hmm...Eye of the Tiger.","It's the eye of the tiger, it's the thrill of the fight!"]

var request = require('request');
var url = 'http://api.icndb.com/jokes/random/';

var bot = controller.spawn(
  {
    token:process.env.token
  }
).startRTM();


//message_received is NOT a catch-all! The docs lied to us both.
controller.hears(['^.request_feature (.*)$'],'ambient,direct_mention,mention,direct_message',function(bot,message) {
  var matches = message.text.match(/request_feature (.*)/i);
  feature = matches[1];
  bot.reply(message,"I'll let the dev know that user "+message.user+" has requested " + feature);
  console.log("user "+message.user+" has requested " + feature)
});

controller.hears(['(^.ls$)','help'],'ambient,direct_mention,mention,direct_message',function(bot,message) {
  controller.storage.users.get(message.user,function(err,user) {
      bot.reply(message,"Explicit commands are as follows:\n.name_group <name>\n .identify\n .joke\n .song\n .code \n.request_feature <feature>\n\nI also recognize some non-explicit commands, such as \"Where do your jokes come from?\"")
  });
})

controller.hears(['joke'],'ambient,direct_mention,mention,direct_message',function(bot,message) {
 request('http://api.icndb.com/jokes/random/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var response = JSON.parse(body);
    bot.reply(message, response.value.joke);
  } else {
    bot.reply(message,"Got an error: ", error, ", status code: ", response.statusCode);
  }
});
})

controller.hears(['^.name_group (.*)$'],'ambient,direct_mention,mention,direct_message',function(bot,message) {
  var matches = message.text.match(/name_group (.*)/i);
  townName = matches[1];
  bot.reply(message,"Alright, folks, I'm here to entertain " + townName);
});

controller.hears(['^.identify$','what'],'ambient,direct_mention,mention,direct_message',function(bot,message) {
      bot.reply(message, 'I am a testbot! I am here to entertain the people of '+townName+', and I am version '+version+'! Type .ls to see commands I recognize.');
})

controller.hears(['song'],'ambient,direct_mention,mention,direct_message',function(bot,message) {
      bot.reply(message, songs[Math.floor(Math.random()*songs.length)]);
})

controller.hears(['Chuck Norris'],'ambient,direct_mention,mention,direct_message',function(bot,message) {
      bot.reply(message, 'Chuck Norris is the best! More importantly, the API was easy to work with.');
})

controller.hears(['why'],'ambient,direct_mention,mention,direct_message',function(bot,message) {
      bot.reply(message, 'Because the universe is cruel, and my programmer is limited.');
})

controller.hears(['Eye of the Tiger'],'ambient,direct_mention,mention,direct_message',function(bot,message) {
      bot.reply(message, 'Eye of the Tiger is the best song! But yeah, don\'t worry, more functionality should be coming for my song recommendations.');
})

controller.hears(['hello','hi','hey'],'ambient,direct_mention,mention,direct_message',function(bot,message) {
      bot.reply(message, 'Hey there!');
})

controller.hears(['where'],'ambient,direct_mention,mention,direct_message',function(bot,message) {
      bot.reply(message, 'My jokes are from from the Internet Chuck Norris Database, they have a swell API. My songs come from a local JSON file. I come from questionable use of the Slackbot Botkit.');
})

controller.hears(['code'],'ambient,direct_mention,mention,direct_message',function(bot,message) {
      bot.reply(message, 'I live on Github at https://github.com/RHaluska/jesterbot/blob/master/bot.js.');
})

controller.hears(['shutdown','quit','die'],'ambient,direct_mention,mention,direct_message',function(bot,message) {
      bot.reply(message, 'I can be killed, but not by those words! The shutdown code\'s been sent to the team admin');
})

controller.hears(['blarghlharglwha'],'ambient,direct_mention,mention,direct_message',function(bot,message) {

  bot.startConversation(message,function(err,convo) {
    convo.ask("Howdy, Admin! Please confirm: would you like to shut me down?",[
      {
        pattern: bot.utterances.yes,
        callback: function(response,convo) {
          convo.say("So long, and thanks for all the fish!");
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
