# These are the controllers for your ajax api.
#testing 2
def get_posts():
    """This controller is used to get the posts.  Follow what we did in lecture 10, to ensure
    that the first time, we get 4 posts max, and each time the "load more" button is pressed,
    we load at most 4 more posts."""
    # Implement me!
    start = int(request.vars.start) if request.vars.start is not None else 0
    end = int(request.vars.end) if request.vars.end is not None else 0
    posts = []
    has_more = False
    rows = db().select(db.post.ALL, limitby=(start, end + 1))
    for i, r in enumerate(rows):
        if i < end - start:
            p = dict(
                id = r.id,
                # user_email = r.user_email,
                post_content = r.post_content,
                # updated_on = r.updated_on,
                # created_on = r.created_on,
            )
            posts.append(p)
        else:
            has_more = True
    logged_in = auth.user_id is not None
    return response.json(dict(
        posts = posts,
        logged_in=logged_in,
        has_more=has_more,
    ))


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature()
def add_post():
    """Here you get a new post and add it.  Return what you want."""
    # Implement me!
    p_id = db.post.insert(
        post_content = request.vars.post_content,
        created_on = request.vars.created_on,
        updated_on = request.vars.updated_on,
        user_email = request.vars.user_email,
    )

    p = db.post(p_id)
    return response.json(dict(post=p))


@auth.requires_signature()
def del_post():
    """Used to delete a post."""
    # Implement me!
    db(db.post.id == request.vars.post_id).delete()
    return response.json(dict())
    # return
