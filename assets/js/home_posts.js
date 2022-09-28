{
    //method to submit the form data through mew post using ajax


    let createPost=function(){
        let newPostForm=$('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type:'post',
                url:'/posts/create',
                data:newPostForm.serialize(),
                success:function(data)
                {
                    let newPost=newPostDom(data.data.post);
                    console.log(newPost);
                    $('#post-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button',newPost))
                   // console.log(data);
                    //call the createComment class
                    new PostComments(data.data.post._id);
                    //for toggle likes
                    new ToggleLikes($('.toggle-like-button',newPost));

                    new Noty({
                        theme:'relax',
                        text:"post published",
                        type:'success',
                        layout:'topRight',
                        timeout:1500

                    }).show();

                },error:function(error)
                {
                    console.log(error.responseText);
                }

            })
        })
    }
    //method to create a post in DOM
    let newPostDom=function(post)
    {
        return $(`<li id="post-${post._id }">
  
    <small>
        <a class="delete-post-button " href="/posts/destroy/${post._id}">Delete</a>
    </small>
   
    <p>
        ${post.content}
        <br>
        <small>
            ${post.user.name}

        </small>
        <br>
         <small>
                <a class="toggle-like-button" data-likes="0" href="likes/toggle/?id=${post._id}&type=Post">
                    0Likes
                </a>
        </small>
    </p>
    <div class="post-comment">

      
            <form action="/comments/create" id="new-comment-form" method="POST">
                <textarea name="content" cols="20" rows="2" placeholder="Comments.."></textarea>

                <input type="hidden" name="post" value="<%= post._id %>">
                <input type="submit" value="comment">
            </form>
       
        <div id="post-comment-list">

            <ul id="post-comment-${ post._id }">
              
            </ul>
        </div>
    </div>

</li>`)
    }
    //method to delete a post form DOM
    let deletePost=function(deleteLink)
    {
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type:'get',
                url:$(deleteLink.prop('href')),
                success:function(data){
                    $(`#post-${data.data.post_id}`).remove()
                },
                error:function(error)
                {
                    console.log(error.responseText);
                }
            })
        })
    }
    createPost();
}