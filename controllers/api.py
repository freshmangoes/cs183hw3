# These are the controllers for your ajax api.
#testing 2
def get_msgs():
    """This controller is used to get the msgs.  Follow what we did in lecture 10, to ensure
    that the first time, we get 4 msgs max, and each time the "load more" button is pressed,
    we load at most 4 more msgs."""
    # Implement me!
    start = int(request.vars.start) if request.vars.start is not None else 0
    end = int(request.vars.end) if request.vars.end is not None else 0
    msgs = []
    has_more = False
    rows = db().select(db.msg.ALL, limitby=(start, end + 1))
    for i, r in enumerate(rows):
        if i < end - start:
            p = dict(
                id = r.id,
                # user_email = r.user_email,
                msg_content = r.msg_content,
                # updated_on = r.updated_on,
                # created_on = r.created_on,
            )
            msgs.append(p)
        else:
            has_more = True
    logged_in = auth.user_id is not None
    return response.json(dict(
        msgs = msgs,
        logged_in=logged_in,
        has_more=has_more,
    ))


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature()
def add_msg():
    """Here you get a new msg and add it.  Return what you want."""
    # Implement me!
    p_id = db.msg.insert(
        msg_content = request.vars.msg_content,
        created_on = request.vars.created_on,
        updated_on = request.vars.updated_on,
        user_email = request.vars.user_email,
    )

    p = db.msg(p_id)
    return response.json(dict(msg=p))


@auth.requires_signature()
def del_msg():
    """Used to delete a msg."""
    # Implement me!
    db(db.msg.id == request.vars.msg_id).delete()
    return response.json(dict())
    # return
