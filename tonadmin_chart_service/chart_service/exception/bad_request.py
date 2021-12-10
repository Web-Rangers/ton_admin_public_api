from chart_service.exception.base_exception import BaseAPIException


class BadRequestException(BaseAPIException):

    def __init__(self, message):
        self.__message = message
        self.__status_code = 400

    def status_code(self):
        return self.__status_code

    def message(self):
        return self.__message
