import "./AuthForm.css"
import {register} from "./store/authSlice"
import {useDispatch, useSelector} from "react-redux"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    fetchUsers
} from "./store/postsSlice"

function RegForm() {
    const posts = useSelector(state => state.posts)

    const navigator = useNavigate();
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [descript, setDescript] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        dispatch(fetchUsers())

    }, [dispatch])

    const authHandler = () => {
        if (username !== '' && password !== '' && !posts.users.find(user => user.username === username)) {
            dispatch(register({username, descript, password}));
            navigator(`/`);
            console.log("REG");
        }
        else alert("Ошибка в заполнении полей или пользователь с таким именем существует");
    }

    return (
        <div className="login-wrapper">
            <h1>Регистрация</h1>
            <form onSubmit={authHandler}>
                <div>
                    <p>Имя пользователя</p>
                    <input type="text" onChange={e => setUsername(e.target.value)}/>
                </div>
                <div>
                    <p>Описание</p>
                    <input type="text" onChange={e => setDescript(e.target.value)}/>
                </div>
                <div>
                    <p>Пароль</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </div>
                <div>
                    <button type="submit">Зарегистрироваться</button>
                </div>
            </form>
        </div>
    )
}

export default RegForm;