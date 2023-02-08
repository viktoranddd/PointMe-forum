import React, {useEffect, useState} from 'react';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import {Card, Col, Row, Button, Spinner} from "react-bootstrap";
import './bootstrap-5.1.3-dist/css/bootstrap.min.css';
import './Posts.css';
import noAvatar from "./noAvatar.jpg";
import {useSelector, useDispatch} from "react-redux"
import {
    fetchPosts,
    fetchUsers,
    fetchLikes,
    fetchComments,
    postPost, hidePost, changeStatus
} from "./store/postsSlice"
import InputField from "./InputField";
import {check, logout} from "./store/authSlice";


function Posts() {
    const posts = useSelector(state => state.posts)
    const auth = useSelector(state => state.auth)
    const [search, setSearch] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(check())
        dispatch(fetchPosts(''))
        dispatch(fetchUsers())
        dispatch(fetchLikes())
        dispatch(fetchComments())
    }, [dispatch])

    const postHandler = () => {
        if (document.getElementById('areaTitle').value !== '', document.getElementById('areaDescript').value !== '') {
            dispatch(postPost([auth.user.id, document.getElementById('areaTitle').value, document.getElementById('areaDescript').value]));
        }
        else alert("Заполните все поля!");
    }

    return (
        <div>
            <div className='left'>
                <Link to='/' className='usernameText'>&nbsp;&nbsp;&nbsp;Главная страница</Link>

            </div>

            <div className='right'>
                {auth.auth === 1 ?
                    <>
                        <Link to={`/`} className="btn btn-primary button m-2" onClick={() => dispatch(logout(auth.username))}>Выйти</Link>
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

            <div className='container d-flex justify-content-center mb-3'>
                <InputField value={search}
                            setValue={setSearch}
                            loading={posts.loading}
                            onSubmit={() => dispatch(fetchPosts(search))}></InputField>
            </div>


            {posts.loading &&  <div className="d-flex justify-content-center"><Spinner animation="border"/></div> }
            {!posts.loading && posts.error ? <div>{posts.error}</div>: null}
            {!posts.loading && posts.posts.length ? (
                <div className='container'>
                    <div className='d-flex justify-content-center mb-3'>
                    </div>
                    {posts.posts.map((post, index) => {
                        return (
                            <Card key={index} className="card m-2">
                                    <Card.Header>
                                        <div className="left">
                                            <Link to={`/user/${post.author}`}>
                                                {posts.users.find(user => user.id === post.author)?.image != null &&
                                                    <img src={posts.users.find(user => user.id === post.author)?.image} width='40px' height='40px' className='avatar'></img>
                                                }
                                                {posts.users.find(user => user.id === post.author)?.image == null &&
                                                    <img src={noAvatar} width='40px' height='40px' className='avatar'></img>
                                                }
                                            </Link>
                                            <Link to={`/user/${post.author}`} className="usernameText">{posts.users.find(user => user.id === post.author)?.username}</Link>
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
                                        <Link to={`/`} onClick={() => dispatch(changeStatus([post.id, "2", "", ""]))} className="btn btn-primary button m-2" >❌</Link>
                                        <Link to={`/`} onClick={() => dispatch(changeStatus([post.id, "1", "", ""]))} className="btn btn-primary button m-2" >✅</Link>
                                    </Card.Footer> : null
                                }
                                {auth.auth === 1 && auth.user.is_admin === 1 && post.post_status === 1 ?
                                    <Card.Footer>
                                        <Link to={`/`} onClick={() => dispatch(changeStatus([post.id, "2", "", ""]))} className="btn btn-primary button m-2" >❌</Link>
                                    </Card.Footer> : null
                                }
                            </Card>
                        )
                    })}



                </div>
            ) : null}

            {auth.auth === 1 &&
                <div className="container">
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
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <textarea className='textarea m-2' id='areaTitle' placeholder='Введите заголовок'></textarea>
                                <textarea className='textarea m-2' id='areaDescript' placeholder='Введите описание'></textarea>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <div>
                                <Link to={`/`} onClick={postHandler} className="btn btn-primary button m-2">Опубликовать</Link>
                            </div>
                        </Card.Footer>
                    </Card>
                </div>
            }
        </div>
    )

}

export default Posts;