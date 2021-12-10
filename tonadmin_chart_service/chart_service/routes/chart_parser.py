from flask import Flask, request, jsonify, make_response
from chart_service.request.server import get_server_chart, get_fullchart
from chart_service.request.service import get_chart_by_page, get_service_chart
from chart_service.exception import BaseAPIException


def callback(method, *args, **kwargs):
    try:
        response = jsonify({'chart':method(*args, **kwargs)})
        response.status_code = 200
        return response
    except BaseAPIException as ex:
        print(ex)
        response = jsonify(ex.message())
        response.status_code = ex.status_code()
        return response
    except Exception as ex:
        response = jsonify({"message": "server_error"})
        response.status_code = 500
        return response


def chart_router(app: Flask):

    @app.route("/api/v1/chart/server/server_chart", methods=['GET'])
    def get_chart_by_server():

        response = callback(get_server_chart,
                            request.args.get('ip'),
                            request.args.get('port'),
                            request.args.get('time_period'),
                            request.args.get('time_value'))
        return response

    @app.route("/api/v1/chart/server", methods=['GET'])
    def get_full_server():
        response = callback(get_fullchart,
                            request.args.get('time_period'),
                            request.args.get('time_value'))
        return response

    @app.route("/api/v1/chart/service/pagechart", methods=['GET'])
    def get_page_chart():
        response = callback(get_chart_by_page,
                            request.args.get('service_name'),
                            request.args.get('page_name'),
                            request.args.get('time_period'),
                            request.args.get('time_value'))
        return response

    @app.route("/api/v1/chart/service", methods=['GET'])
    def get_service_chart_():
        response = callback(get_service_chart,
                            request.args.get('service_name'),
                            request.args.get('time_period'),
                            request.args.get('time_value'))
        return response

