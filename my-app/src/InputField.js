import {Button} from "react-bootstrap";
import React from "react";
//import './InputField.css';

const InputField = ({ value, setValue, onSubmit, loading, buttonTitle = 'Поиск'}) => {
    return <div className="inputField">
        <input value={value} onChange={(event => setValue(event.target.value))}/>
        <Button disabled={loading} onClick={onSubmit}>{buttonTitle}</Button>
    </div>
}

export default InputField