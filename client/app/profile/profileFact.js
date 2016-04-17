angular
  .module('app.profile')
  .factory('Profile', Profile);

Profile.$inject = ['$http'];

function Profile($http) {
  return {
    getProfile: function(user_id) {
      return $http({
          method: 'GET',
          url: '/api/profile/' + user_id
        })
        .then(function(res) {
          return res.data;
        });
    },

    getPosts: function(user_id) {
      return $http({
          method: 'GET',
          url: '/api/profile/posts/' + user_id
        })
        .then(function(res) {
          return res.data;
        });
    },

    addPost: function(user_id, post) {
      return $http({
          method: 'POST',
          url: '/api/profile/posts/' + user_id,
          data: post
        })
        .then(function(res) {
          return res.data;
        });
    },

    addComment: function(user_id, goal_id, post_id, input, friend_id) {
      var comment = {
        friend_id: friend_id || user_id,
        goal_id: goal_id,
        post_id: post_id,
        comment: input
      };
      return $http({
          method: 'POST',
          url: '/api/comment/' + user_id,
          data: comment
        })
        .then(function(res) {
          return res.data;
        });
    },
    /*
    * @param {Object} data - the post object that has a new comment
    * @param currentPosts {Array} - an array of post objects
    * [{
    *   post: post,
    *   comments: [{comment object}]
    *   ..
    * @param currentCount {Object} - object containing key value pair of posts and its number of comments
    * { <post>: <comment count> }
    */
    pushComment: function(data, currentPosts, currentCount) {
      for (var i = 0; i < currentPosts.length; i++) {
        var post = currentPosts[i];
        var last = data.comments.length - 1;
        // find the post that need to updated
        if (post._id === data._id) {
          var newComment = data.comments[last];
          // push the new comment
          post.comments.push(newComment);
          // update current count
          ++currentCount[post.post];
          return;
        }
      }
    },
    /*
    * @param posts {Array} - an array of post objects
    * [{
    *   post: post,
    *   comments: [{comment object}]
    *   ...
    * },
    * {...},{...}]
    *
    * @return {Object} - object containing key value pair of posts and its current number of comments
    * { <post>: <comment count> }
    */
    countComment: function(posts) {
      var count = {};
      posts.forEach(function(post) {
        count[post.post] = post.comments.length;
      });
      return count;
    },
    /*
    * @param currentCount {Object} - object containing key value pair of posts and its number of comments
    * { <post>: <comment count> }
    *
    * @param newCount {Object} - object containing key value pair of posts and its number of comments
    * { <post>: <comment count> }
    * 
    * @param currentPosts {Array} - an array of post objects
    * [{
    *   post: post
    *   comments [{comment object}]
    *   ...
    * },
    * {...},{...}]
    *
    * @param newPosts {Array} - an array of posts objects
    * [{
    *   post: post,
    *   comments: [{comment object}]
    *   ...
    * },
    * {...},{...}]
    */
    checkComment: function(currentCount, newCount, currentPosts, newPosts) {
      for (var post in newCount) {
        // check for any difference in new and current count
        if (newCount[post] !== currentCount[post]) {
          for (var i = 0; i < currentPosts.length; i++) {
            var postObj = currentPosts[i];
            // find the post that needs to be updated
            if (postObj.post === post) {
              // find the new comment in newPosts
              var lastIndex = newPosts[i].comments.length - 1;
              var newComment = newPosts[i].comments[lastIndex];
              // push new comment
              postObj.comments.push(newComment);
              // update currentCount
              currentCount[post] = newCount[post];
            }
          }
        }
      }
    }
  };
}
