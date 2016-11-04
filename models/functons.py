def get_username(email):
    """Returns a string corresponding to the user first and last names,
    given the user email."""
    u = db(db.auth_user.email == email).select().first()
    if u is None:
        return 'None'
    else:
        return ' '.join([u.first_name, u.last_name])

def is_author(email):
    if auth.is_logged_in() == False:
        return False
    elif auth.user.email == email:
        return True
    else:
        return False