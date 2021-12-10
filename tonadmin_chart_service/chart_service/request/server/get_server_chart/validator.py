from chart_service.exception import BadRequestException


def validate(ip, port, time_period, time_value):
    try:
        if not (ip or port or time_period or time_value) or\
                (ip is None or port is None or time_period is None or time_value is None):
            raise ''
        int(time_value)
        int(port)
        str(time_period)
        str(ip)

    except:
        raise BadRequestException({
            'message': "validation error",
            'content': "request args must be contain: "
                       "-time_period(str) | -time_value(int) | -ip(server_ip) | port(number server_port)"
        })
