from flask import Flask, render_template, request
from detectors import detect_ai_text, check_grammar

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    result = None
    grammar_issues = None

    if request.method == "POST":
        user_text = request.form["user_text"]
        result = detect_ai_text(user_text)
        grammar_issues = check_grammar(user_text)

    return render_template("index.html", result=result, grammar_issues=grammar_issues)

if __name__ == "__main__":
    app.run(debug=True)

"""what is wrong with this code?"""