# import create_app from 

# The app.py file is the entry point for the application. It creates the Flask app and registers the API blueprint.

from flask import Flask
from flask_cors import CORS
from model.model import train_model

def create_app():
    train_model()
    app = Flask(__name__)
    CORS(app)
    from api.routes import api_bp

    # register blueprints here
    app.register_blueprint(api_bp, url_prefix="/api")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)


TRUSTED_DOMAINS = [
    "google.com",
    "facebook.com",
    "twitter.com",
    "linkedin.com",
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "amazon.com",
    "microsoft.com",
    "apple.com",
    "instagram.com",
    "netflix.com",
    "paypal.com",
    "dropbox.com",
    "ebay.com",
    "pinterest.com",
    "wordpress.com",
    "tumblr.com",
    "blogger.com",
    "wikipedia.org",
    "reddit.com",
    "github.com",
    "bitbucket.org",
    "gitlab.com",
    "stackoverflow.com",
    "quora.com",
    "medium.com",
    "slack.com",
    "spotify.com",
    "twitch.tv",
    "tiktok.com",
    "snapchat.com",
    "telegram.org",
    "whatsapp.com",
    "zoom.us",
    "discord.com",
    "airbnb.com",
    "booking.com",
    "expedia.com",
    "tripadvisor.com",
    "cnn.com",
    "bbc.com",
    "nytimes.com",
    "washingtonpost.com",
    "theguardian.com",
    "forbes.com",
    "bloomberg.com",
    "businessinsider.com",
    "techcrunch.com",
    "wired.com",
    "nationalgeographic.com",
    "nasa.gov",
    "imdb.com",
    "rottentomatoes.com",
    "metacritic.com",
    "fandom.com",
    "gamepedia.com",
    "ign.com",
    "gamespot.com",
    "pcgamer.com",
    "pcmag.com",
    "tomshardware.com",
    "cnet.com",
    "arstechnica.com",
    "techradar.com",
    "engadget.com",
    "theverge.com",
    "vice.com",
    "vox.com",
    "usatoday.com",
    "wsj.com",
    "foxnews.com",
    "nbcnews.com",
    "abcnews.go.com",
    "cbsnews.com",
    "huffpost.com",
    "buzzfeed.com",
]
