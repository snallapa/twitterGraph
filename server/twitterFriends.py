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
def getFriends(userId="703981800029294592"):
	# friends = list(map(lambda user: user.AsDict(),twitter.GetFriends(user_id=userId)))
	# nodes = [{"id" : str(friend["id"]), "img": friend["profile_image_url"].replace("_normal","")} for friend in friends]
	# currentUser = twitter.UsersLookup([int(userId)])[0].AsDict()
	# print(currentUser)
	# nodes = [{"id": str(currentUser["id"]), "img": currentUser["profile_image_url"].replace("_normal","")}] + nodes
	# edges = [{"source": 0, "target": i} for i in range(1, len(nodes))]
	# #return jsonify({"nodes": nodes, "edges": [{"source": 0, "target": 2}]})
	with open('fixture.json') as data_file:
		data = json.load(data_file)
	return jsonify(data)
