from joblib import load, dump
import pandas as pd
from flask import jsonify, Blueprint

from sklearn.svm import SVC
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline

import os

CLASSIFIER = None
PICKLE_CLASSIFIER = "./sklassifier.pkl"


def train_model():
    """Tains the model, must be run at the beginning of the execution to have the classifier loaded.

    Returns:
        dict: A dictionary with the classifier reports.
    """
    global CLASSIFIER
    if os.path.exists(PICKLE_CLASSIFIER):
        CLASSIFIER = load(PICKLE_CLASSIFIER)
        return

    df = pd.read_csv("./model/data/phising-set.csv")
    df.isna().sum()
    df = df.dropna()

    email_type_counts = df["Email Type"].value_counts()
    print(email_type_counts)

    Safe_Email = df[df["Email Type"] == "Safe Email"]
    Phishing_Email = df[df["Email Type"] == "Phishing Email"]
    Safe_Email = Safe_Email.sample(Phishing_Email.shape[0])

    Data = pd.concat([Safe_Email, Phishing_Email], ignore_index=True)

    X = Data["Email Text"].values
    y = Data["Email Type"].values
    X_train, x_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=0
    )

    CLASSIFIER = Pipeline(
        [
            ("tfidf", TfidfVectorizer()),
            ("classifier", RandomForestClassifier(n_estimators=10)),
        ]
    )

    CLASSIFIER.fit(X_train, y_train)
    with open(PICKLE_CLASSIFIER, "wb") as pickle_file:
        dump(CLASSIFIER, pickle_file)

    y_pred = CLASSIFIER.predict(x_test)

    return {
        "accuracy": accuracy_score(y_test, y_pred),
        "confusion": confusion_matrix(y_test, y_pred),
        "report": classification_report(y_test, y_pred),
    }


def predict_email(_sender, _subject, _body):
    """Uses the Classifier model to predict if the email is a phishing email or not.

    Args:
        _sender (str): The email sender
        _subject (str): The email subject
        _body (str): The email body

    Returns:
        Response: A jsonify response for flask with a probabilities array and the prediction.
    """
    pack = f"{_sender}\n{_subject}\n{_body}"
    if not CLASSIFIER:
        return None

    probs = CLASSIFIER.predict_proba([pack])
    pred = CLASSIFIER.predict([pack])
    return jsonify({"probabilities": probs, "prediction": pred})


if __name__ == "__main__":
    train_model()
    res = predict_email(
        "Tiny Content",
        "noreply@naisit.com",
        """Daer Bruno Ramirez Bonilla,

Welcome to the world of programming logic, algorithms, and problem-solving.

Your professor has submitted your email address so you can receive a copy of "The Basics of a Complicated Concepts (Programming Logic)" e-book, published and copyrighted by Naisit (Tiny Content) publishing. This e-book will be updated regularly. You will be notified when a new version is available for you to download. Your copy is watermarked with your name and email address to prevent any illegal distributions.

Please follow the URL to download your e-book.


URL: https://tinycontent.naisit.com/api/download/6327e789937000676d09c666""",
    )

    print(res)
