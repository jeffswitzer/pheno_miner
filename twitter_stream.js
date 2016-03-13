/**
 * Created by Jeff on 2/20/2016.
 */



var server = require('http').createServer(); //handleRequest
var io = require('socket.io')(server);
io.on('connection', function(socket){

    var Twitter = require('./node_modules/twitter');

    var client = new Twitter({
        consumer_key: 'fC7Umco3VMMyqGr7bdjggM1Ve',
        consumer_secret: 'krmzL2AqqZkaKAh6DUC3cyZacVddDHy2d4wJsVwvs0uciZJx9h',
        access_token_key: '2304356810-kqg90tj27svXvqssj9SqHV9alaMWYDu9WA7sN6l',
        access_token_secret: 'bcWgJ6xYigKxj5vIOanADM65ArIZ7wM6jjm2keHht7lqj',
    });

    /**
     * Stream statuses filtered by keyword
     * number of tweets per second depends on topic popularity
     **/
    streamParams = {language: 'en',
        track: 'spring'}

    client.stream('statuses/filter', streamParams,  function(stream){
        stream.on('data', function(tweet) {
            if(tweet.entities['user_mentions'] != null
                && tweet.entities['user_mentions'][0] != null
                && tweet.entities['user_mentions'][0].name != 'Bloomberg Business') {
                if(tweet.coordinates || tweet.geo || tweet.place) {
                    if(tweet.coordinates) {
                        console.log('coordinates: ' + tweet.coordinates)
                    }
                    if(tweet.geo) {
                        console.log('geo: ' + tweet.geo);
                    }
                    //console.log('place: ' + tweet.place);
                    if(tweet.place) {
                        console.log('long: ' + tweet.place.bounding_box.coordinates[0][0][0]);
                        console.log('lat: ' + tweet.place.bounding_box.coordinates[0][0][1]);
                        console.log('country: ' + tweet.place.country);
                        console.log('full_name: ' + tweet.place.full_name);
                        console.log('place_type: ' + tweet.place.place_type);
                    }

                    socket.emit('message', {'message': tweet.text,
                        'lat': tweet.place.bounding_box.coordinates[0][0][1],
                        'long': tweet.place.bounding_box.coordinates[0][0][0]});
                }
                console.log('tweet: ' + tweet.text);
            }
        });

        stream.on('error', function(error) {
            console.log(error);
        });
    });


    //socket.emit('message', {'message': 'hello world'});
    socket.on('event', function(data){});
    socket.on('disconnect', function(){});
});

//Lets start our server
server.listen(3000, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", 3000);
});


