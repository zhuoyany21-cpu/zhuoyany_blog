// BLOG POSTS!!!!!!!!!



/* LOAD POSTS WHEN THE PAGE OPENS */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadPosts();

    }
);



/* GET SAVED POSTS */

function getSavedPosts() {

    const savedPosts =
        localStorage.getItem(
            "blogPosts"
        );


    if (
        savedPosts === null
    ) {

        return [];

    }


    try {

        return JSON.parse(
            savedPosts
        );

    } catch (
        error
    ) {

        localStorage.removeItem(
            "blogPosts"
        );

        return [];

    }

}



/* SAVE POSTS */

function savePosts(
    posts
) {

    localStorage.setItem(
        "blogPosts",
        JSON.stringify(posts)
    );

}



/* PUBLISH A NEW BLOG POST */

function publishPost() {


    // GET INPUT!!

    const titleInput =
        document.getElementById(
            "postTitle"
        );

    const contentInput =
        document.getElementById(
            "postContent"
        );


    // GET WHAT USER TYPED (me)

    const title =
        titleInput.value.trim();

    const content =
        contentInput.value.trim();


    // MAKE SURE THERE IS A TLTE FOR THE BLOG POST!

    if (
        title === ""
    ) {

        alert(
            "Please enter a title for your post."
        );

        titleInput.focus();

        return;

    }


    // MUST HAVE CONTENT INSIDE THE POST!

    if (
        content === ""
    ) {

        alert(
            "Please write something for your post."
        );

        contentInput.focus();

        return;

    }


    // needed a way to insert date without having to manually do it like the title! (not sure if it works, hopefully it does)
    // tested it and it does in fact work!! (asked claude how to do it)


    // AUTO INSERT DATE

    const today =
        new Date();


    const date =
        today.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    // CREATE A UNIQUE ID FOR THE POST

    const postData = {

        id:
            Date.now(),

        date:
            date,

        title:
            title,

        content:
            content

    };


    // CREATE THE POST

    createPost(
        postData
    );


    // SAVE THE NEW POST

    const posts =
        getSavedPosts();


    posts.unshift(
        postData
    );


    savePosts(
        posts
    );


    // CLEAR INPUT!

    titleInput.value = "";

    contentInput.value = "";

}



/* CREATE THE BLOG POST ON THE PAGE */

function createPost(
    postData
) {

    const feed =
        document.getElementById(
            "postFeed"
        );


    if (
        !feed
    ) {

        return;

    }


    // THE PARAGRAPH FORMAT

    const post =
        document.createElement(
            "article"
        );


    post.className =
        "post-card";


    post.dataset.id =
        postData.id;


    const date =
        document.createElement(
            "div"
        );


    date.className =
        "post-date";


    date.textContent =
        postData.date;


    const title =
        document.createElement(
            "h2"
        );


    title.className =
        "post-title";


    title.textContent =
        postData.title;


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "post-content";


    const paragraphs =
        postData.content.split(
            /\n\s*\n/
        );


    paragraphs.forEach(
        function(paragraph) {


            if (
                paragraph.trim() !== ""
            ) {

                const p =
                    document.createElement(
                        "p"
                    );


                p.innerHTML =
                    paragraph
                        .trim()
                        .replace(
                            /\n/g,
                            "<br>"
                        );


                content.appendChild(
                    p
                );

            }

        }
    );


    // DELETE BUTTON

    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.className =
        "delete-post-button";


    deleteButton.textContent =
        "Delete Post";


    deleteButton.onclick =
        function() {

            deletePost(
                deleteButton
            );

        };


    // PUT EVERYTHING INTO THE POST!!!!!!!!!!!

    post.appendChild(
        date
    );

    post.appendChild(
        title
    );

    post.appendChild(
        content
    );

    post.appendChild(
        deleteButton
    );


    // didnt know whether to put new post at the bottom or top. thought to many other wesbsites, new post on top was final decision
    //NEW POST GOES ON TOP

    feed.prepend(
        post
    );

}



/* LOAD SAVED POSTS */

