from flask import Blueprint, request, jsonify
from model.model import predict_email

import socket
import ssl

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
    data = email_data #.decode("utf-8")
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
    return (scheme, domain, path)


@api_bp.route("/check_email", methods=["POST"])
def check_email():
    """
    Checks if an email is a phishing email
    """
    try:
        data = request.get_json()
        # data = parse_email(data["emails"])
        # print(data)

        # pass the data to the model
        # print(data["emails"])
        # print(type(data["emails"]))
        # print(data["subjects"])
        # print(type(data["subjects"]))
        # print(data["body"])
        # print(type(data["body"]))
        res = predict_email(data["emails"], data["subjects"], data["body"])
        print(res)

        # { "probabilities": probs, "prediction": pred }
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Email checked successfully",
                    "result": res,
                }
            ),
            200,
        )

    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": "Error checking email"}), 500


def check_dns(domain):
    """
    Checks if the domain is a valid domain
    """
    # returns tuple (hostname, aliaslist, ipaddrlist)
    DNS_record = socket.gethostbyname_ex(domain)
    print(DNS_record)

    # if the domain is valid, the DNS record will have an IP address
    if not DNS_record[2]:
        return 0

    for ip in DNS_record[2]:
        if ip.startswith("127."):
            return 1
        cert = ssl.get_server_certificate((ip, 443))

        # if the certificate is valid, the domain is valid
        if cert:
            return 1
