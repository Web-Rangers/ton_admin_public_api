const time_parts = {
    'h': [60,60],
    'd': [60*60,24],
    'm': [60*60*24,30],
    'y': [60*60*24*30,12]
}

export default function get_time(t_p,t_v){
    if (t_v>1){
        return [time_parts[t_p][0]*time_parts[t_p][1],t_v-1]
    }
    return [time_parts[t_p][0],time_parts[t_p][1]*t_v]
}