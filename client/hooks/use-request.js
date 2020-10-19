import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const response = await axios[method](url, {
                ...body,
                ...props,
            });
            console.log(response);
            if(onSuccess){
                onSuccess(response.data);
            }
            return response.data;

        } catch (err) {       
            console.log(err);     
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooops...</h4>
                    <ul>
                        {err.response.data.errors.map((error, ind) => <li key={ind}>{error.message}</li>)}
                    </ul>
                </div>
            );
        }
    };
    return {doRequest, errors,};
};