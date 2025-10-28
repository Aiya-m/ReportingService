import { useState } from "react";
import axiosClient from "../config/axios";

const useMutation = ({url, method = "POST"}) => {
    const [state, setState] = useState({
        isLoading: false,
        error: '',
    });

    const fn = async (data) => {
        setState(prev => ({ ...prev, isLoading: true,}));

        try {
            const res = await axiosClient({ url, method, data });
            setState({ isLoading: false, error: '' });
            return res.data;
        } catch (error) {
            setState({ isLoading: false, error });
            throw error;
        }
    };

    return { mutate:fn, ...state };
};

export default useMutation;