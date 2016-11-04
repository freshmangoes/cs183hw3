import random

def index():
    pass

def get_msgs():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    msgs = []
    has_more = False
    rows = db().select(db.msg.ALL, limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            p = dict(
                id = r.id,
                msg_content = r.msg_content,
                username = r.username,
                time_created = r.created_on,
            )
            msgs.append(p)
        else:
            has_more = True
    logged_in = auth.user_id is not None
    return response.json(dict(
        msgs=msgs,
        logged_in=logged_in,
        has_more=has_more,
    ))

@auth.requires_signature()
def add_msg():
    p_id = db.msg.insert(
        msg_content = request.vars.msg_content,
        # created_on = request.vars.created_on,
        # updated_on = request.vars.updated_on,
        # user_email = request.vars.user_email,
    )
    p = db.msg(p_id)
    return response.json(dict(msg=p))

@auth.requires_signature()
def del_msg():
    db(db.msg.id == request.vars.msg_id).delete()
    return "ok"
