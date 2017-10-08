from flask import Flask
import twitter as twitterClient
import json
from flask.json import jsonify

with open('twitterkeys.json') as data_file:    
    data = json.load(data_file)

twitter = twitterClient.Api(consumer_key=data["consumer_key"],
                  consumer_secret=data["consumer_secret"],
                  access_token_key=data["access_token_key"],
                  access_token_secret=data["access_token_secret"],
                  sleep_on_rate_limit=False)

app = Flask(__name__)

@app.route("/friends")
@app.route("/friends/<userId>")
def getFriends(userId=None):
	return jsonify(list(map(lambda user: user.AsDict(),twitter.GetFriends(userId))))
