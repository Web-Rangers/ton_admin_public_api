import os

from flask import Flask
from dotenv import load_dotenv
from routes.chart_parser import chart_router

load_dotenv()

app = Flask(__name__)

if __name__ == '__main__':
    chart_router(app)
    app.run(port=os.environ.get('PORT'))