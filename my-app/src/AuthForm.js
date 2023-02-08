import "./AuthForm.css"
import {useDispatch} from "react-redux"
import {useEffect, useState} from "react";
import {login} from "./store/authSlice";
import {useNavigate} from "react-router-dom";
import {fetchUsers} from "./store/postsSlice";

function AuthForm() {
    const navigator = useNavigate();
    const dispatch = useDispatch();

    // const auth = useSelector(state => state.auth.auth);

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        dispatch(fetchUsers())

    }, [dispatch])

    const authHandler = () => {
        if (username !== '' && password !== '') {
            dispatch(login({username, password}));
            navigator(`/`);
            console.log("AUTH")
        }
        else alert("Заполните все поля");

    }

    return (
        <div className="login-wrapper">
            <h1>Вход в систему</h1>
            <form onSubmit={authHandler}>
                <div>
                    <p>Логин</p>
                    <input type="text" onChange={e => setUserName(e.target.value)}/>
                </div>
                <div>
                    <p>Пароль</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </div>
                <div>
                    <button type="submit">Войти</button>
                </div>
            </form>
        </div>
    )
}

export default AuthForm;