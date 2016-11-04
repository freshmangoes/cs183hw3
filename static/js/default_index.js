// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    function get_msgs_url(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return msgs_url + "?" + $.param(pp);
    };

    function edit_msg_url(){

    }

    self.get_msgs = function () {
        $.getJSON(get_msgs_url(0, 4), function (data) {
            self.vue.msgs = data.msgs;
            self.vue.has_more = data.has_more;
            self.vue.logged_in = data.logged_in;
            self.vue.current_user = data.current_user;
        })
    };

    self.get_more = function () {
        var num_msgs = self.vue.msgs.length;
        $.getJSON(get_msgs_url(num_msgs, num_msgs + 4), function (data) {
            self.vue.has_more = data.has_more;
            self.extend(self.vue.msgs, data.msgs);
        });
    };

    self.add_msg_button = function () {
        // The button to add a msg has been pressed.
        self.vue.is_adding_msg = !self.vue.is_adding_msg;
    };

    self.add_msg = function () {
        // The submit button to add a msg has been added.
        $.post(add_msg_url,
            {
                msg_content: self.vue.form_msg_content,
            },
            function (data) {
                $.web2py.enableElement($("#add_msg_submit"));
                self.vue.msgs.unshift(data.msg);
            }
        )
    };

    self.edit_msg_button = function(msg_id, msg_content){
        self.vue.is_editing_msg = true;
        self.vue.msg_content = msg_content;
        self.vue.edit_id = msg_id;
        self.vue.edit_msg_content = msg_content;
        console.log(self.vue.edit_id);
    };

    self.edit_msg = function(){
        $.post(edit_msg_url,
        {
            msg_id: self.vue.edit_id,
            msg_content: self.vue.edit_msg_content
        },
        function(data){
            $.web2py.enableElement($("#edit_msg_submit"));
            self.vue.is_editing_msg = false;
            self.get_msgs();
        })
    };

    self.edit_cancel = function(){
        self.vue.is_editing_msg = false;
        self.vue.is_adding_msg = false;
        self.vue.edit_id = -1;
    };

    self.delete_msg = function(msg_id) {
        $.post(del_msg_url,
            {
                msg_id: msg_id
            },
            function () {
                var idx = null;
                for (var i = 0; i < self.vue.msgs.length; i++) {
                    if (self.vue.msgs[i].id === msg_id) {
                        idx = i + 1;
                        break;
                    }
                }
                if (idx) {
                    self.vue.msgs.splice(idx - 1, 1);
                }
            }
        )
    };

    self.is_user = function(){

    }

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            msgs: [],
            is_adding_msg: false,
            is_editing_msg: false,
            has_more: false,
            logged_in: false,
            form_msg_content: null,
            edit_id: null,
            is_msg_author: false,
        },
        methods: {
            get_more: self.get_more,
            add_msg_button: self.add_msg_button,
            add_msg: self.add_msg,
            delete_msg: self.delete_msg,
            edit_msg_button: self.edit_msg_button,
            edit_msg: self.edit_msg,
            edit_cancel: self.edit_cancel,
        }
    });

    self.get_msgs();
    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
