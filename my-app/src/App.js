import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import StartPage from "./StartPage";
import React, {useEffect} from "react";
import ITunesPage from "./ITunesPage";
import Posts from "./Posts";
import Post from "./Post";
import User from "./User";
import AuthForm from "./AuthForm";
import RegForm from "./RegForm";

function App() {
    return (
        <Routes>
            <Route path="/start" element={<StartPage />} ></Route>
            <Route path="/itunes" element={<ITunesPage />}></Route>
            <Route path="/" element={<Posts />}></Route>
            <Route path="/post/:id" element={<Post />}></Route>
            <Route path="/user/:id" element={<User />}></Route>
            <Route path="/auth" element={<AuthForm />}></Route>
            <Route path="/registration" element={<RegForm />}></Route>
        </Routes>
    );
}

export default App;