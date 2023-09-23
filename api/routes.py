from flask import Blueprint, request, jsonify

api_bp = Blueprint("api", __name__)


@api_bp.route("/test")
def test():
    return "test"


@api_bp.route("/ingest_email", methods=["POST"])
def ingest_email():
    """
    Ingests an email into the system for analysis
    """
    try:
        data = request.get_json()
        print(data)
        # set http response code to 200
        return (
            jsonify({"status": "success", "message": "Email ingested successfully"}),
            201,
        )
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": "Error ingesting email"}), 500


def parse_email(email_data):
    """
    Parses an email and returns the relevant information
    """
    data = email_data.decode("utf-8")
    # split the email at @ sign
    user, domain = data.split("@")
    print(user, domain)
    return (user, domain)


@api_bp.route("/ingest_url", methods=["POST"])
def ingest_url():
    """
    Ingests a URL into the system for analysis
    """
    try:
        data = request.get_json()
        print(data)
        # set http response code to 200
        return (
            jsonify({"status": "success", "message": "URL ingested successfully"}),
            201,
        )
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": "Error ingesting URL"}), 500


def parse_url(url_data):
    """
    Parses a URL and returns the relevant information
    """
    data = url_data.decode("utf-8")
    # split the url at .com
    domain, path = data.split(".com")
    scheme, domain = domain.split("//")
