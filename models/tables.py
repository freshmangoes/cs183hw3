# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

import datetime

db.define_table('msg',
                Field('user_email', default=auth.user.email if auth.user_id else None),
                Field('msg_content', 'text'),
                Field('created_on', 'datetime', default=datetime.datetime.utcnow()),
                Field('updated_on', 'datetime', update=datetime.datetime.utcnow()),
                )

# I don't want to display the user email by default in all forms.
db.msg.user_email.readable = db.msg.user_email.writable = False
db.msg.msg_content.requires = IS_NOT_EMPTY()
db.msg.created_on.readable = db.msg.created_on.writable = False
db.msg.updated_on.readable = db.msg.updated_on.writable = False

# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
