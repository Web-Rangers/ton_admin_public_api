from chart_service.exception import BadRequestException


def validate(service_name, time_period, time_value):
    try:
        if not (service_name or time_value or time_period) or (service_name is None or time_value is None or time_period is None):
            raise ''
        int(time_value)
        str(time_period)
        str(service_name)
    except:
        raise BadRequestException({
            'message': "validation error",
            'content': 'request args must be contain: - service_name(str) '
                       '|-time_period(str) | -time_value(int)'
        })
