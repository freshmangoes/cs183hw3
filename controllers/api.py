import random

def index():
    pass

def get_msgs():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    msgs = []
    has_more = False
    rows = db().select(db.msg.ALL, orderby=~db.msg.created_on, limitby=(start_idx, end_idx + 1))

    for i, r in enumerate(rows):
        if i < end_idx - start_idx:

            if is_author(r.created_by):
                r.is_user = True
            else:
                r.is_user = False

            p = dict(
                id = r.id,
                msg_content = r.msg_content,
                created_by = get_username(r.created_by),
                created_on = r.created_on,
                is_user = r.is_user,
                updated_on = r.updated_on
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
    )
    p = db.msg(p_id)
    p.created_by = get_username(get_user_email())
    p.created_on = p.created_on
    p.updated_on = p.updated_on
    p.is_user = True
    return response.json(dict(msg=p))

@auth.requires_signature()
def del_msg():
    db(db.msg.id == request.vars.msg_id).delete()
    return "ok"

@auth.requires_signature()
def edit_msg():
    p = db.msg(request.vars.msg_id)
    p.msg_content = request.vars.msg_content
    p.updated_on = datetime.datetime.utcnow()
    p.update_record()
    return response.json(dict(msg=p))


