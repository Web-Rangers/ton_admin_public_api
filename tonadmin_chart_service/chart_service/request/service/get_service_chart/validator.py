from chart_service.exception import BadRequestException


def validate(service_name, page_name, time_period, time_value):
    try:
        int(time_value)
        str(page_name)
        str(time_period)
        str(service_name)
    except:
        raise BadRequestException({
            'message': "validation error",
            'content': 'request args must be contain: -page_name(str) | - service_name(str) '
                       '|-time_period(str) | -time_value(int)'
        })
