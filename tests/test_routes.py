import pytest
from AI_Anti_Phish import create_app
from AI_Anti_Phish.api.routes import check_dns

# create test client


@pytest.fixture(scope="module")
def test_client():
    flask_app = create_app()

    with flask_app.test_client() as testing_client:
        # Establish an application context before running the tests.
        with flask_app.app_context():
            yield testing_client


# test route
def test_route(test_client):
    response = test_client.get("/api/test")
    assert response.status_code == 200
    assert response.data == b"test"


#  test ingest_email_route
def test_ingest_email_success(test_client):
    # Define the data to be sent in the POST request
    email_data = {
        "subject": "Test Email",
        "body": "This is a test email.",
    }

    # Send a POST request to the /ingest_email endpoint
    response = test_client.post("/api/ingest_email", json=email_data)

    # Check the response status code
    assert response.status_code == 201

    # Check the response JSON content
    data = response.get_json()
    assert data["status"] == "success"
    assert data["message"] == "Email ingested successfully"


def test_ingest_email_error(test_client):
    # Simulate an error by sending invalid JSON data
    invalid_data = "This is not valid JSON."

    # Send a POST request to the /ingest_email endpoint with invalid data
    response = test_client.post("/api/ingest_email", data=invalid_data)

    # Check the response status code for an error
    assert response.status_code == 500

    # Check the response JSON content for an error message
    data = response.get_json()
    assert data["status"] == "error"
    assert data["message"] == "Error ingesting email"


def test_check_dns():
    valid_domain = "google.com"
    assert check_dns(valid_domain) == 1


def test_check_dns_invalid():
    invalid_domain = "thisdomaindoesnotexist.com"
    assert check_dns(invalid_domain) == 0
