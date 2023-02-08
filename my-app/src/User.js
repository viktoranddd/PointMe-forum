import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Link, Switch, useParams} from "react-router-dom";
import {Card, Col, Row, Button, Spinner} from "react-bootstrap";
import './bootstrap-5.1.3-dist/css/bootstrap.min.css';
import './User.css';
import noAvatar from './noAvatar.jpg'
import {useDispatch, useSelector} from "react-redux";
import {changeStatus, fetchComments, fetchLikes, fetchPostsForUser, fetchUser, postPost} from "./store/postsSlice";
import {check, logout} from "./store/authSlice";


function User() {
    let param = useParams().id;

    const auth = useSelector(state => state.auth)
    const posts = useSelector(state => state.posts)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(check())
        dispatch(fetchPostsForUser(param))
        dispatch(fetchUser(param))
        dispatch(fetchLikes())
        dispatch(fetchComments())

    }, [dispatch, param])


    return (
        <div>
            <div className='left'>
                <Link to='/' className='usernameText'>&nbsp;&nbsp;&nbsp;Главная страница</Link>
                <a>&nbsp;/ {posts.user.username}</a>
            </div>

            <div className='right'>
                {auth.auth === 1 ?
                    <>
                        <Link to={`/user/${auth.user.id}`} className="btn btn-primary button m-2" onClick={() => dispatch(logout(auth.username))}>Выйти</Link>
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
            {!posts.loading && posts.user.username ? (
                <div className='userContainer'>
                    <center>
                        {posts.user.image != null && <img className='userMainImage' src={posts.user.image}></img>}
                        {posts.user.image == null && <img className='userMainImage' src={noAvatar}></img>}
                        <h3 className='m-1 mainText'>{posts.user.username}</h3>
                        <div>{posts.user.descript}</div>
                    </center>
                    {posts.postsForUser.map((post, index) => {
                        return (
                            <Card key={index} className="card m-2">
                                    <Card.Header>
                                        <div className="left">
                                            <Link to={`/user/${post.author}`}>
                                                {posts.user.image != null &&
                                                    <img src={posts.user.image} width='40px' height='40px' className='avatar'></img>
                                                }
                                                {posts.user.image == null &&
                                                    <img src={noAvatar} width='40px' height='40px' className='avatar'></img>
                                                }
                                            </Link>
                                            <Link to={`/user/${post.author}`} className="usernameText">{posts.user.username}</Link>
                                        </div>
                                        <div className='right'>{new Date(post.post_datetime).toLocaleString('ru')}</div>
                                    </Card.Header>
                                <Card.Body>

                                {post.image != null && <Card.Img className='left mainImage' src={post.image}></Card.Img>}
                                    <Card.Title>
                                        <h3 className='m-1 mainText'>{post.title}</h3>
                                    </Card.Title>
                                    <div className='m-1 mainText'>Количество лайков: {posts.likes.filter(like => like.post === post.id).length}</div>
                                    <div className='m-1 mainText'>Количество комментариев: {posts.comments.filter(comment => comment.post === post.id).length}</div>
                                    <Link to={`/post/${post.id}`} className="btn btn-primary button" >Открыть обзор</Link>
                                </Card.Body>
                                {auth.auth === 1 && auth.user.is_admin === 1 && post.post_status === 0 ?
                                    <Card.Footer>
                                        <Link to={`/user/${posts.user.id}`} onClick={() => dispatch(changeStatus([post.id, "2", param.toString(), ""]))} className="btn btn-primary button m-2" >❌</Link>
                                        <Link to={`/user/${posts.user.id}`} onClick={() => dispatch(changeStatus([post.id, "1", param.toString(), ""]))} className="btn btn-primary button m-2" >✅</Link>
                                    </Card.Footer> : null
                                }
                                {auth.auth === 1 && auth.user.is_admin === 1 && post.post_status === 1 ?
                                    <Card.Footer>
                                        <Link to={`/user/${posts.user.id}`} onClick={() => dispatch(changeStatus([post.id, "2", param.toString(), ""]))} className="btn btn-primary button m-2" >❌</Link>
                                    </Card.Footer> : null
                                }
                            </Card>

                        )
                    })}
                </div>
            ) : null}
        </div>
    )
}

export default User;