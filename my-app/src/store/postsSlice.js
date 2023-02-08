import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    posts: [],
    users: [],
    likes: [],
    comments: [],
    post: {},
    user: {},
    authUser: {},
    refComment: {},
    likesForPost: [],
    commentsForPost: [],
    postsForUser: [],
    error: ''
}


export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async function(str, {rejectWithValue}) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/drf/posts?search=${String(str)}`);

            if (!response.ok) {
                throw new Error("Ошибка HTTP: " + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUsers = createAsyncThunk(
    'posts/fetchUsers',
    async function(_, {rejectWithValue}) {
        try {
            const response = await fetch('http://127.0.0.1:8000/drf/users/');

            if (!response.ok) {
                throw new Error("Ошибка HTTP: " + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchLikes = createAsyncThunk(
    'posts/fetchLikes',
    async function(_, {rejectWithValue}) {
        try {
            const response = await fetch('http://127.0.0.1:8000/drf/likes/');

            if (!response.ok) {
                throw new Error("Ошибка HTTP: " + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchComments = createAsyncThunk(
    'posts/fetchComments',
    async function(_, {rejectWithValue}) {
        try {
            const response = await fetch('http://127.0.0.1:8000/drf/comments/');

            if (!response.ok) {
                throw new Error("Ошибка HTTP: " + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPost = createAsyncThunk(
    'posts/fetchPost',
    async function(id, {rejectWithValue}) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/drf/posts/${String(id)}/`);

            if (!response.ok) {
                throw new Error("Ошибка HTTP: " + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUser = createAsyncThunk(
    'posts/fetchUser',
    async function(id, {rejectWithValue}) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/drf/users/${String(id)}/`);

            if (!response.ok) {
                throw new Error("Ошибка HTTP: " + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchLikesForPost = createAsyncThunk(
    'posts/fetchLikesForPost',
    async function(id, {rejectWithValue}) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/drf/likes?post=${String(id)}`);

            if (!response.ok) {
                throw new Error("Ошибка HTTP: " + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCommentsForPost = createAsyncThunk(
    'posts/fetchCommentsForPost',
    async function(id, {rejectWithValue}) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/drf/comments?post=${String(id)}`);

            if (!response.ok) {
                throw new Error("Ошибка HTTP: " + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const postPost = createAsyncThunk(
    'posts/postPost',
    async function([authorId, titleText, descriptText], {rejectWithValue}) {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ author: authorId.toString(), title: titleText.toString(), descript: descriptText.toString() })
            };

            const response1 = await fetch(`http://127.0.0.1:8000/api/post_post/`, requestOptions);

            if (!response1.ok) {
                throw new Error("Ошибка HTTP POST: " + response1.status);
            }

            const response2 = await fetch(`http://127.0.0.1:8000/drf/posts/`);

            if (!response2.ok) {
                throw new Error("Ошибка HTTP GET: " + response2.status);
            }

            const data = await response2.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const postRefComment = createAsyncThunk(
    'posts/postRefComment',
    async function([postId, authorId, refId, commText], {rejectWithValue}) {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post: postId.toString(), author: authorId.toString(), ref: refId.toString(), comm: commText.toString() })
            };
            const response1 = await fetch(`http://127.0.0.1:8000/api/post_comment/`, requestOptions);

            if (!response1.ok) {
                throw new Error("Ошибка HTTP POST: " + response1.status);
            }

            const response2 = await fetch(`http://127.0.0.1:8000/drf/comments?post=${String(postId)}`);

            if (!response2.ok) {
                throw new Error("Ошибка HTTP GET: " + response2.status);
            }

            const data = await response2.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const postComment = createAsyncThunk(
    'posts/postComment',
    async function([postId, authorId, commText], {rejectWithValue}) {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post: postId.toString(), author: authorId.toString(), ref: null, comm: commText.toString() })
            };
            const response1 = await fetch(`http://127.0.0.1:8000/api/post_comment/`, requestOptions);

            if (!response1.ok) {
                throw new Error("Ошибка HTTP POST: " + response1.status);
            }

            const response2 = await fetch(`http://127.0.0.1:8000/drf/comments?post=${String(postId)}`);

            if (!response2.ok) {
                throw new Error("Ошибка HTTP GET: " + response2.status);
            }

            const data = await response2.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const postLike = createAsyncThunk(
    'posts/postLike',
    async function([postId, userId], {rejectWithValue}) {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ post: postId.toString(), user: userId.toString()})
            };
            const response1 = await fetch(`http://127.0.0.1:8000/api/post_like/`, requestOptions);

            if (!response1.ok) {
                throw new Error("Ошибка HTTP POST: " + response1.status);
            }

            const response2 = await fetch(`http://127.0.0.1:8000/drf/likes?post=${String(postId)}`);

            if (!response2.ok) {
                throw new Error("Ошибка HTTP GET: " + response2.status);
            }

            const data = await response2.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const changeStatus = createAsyncThunk(
    'posts/changeStatus',
    async function([postId, postStatus, userId, currentId], {rejectWithValue}) {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ id: postId.toString(), post_status: postStatus.toString() })
            };

            const response1 = await fetch(`http://127.0.0.1:8000/api/change_status/`, requestOptions);

            if (!response1.ok) {
                throw new Error("Ошибка HTTP POST: " + response1.status);
            }

            const response2 = await fetch(`http://127.0.0.1:8000/drf/posts?author=${String(userId)}&id=${String(currentId)}`);

            if (!response2.ok) {
                throw new Error("Ошибка HTTP GET: " + response2.status);
            }

            const data = await response2.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const hideComment = createAsyncThunk(
    'posts/hideComment',
    async function([postId, commId], {rejectWithValue}) {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: commId.toString() })
            };
            const response1 = await fetch(`http://127.0.0.1:8000/api/hide_comment/`, requestOptions);

            if (!response1.ok) {
                throw new Error("Ошибка HTTP POST: " + response1.status);
            }

            const response2 = await fetch(`http://127.0.0.1:8000/drf/comments?post=${String(postId)}`);

            if (!response2.ok) {
                throw new Error("Ошибка HTTP GET: " + response2.status);
            }

            const data = await response2.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPostsForUser = createAsyncThunk(
    'posts/fetchPostsForUser',
    async function(id, {rejectWithValue}) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/drf/posts?author=${String(id)}`);

            if (!response.ok) {
                throw new Error("Ошибка HTTP: " + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setRefComment(state, action) {
            state.refComment = action.payload;
        },
        delRefComment(state) {
            state.refComment = {};
        }
    },
    extraReducers: {
        [fetchPosts.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.loading = false;
            state.posts = action.payload;
            state.error = '';
        },
        [fetchPosts.rejected]: (state, action) => {
            state.loading = false;
            state.posts = [];
            state.error = action.payload;
        },

        [fetchUsers.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [fetchUsers.fulfilled]: (state, action) => {
            state.loading = false;
            state.users = action.payload;
            state.error = '';
        },
        [fetchUsers.rejected]: (state, action) => {
            state.loading = false;
            state.users = [];
            state.error = action.payload;
        },

        [fetchLikes.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [fetchLikes.fulfilled]: (state, action) => {
            state.loading = false;
            state.likes = action.payload;
            state.error = '';
        },
        [fetchLikes.rejected]: (state, action) => {
            state.loading = false;
            state.likes = [];
            state.error = action.payload;
        },

        [fetchComments.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [fetchComments.fulfilled]: (state, action) => {
            state.loading = false;
            state.comments = action.payload;
            state.error = '';
        },
        [fetchComments.rejected]: (state, action) => {
            state.loading = false;
            state.comments = [];
            state.error = action.payload;
        },

        [fetchPost.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [fetchPost.fulfilled]: (state, action) => {
            state.loading = false;
            state.post = action.payload;
            state.error = '';
        },
        [fetchPost.rejected]: (state, action) => {
            state.loading = false;
            state.post = {};
            state.error = action.payload;
        },

        [fetchUser.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [fetchUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = '';
        },
        [fetchUser.rejected]: (state, action) => {
            state.loading = false;
            state.user = {};
            state.error = action.payload;
        },

        [fetchLikesForPost.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [fetchLikesForPost.fulfilled]: (state, action) => {
            state.loading = false;
            state.likesForPost = action.payload;
            state.error = '';
        },
        [fetchLikesForPost.rejected]: (state, action) => {
            state.loading = false;
            state.likesForPost = [];
            state.error = action.payload;
        },

        [fetchCommentsForPost.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [fetchCommentsForPost.fulfilled]: (state, action) => {
            state.loading = false;
            state.commentsForPost = action.payload;
            state.error = '';
        },
        [fetchCommentsForPost.rejected]: (state, action) => {
            state.loading = false;
            state.commentsForPost = [];
            state.error = action.payload;
        },

        [postPost.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [postPost.fulfilled]: (state, action) => {
            state.loading = false;
            state.posts = action.payload;
            state.error = '';
        },
        [postPost.rejected]: (state, action) => {
            state.loading = false;
            state.posts = [];
            state.error = action.payload;
        },

        [postComment.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [postComment.fulfilled]: (state, action) => {
            state.loading = false;
            state.commentsForPost = action.payload;
            state.error = '';
        },
        [postComment.rejected]: (state, action) => {
            state.loading = false;
            state.commentsForPost = [];
            state.error = action.payload;
        },

        [changeStatus.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [changeStatus.fulfilled]: (state, action) => {
            state.loading = false;
            state.posts = action.payload;
            state.postsForUser = action.payload;
            state.post = action.payload[0];
            state.error = '';
        },
        [changeStatus.rejected]: (state, action) => {
            state.loading = false;
            state.posts = [];
            state.postsForUser = [];
            state.post = {};
            state.error = action.payload;
        },

        [hideComment.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [hideComment.fulfilled]: (state, action) => {
            state.loading = false;
            state.commentsForPost = action.payload;
            state.error = '';
        },
        [hideComment.rejected]: (state, action) => {
            state.loading = false;
            state.commentsForPost = [];
            state.error = action.payload;
        },

        [postRefComment.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [postRefComment.fulfilled]: (state, action) => {
            state.loading = false;
            state.commentsForPost = action.payload;
            state.error = '';
        },
        [postRefComment.rejected]: (state, action) => {
            state.loading = false;
            state.commentsForPost = [];
            state.error = action.payload;
        },

        [postLike.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [postLike.fulfilled]: (state, action) => {
            state.loading = false;
            state.likesForPost = action.payload;
            state.error = '';
        },
        [postLike.rejected]: (state, action) => {
            state.loading = false;
            state.likesForPost = [];
            state.error = action.payload;
        },

        [fetchPostsForUser.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [fetchPostsForUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.postsForUser = action.payload;
            state.error = '';
        },
        [fetchPostsForUser.rejected]: (state, action) => {
            state.loading = false;
            state.postsForUser = [];
            state.error = action.payload;
        },
    },
})

export const {loginUser, logoutUser, setRefComment, delRefComment} = postsSlice.actions;
export default postsSlice.reducer