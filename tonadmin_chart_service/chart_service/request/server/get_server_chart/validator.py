from chart_service.exception import BadRequestException


def validate(time_period, time_value):
    if not(time_period and time_value and time_value.is_integer()):
        raise BadRequestException({
            'message': "validation error",
            'content': 'request args must be contain:\n -time_period(str)\n -time_value'
        })
