from flask import Flask, request, jsonify
from chart_service.request.server import get_server_chart, get_fullchart
from chart_service.request.service import get_chart_by_page, get_service_chart
from urllib.parse import urlparse, parse_qs


def chart_router(app: Flask):
    @app.route("/api/v1/chart/server/server_chart", methods=['GET'])
    def get_chart_by_server():
        data = parse_qs(urlparse(request.url).query)
        response = get_server_chart(data.get('ip')[0], int(data.get('port')[0]), data.get('time_period')[0], int(data.get('time_value')[0]))
        return jsonify(response)

    @app.route("/api/v1/chart/server", methods=['GET'])
    def get_full_server():
        data = parse_qs(urlparse(request.url).query)
        response = get_fullchart(data.get('time_period')[0],
                             int(data.get('time_value')[0]))
        return jsonify(response)

    @app.route("/api/v1/chart/service/pagechart", methods=['GET'])
    def get_page_chart():
        data = parse_qs(urlparse(request.url).query)
        print(data)
        response = get_chart_by_page(data.get('service_name')[0], data.get('page_name')[0], data.get('time_period')[0],
                             int(data.get('time_value')[0]))
        return jsonify(response)

    @app.route("/api/v1/chart/service", methods=['GET'])
    def get_service_chart_():
        data = parse_qs(urlparse(request.url).query)
        print(data)
        response = get_service_chart(data.get('service_name')[0], data.get('time_period')[0],
                             int(data.get('time_value')[0]))
        return jsonify(response)

