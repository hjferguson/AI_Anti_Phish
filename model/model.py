import pandas as pd
from flask import jsonify

from sklearn.svm import SVC
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline

import os

CLASSIFIER = None


def train_model():
    """Tains the model, should be run at the beginning of the execution to have the classifier loaded.

    Returns:
        dict: A dictionary with the classifier reports.
    """
    df = pd.read_csv("./data/phising-set.csv")
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
    # print(X, y, sep="\n\n")
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
        return jsonify({"error": "Classifier is not loaded."})

    probs = CLASSIFIER.predict_proba(pack)
    pred = CLASSIFIER.predict(pack)
    return jsonify({"probabilities": probs, "prediction": pred})


# data = []
# data.append(rawd)
# # for _ in range(10):
# #     data.append(rawd)

# print(type(np.array(data)))
# probs = classifier.predict_proba(data)
# pred = classifier.predict(data)


# print(pred, probs)

# # print(accuracy_score(y_test, y_pred))
# # print(confusion_matrix(y_test, y_pred))
# # print(classification_report(y_test, pred))

# # Create the Pipeline
# # SVM = Pipeline([("tfidf", TfidfVectorizer()), ("SVM", SVC(C=100, gamma="auto"))])

# # SVM.fit(X_train, y_train)
# # s_ypred = SVM.predict(x_test)
# # print(accuracy_score(y_test, s_ypred))
