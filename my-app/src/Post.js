import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Link, Switch, useParams} from "react-router-dom";
import {Card, Col, Row, Button, Spinner} from "react-bootstrap";
import './bootstrap-5.1.3-dist/css/bootstrap.min.css';
import './Post.css';
import noAvatar from "./noAvatar.jpg";
import {
    fetchPost,
    fetchUsers,
    fetchLikesForPost,
    fetchCommentsForPost,
    setRefComment, delRefComment, postComment, postRefComment, postLike, hideComment, changeStatus
} from "./store/postsSlice"
import {useDispatch, useSelector} from "react-redux";
import {check, logout} from "./store/authSlice";

function Post() {
    let param = useParams().id;

    const auth = useSelector(state => state.auth)
    const posts = useSelector(state => state.posts)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(check())
        dispatch(fetchPost(param))
        dispatch(fetchUsers())
        dispatch(fetchLikesForPost(param))
        dispatch(fetchCommentsForPost(param))
    }, [dispatch, param])

    let newComments = [];
    let finalComments = [];

    let j = 0;

    for (let i = 0; i < posts.commentsForPost.length; i++) {
        if (posts.commentsForPost[i].ref === null) {
            newComments.push([])
            newComments[j].push(posts.commentsForPost[i])
            j++;
        }
    }

    for (let i = 0; i < posts.commentsForPost.length; i++) {
        if (posts.commentsForPost[i].ref != null) {
            for (let k = 0; k < newComments.length; k++) {
                if (newComments[k][0].id === posts.commentsForPost[i].ref) {
                    newComments[k].push(posts.commentsForPost[i])
                }
                else {
                    for (let n = 1; n < newComments[k].length; n++) {
                        if (newComments[k][n].id === posts.commentsForPost[i].ref) {
                            newComments[k].push(posts.commentsForPost[i])
                        }
                    }
                }
            }
        }
    }

    for (let i = 0; i < newComments.length; i++) {
        for (let j = 0; j < newComments[i].length; j++) {
            finalComments.push(newComments[i][j])
        }
    }

    const commentHandler = () => {
        if (document.getElementById('area1').value !== '') {
            if (posts.refComment.commId && posts.refComment.postId === posts.post.id) {
                dispatch(postRefComment([posts.post.id, auth.user.id, posts.refComment.commId, document.getElementById('area1').value]))
            }
            else {
                dispatch(postComment([posts.post.id, auth.user.id, document.getElementById('area1').value]))
            }
        }
        else alert("Напишите комментарий!");
    }

    return (
        <>
            <div className='left'>
                <Link to='/' className='usernameText'>&nbsp;&nbsp;&nbsp;Главная страница</Link>
                <a>&nbsp;/ {posts.post.title}</a>
            </div>


            <div className='right'>
                {auth.auth === 1 ?
                    <>
                        <Link to={`/post/${posts.post.id}`} className="btn btn-primary button m-2" onClick={() => dispatch(logout(auth.username))}>Выйти</Link>
                        <Link to={`/user/${auth.user.id}`}>
                            {posts.users.find(user => user.id === auth.user.id)?.image != null &&
                                <img src={posts.users.find(user => user.id === auth.user.id)?.image} width='40px' height='40px' className='avatar m-2'></img>
                            }
                            {posts.users.find(user => user.id === auth.user.id)?.image == null &&
                                <img src={noAvatar} width='40px' height='40px' className='avatar m-2'></img>
                            }
                        </Link>
                        <Link to={`/user/${auth.user.id}`} className="usernameText">{posts.users.find(user => user.id === auth.user.id)?.username}</Link>
                    </>:
                    <>
                        <Link to={`/registration/`} className="btn btn-primary button m-2">Зарегистрироваться</Link>
                        <Link to={`/auth/`} className="btn btn-primary button m-2">Авторизоваться</Link>
                        <img width='40px' height='40px' className='avatar m-2 invisible'></img>
                    </>
                }
            </div>

            <hr className='divider'/>

            {posts.loading &&  <div className="d-flex justify-content-center"><Spinner animation="border"/></div> }
            {!posts.loading && posts.error ? <div>{posts.error}</div>: null}
            {!posts.loading && posts.post.title ? (
                <div className="postContainer">
                    <Card className='card m-2'>
                        <Card.Header>
                            <div className="left">
                                <Link to={`/user/${posts.post.author}`}>
                                    {posts.users.find(user => user.id === posts.post.author)?.image != null &&
                                        <img src={posts.users.find(user => user.id === posts.post.author)?.image} width='40px' height='40px' className='avatar'></img>
                                    }
                                    {posts.users.find(user => user.id === posts.post.author)?.image == null &&
                                        <img src={noAvatar} width='40px' height='40px' className='avatar'></img>
                                    }
                                </Link>
                                <Link to={`/user/${posts.post.author}`} className="usernameText">{posts.users.find(user => user.id === posts.post.author)?.username}</Link>
                            </div>
                            <div className='right'>{new Date(posts.post.post_datetime).toLocaleString('ru')}</div>
                        </Card.Header>

                        <Card.Body>
                            {posts.post.image != null && <Card.Img className='left postMainImage' src={posts.post.image}></Card.Img>}

                            <Card.Title>
                                <h3 className='m-1'>{posts.post.title}</h3>
                            </Card.Title>
                            <div className='m-1'>{posts.post.descript}</div>
                            <div className='m-1'>Количество лайков: {posts.likesForPost.filter(like => like.post === posts.post.id).length}</div>
                            <div className='m-1'>Количество комментариев: {posts.commentsForPost.filter(comment => comment.post === posts.post.id).length}</div>

                        </Card.Body>
                        {auth.auth === 1 && auth.user.is_admin === 0 && !posts.likesForPost.find(like => like.user === auth.user.id) ?
                            <Card.Footer>
                                <div>
                                    <Link to={`/post/${posts.post.id}`} onClick={() => dispatch(postLike([posts.post.id, auth.user.id]))} className="btn btn-primary button m-2">Поставить лайк 👍</Link>
                                </div>
                            </Card.Footer>
                         : null}
                        {auth.auth === 1 && auth.user.is_admin === 1 && posts.post.post_status === 0 && !posts.likesForPost.find(like => like.user === auth.user.id) ?
                            <Card.Footer>
                                <div>
                                    <Link to={`/post/${posts.post.id}`} onClick={() => dispatch(postLike([posts.post.id, auth.user.id]))} className="btn btn-primary button m-2">Поставить лайк 👍</Link>
                                    <Link to={`/`} onClick={() => dispatch(changeStatus([posts.post.id, "2", "", ""]))} className="btn btn-primary button m-2" >❌</Link>
                                    <Link to={`/post/${posts.post.id}`} onClick={() => dispatch(changeStatus([posts.post.id, "1", "", param]))} className="btn btn-primary button m-2" >✅</Link>
                                </div>
                            </Card.Footer>
                            : null}
                        {auth.auth === 1 && auth.user.is_admin === 1 && posts.post.post_status === 0 && posts.likesForPost.find(like => like.user === auth.user.id) ?
                            <Card.Footer>
                                <div>
                                    <Link to={`/`} onClick={() => dispatch(changeStatus([posts.post.id, "2", "", ""]))} className="btn btn-primary button m-2" >❌</Link>
                                    <Link to={`/post/${posts.post.id}`} onClick={() => dispatch(changeStatus([posts.post.id, "1", "", param]))} className="btn btn-primary button m-2" >✅</Link>
                                </div>
                            </Card.Footer>
                            : null}
                        {auth.auth === 1 && auth.user.is_admin === 1 && posts.post.post_status === 1 && !posts.likesForPost.find(like => like.user === auth.user.id) ?
                            <Card.Footer>
                                <div>
                                    <Link to={`/post/${posts.post.id}`} onClick={() => dispatch(postLike([posts.post.id, auth.user.id]))} className="btn btn-primary button m-2">Поставить лайк 👍</Link>
                                    <Link to={`/`} onClick={() => dispatch(changeStatus([posts.post.id, "2", "", ""]))} className="btn btn-primary button m-2" >❌</Link>
                                </div>
                            </Card.Footer>
                            : null}
                        {auth.auth === 1 && auth.user.is_admin === 1 && posts.post.post_status === 1 && posts.likesForPost.find(like => like.user === auth.user.id) ?
                            <Card.Footer>
                                <div>
                                    <Link to={`/`} onClick={() => dispatch(changeStatus([posts.post.id, "2", "", ""]))} className="btn btn-primary button m-2" >❌</Link>
                                </div>
                            </Card.Footer>
                            : null}
                    </Card>




                    {finalComments.map((comment, index) => {
                        return (
                            <div key={index}>
                                {comment.ref == null &&
                                    <Card className='card m-2'>
                                            <Card.Header>
                                                <div className='left'>
                                                    <Link to={`/user/${posts.post.author}`}>
                                                        {posts.users.find(user => user.id === comment.author)?.image != null &&
                                                            <img src={posts.users.find(user => user.id === comment.author)?.image} width='40px' height='40px' className='avatar'></img>
                                                        }
                                                        {posts.users.find(user => user.id === comment.author)?.image == null &&
                                                            <img src={noAvatar} width='40px' height='40px' className='avatar'></img>
                                                        }
                                                    </Link>
                                                    <Link to={`/user/${comment.author}`} className="usernameText">{posts.users.find(user => user.id === comment.author)?.username}</Link>
                                                    <div className='usernameText'>&nbsp;оставил(а) комментарий</div>
                                                </div>
                                                <div className='right'>{new Date(comment.comm_datetime).toLocaleString('ru')}</div>
                                            </Card.Header>
                                        <Card.Body>
                                            <div className='m-1'>{comment.is_normal === 1 ? comment.comm: "[Комментарий удален]"}</div>
                                        </Card.Body>

                                        {auth.auth === 1 && comment.is_normal === 1 ?
                                                <Card.Footer>
                                                    <div>
                                                        <Link to={`/post/${posts.post.id}`} onClick={() => dispatch(setRefComment({postId: posts.post.id, commId: comment.id, authorId: comment.author}))} className="btn btn-primary button m-2">Ответить</Link>
                                                    </div>
                                                    {auth.user.is_admin === 1 &&
                                                        <Link to={`/post/${posts.post.id}`} onClick={() => dispatch(hideComment([posts.post.id, comment.id]))} className="btn btn-primary button m-2">Удалить комментарий ❌</Link>
                                                    }
                                                </Card.Footer>
                                                : null
                                            }
                                    </Card>

                                }
                                {comment.ref != null &&
                                    <div className='commentsContainer'>
                                        <Card className='card m-2'>
                                                <Card.Header>
                                                    <div className='left'>
                                                        <Link to={`/user/${posts.post.author}`}>
                                                            {posts.users.find(user => user.id === comment.author)?.image != null &&
                                                                <img src={posts.users.find(user => user.id === comment.author)?.image} width='40px' height='40px' className='avatar'></img>
                                                            }
                                                            {posts.users.find(user => user.id === comment.author)?.image == null &&
                                                                <img src={noAvatar} width='40px' height='40px' className='avatar'></img>
                                                            }
                                                        </Link>
                                                        <Link to={`/user/${comment.author}`} className="usernameText">{posts.users.find(user => user.id === comment.author)?.username}</Link>
                                                        <div className='usernameText'>&nbsp;ответил(а)&nbsp;</div>
                                                        <Link to={`/user/${posts.commentsForPost.find(com => com.id === comment.ref).author}`} className="usernameText">{posts.users.find(user => user.id === posts.commentsForPost.find(com => com.id === comment.ref).author).username}</Link>
                                                    </div>
                                                    <div className='right'>{new Date(comment.comm_datetime).toLocaleString('ru')}</div>
                                                </Card.Header>
                                            <Card.Body>
                                                <div className='m-1'>{comment.is_normal === 1 ? comment.comm: "[Комментарий удален]"}</div>
                                            </Card.Body>

                                            {auth.auth === 1 && comment.is_normal === 1 ?
                                                <Card.Footer>
                                                    <div>
                                                        <Link to={`/post/${posts.post.id}`} onClick={() => dispatch(setRefComment({postId: posts.post.id, commId: comment.id, authorId: comment.author}))} className="btn btn-primary button m-2">Ответить</Link>
                                                    </div>
                                                    {auth.user.is_admin === 1 &&
                                                        <Link to={`/post/${posts.post.id}`} onClick={() => dispatch(hideComment([posts.post.id, comment.id]))} className="btn btn-primary button m-2">Удалить комментарий ❌</Link>
                                                    }
                                                </Card.Footer>
                                                : null
                                            }
                                        </Card>
                                    </div>



                                }
                            </div>
                        )
                    })}

                    {auth.auth === 1 &&
                        <Card className="card m-2">
                            <Card.Header>
                                <div className='left'>
                                    <Link to={`/user/${auth.user.id}`}>
                                        {posts.users.find(user => user.id === auth.user.id)?.image != null &&
                                            <img src={posts.users.find(user => user.id === auth.user.id)?.image} width='40px' height='40px' className='avatar'></img>
                                        }
                                        {posts.users.find(user => user.id === auth.user.id)?.image == null &&
                                            <img src={noAvatar} width='40px' height='40px' className='avatar'></img>
                                        }
                                    </Link>
                                    <Link to={`/user/${auth.user.id}`} className="usernameText">{posts.users.find(user => user.id === auth.user.id)?.username}</Link>
                                    <div className='usernameText'>&nbsp;оставил(а) комментарий</div>
                                </div>
                                {posts.refComment.commId && posts.refComment.postId === posts.post.id &&
                                    <div className='right'>
                                        <div className='usernameText'>ответ на комментарий {posts.users.find(user => user.id === posts.refComment.authorId)?.username}&nbsp;</div>
                                        <Link to={`/post/${posts.post.id}`} onClick={() => dispatch(delRefComment())} className="usernameText">❌</Link>
                                    </div>


                                }
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    <textarea className='textarea m-2' id='area1' placeholder='Введите комментарий'></textarea>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <div>
                                    <Link to={`/post/${posts.post.id}`} onClick={commentHandler} className="btn btn-primary button m-2">Опубликовать комментарий</Link>
                                </div>
                            </Card.Footer>
                        </Card>
                    }
                </div>
            ) : null
            }
        </>
    )
}

export default Post;