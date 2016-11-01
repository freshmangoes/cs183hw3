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

    //get posts
    self.get_posts = function(){
        $.getJSON(posts_url(0,4), function(data){
                self.vue.posts = data.posts;
                self.vue.has_more = data.has_more;
                self.vue.logged_in = data.logged_in;
            })
    };

    //get posts url
    function posts_url(start_i, end_i){
        var pp = {
            start_i: start_i,
            end_i: end_i
        };
        return get_posts_url + "?" + $.param(pp);
    }

    //get more
    self.get_more = function() {
        var num_posts = self.vue.posts.length;
        $.getJSON(posts_url(num_posts, num_posts + 4, function(data){
            self.vue.has_more = data.has_more;
            self.extend(self.vue.posts, data.posts);
        }));
    };

    //add post button
    self.add_post_button = function(){
        self.vue.is_adding_post = !self.vue.is_adding_post;
    };

    //add post
    self.add_post = function() {
        $.post(add_post_url,
            {
                // data being sent to server
                text: self.vue.form_text
            },
            function(data){
                $.web2py.enableElement($("#add_post_submit"));
                self.vue.posts.unshift(data.post);
            });
    };

    //delete post
    self.delete_post = function(){
        $.post(del_post_url,
            {
                post_id: post_id
            },
            function(){
                var idx = null;
                for(var i = 0; i < self.vue.tracks.length; i++){
                    if(self.vue.posts[i].id === post_id){
                        idx = i + 1;
                        break;
                    }
                }
                if(idx){
                    self.vue.posts.splice(idx-1, 1);
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
            posts: [],
            is_adding_post: false,
            has_more: false,
            logged_in: false,
            form_text: null
        },
        methods: {
            get_more: self.get_more,
            add_post_button: self.add_post_button,
            add_post: self.add_post,
            delete_post: self.delete_post,
        }

    });

    self.get_posts();
    $("#vue-div").show();


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
