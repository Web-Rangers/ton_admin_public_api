from chart_service.exception import BadRequestException


def validate(time_period, time_value):
    try:
        if not (time_value or time_period) or (time_value is None or time_period is None):
            raise ''
        int(time_value)
        str(time_period)
    except:
        raise BadRequestException({
            'message': "validation error",
            'content': 'request args must be contain: -time_period(str) | -time_value(int)'
        })
