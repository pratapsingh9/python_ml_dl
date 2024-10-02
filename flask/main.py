from flask import Flask
import jsoni
app = Flask(__name__)

@app.route('/')
def check():
    return 'lwda'

if __name__ == "__main__":
    app.run(port=3000 , host='localhost')