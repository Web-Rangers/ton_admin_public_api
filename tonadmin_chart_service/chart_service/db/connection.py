from pymongo import MongoClient
from chart_service.config import *
__client = None


def get_client():
    return MongoClient(DATABASEURL)


def get_database(database):
    return get_client()[database]






