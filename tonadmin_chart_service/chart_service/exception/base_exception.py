import abc


class BaseAPIException(Exception):
    @abc.abstractmethod
    def status_code(self):
        pass

    @abc.abstractmethod
    def message(self):
        pass