function loadPosts() {


    // GET POSTS THAT WERE DELETED

    const deletedPosts =
        JSON.parse(
            localStorage.getItem(
                "deletedPosts"
            )
        ) || [];


    // REMOVE ORIGINAL POSTS THAT WERE DELETED

    document
        .querySelectorAll(
            ".post-card[data-id]"
        )
        .forEach(
            function(post) {

                const postID =
                    post.dataset.id;


                if (
                    deletedPosts.includes(
                        postID
                    )
                ) {

                    post.remove();

                }

            }
        );


    // GET SAVED POSTS

    const posts =
        getSavedPosts();


    if (
        posts.length === 0
    ) {

        return;

    }


    // LOAD POSTS IN THE CORRECT ORDER

    posts
        .slice()
        .reverse()
        .forEach(
            function(postData) {

                createPost(
                    postData
                );

            }
        );

}



/* following up on the blog.html, needed a spot the delete the post in case of mess up
// DELETE BLOG POST */

function deletePost(
    button
) {


    // confirm to delete, could have been accident!!!


    // ASK FOR DELETION CONFIRMATION

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this post?"
        );


    // DO NOT DELETE IF CONFIRMATION WAS NO

    if (
        !confirmDelete
    ) {

        return;

    }


    // FIND THE POST

    const post =
        button.closest(
            ".post-card"
        );


    if (
        !post
    ) {

        return;

    }


    // GET THE POST ID

    const postID =
        post.dataset.id;


    // GET ALL SAVED POSTS

    const posts =
        getSavedPosts();


    // REMOVE THE POST FROM SAVED POSTS

    const updatedPosts =
        posts.filter(
            function(savedPost) {

                return String(
                    savedPost.id
                ) !== String(
                    postID
                );

            }
        );


    // SAVE THE UPDATED POSTS

    savePosts(
        updatedPosts
    );


    // REMEMBER THAT THIS POST WAS DELETED

    const deletedPosts =
        JSON.parse(
            localStorage.getItem(
                "deletedPosts"
            )
        ) || [];


    if (
        !deletedPosts.includes(
            String(
                postID
            )
        )
    ) {

        deletedPosts.push(
            String(
                postID
            )
        );

    }


    localStorage.setItem(
        "deletedPosts",
        JSON.stringify(
            deletedPosts
        )
    );


    // DELETE THE POST

    post.remove();

}



/* VIDEO POSTS */
// realized too late that this was not neccessary, however claude helped with most of this, most difficult was connectino to my own files


function postVideo(
    event
) {


    const file =
        event.target.files[0];


    if (
        !file
    ) {

        return;

    }


    const feed =
        document.getElementById(
            "videoFeed"
        );


    const today =
        new Date();


    const date =
        today.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    // this is the point where i thought to myself "why did i do this"

    const videoURL =
        URL.createObjectURL(
            file
        );


    const post =
        document.createElement(
            "article"
        );


    post.className =
        "video-post";


    const videoDate =
        document.createElement(
            "div"
        );


    videoDate.className =
        "video-post-date";


    videoDate.textContent =
        date;


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "video-wrapper";


    const video =
        document.createElement(
            "video"
        );


    const source =
        document.createElement(
            "source"
        );


    source.src =
        videoURL;


    source.type =
        file.type;


    video.appendChild(
        source
    );


    const playButton =
        document.createElement(
            "button"
        );


    playButton.className =
        "play-button";


    playButton.setAttribute(
        "aria-label",
        "Play video"
    );


    wrapper.appendChild(
        video
    );


    wrapper.appendChild(
        playButton
    );


    post.appendChild(
        videoDate
    );


    post.appendChild(
        wrapper
    );


    feed.prepend(
        post
    );



    // PLAY BUTTON FOR VID
    // not sure if works yet, havent tested it yet, havent inserted a vidio yet


    playButton.addEventListener(
        "click",
        function() {


            video.play();


            playButton.style.display =
                "none";


        }
    );


    // SHOW PLAY BUTTON WHEN VIDEO IS PAUSED
    // needed a way to turn vid back on (claude suggested)


    video.addEventListener(
        "pause",
        function() {


            if (
                !video.ended
            ) {


                playButton.style.display =
                    "flex";


            }

        }
    );


    // VID ENDS, SHOW BUTTON AGAIN
    // needed a way to restart video (claude suggested)


    video.addEventListener(
        "ended",
        function() {


            playButton.style.display =
                "flex";


        }
    );


    // CLEAR THE FILE INPUT

    event.target.value = "";

}

// NOT SURE WHETHER OR NOT TO HAVE DELETE VIDEO, MIGHT NOT POST VIDEO EITHER WAY (MAYBE)
