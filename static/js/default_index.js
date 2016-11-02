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


    //enumerate
    var enumerate = function(v){
        var k = 0;
        return v.map(function(e) {e.idx = k++;});
    };

    //get msgs
    self.get_msgs = function(){
        $.getJSON(msgs_url(0,4), function(data){
                self.vue.msgs = data.msgs;
                self.vue.has_more = data.has_more;
                self.vue.logged_in = data.logged_in;
            })
    };

    //get msgs url
    function msgs_url(start, end){
        var pp = {
            start: start,
            end: end
        };
        return get_msgs_url + "?" + $.param(pp);
    }

    //get more
    self.get_more = function() {
        var num_msgs = self.vue.msgs.length;
        $.getJSON(msgs_url(num_msgs, num_msgs + 4, function(data){
            self.vue.has_more = data.has_more;
            self.extend(self.vue.msgs, data.msgs);
        }));
    };

    //add msg button
    self.add_msg_button = function(){
        self.vue.is_adding_msg = !self.vue.is_adding_msg;
    };

    //add msg
    self.add_msg = function() {
        $.post(add_msg_url,
            {
                // data being sent to server
                text: self.vue.form_text
            },
            function(data){
                $.web2py.enableElement($("#add_msg_submit"));
                self.vue.msgs.unshift(data.msg);
            });
    };

    //delete msg
    self.delete_msg = function(){
        $.post(del_msg_url,
            {
                msg_id: msg_id
            },
            function(){
                var idx = null;
                for(var i = 0; i < self.vue.tracks.length; i++){
                    if(self.vue.msgs[i].id === msg_id){
                        idx = i + 1;
                        break;
                    }
                }
                if(idx){
                    self.vue.msgs.splice(idx-1, 1);
                }
            }
        )
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            msgs: [],
            is_adding_msg: false,
            has_more: false,
            logged_in: false,
            form_text: null
        },
        methods: {
            get_more: self.get_more,
            add_msg_button: self.add_msg_button,
            add_msg: self.add_msg,
            delete_msg: self.delete_msg,
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
