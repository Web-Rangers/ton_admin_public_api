from datetime import datetime

from chart_service.db import get_database, get_client
from numpy import array

from .. import time_parts_values


def get_service_chart(service_name, time_period, time_value):
    tpv = time_parts_values.get(time_period)
    if tpv:
        t_index, t_value = tpv.get('iarg'), tpv.get('targ')
    else:
        tpv = time_parts_values.get('h')
        t_index, t_value = tpv.get('iarg'), tpv.get('targ')
    db_s = [j.get('name') for j in get_client().list_databases() if not j.get('name').find('tonstatus')]
    now = datetime.now()
    db_s = [i for i in db_s
            if ((now.timestamp()-datetime.strptime(str(i).replace('tonstatus', ''), '%Y-%m-%d').timestamp())/(t_value)) <= (t_index*time_value)]
    result = {}
    for db_name in db_s:
        db = get_database(db_name)
        service = db.get_collection('services').find_one({'name': service_name})

        for page in service.get('pages'):
            data_s = array(list(db.get_collection('servicedatas').find({"service": service.get('_id'), 'page_name': page.get('name'), "$where": """
            function(){
                let now = new Date()
                return ((now.getTime()-this.timestamp)/("""+str(t_value)+"""))<=("""+str(t_index*time_value)+""")  
            }
            """})))
            for data in data_s:

                index = int((now.timestamp() - (data.get('timestamp') / 1000)) / (t_value/1000))

                if not result.get(index):
                    result[index] = []
                length = len(result[index]) - 1

                if data.get('args'):
                    if len(result[index]) > 0 and result[index][length] and result[index][length] != 0:
                        result[index][length] = (result[index][length]+data.get('avg'))/2
                    else:
                        result[index].append(data.get('avg'))
                else:
                    result[index].append(0)

    return result