import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const RotaProtegida = ({ children }) => {
    // quem esta logado?
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(user == null)
            navigate('/login');
        else if(user.is_staff == false) {
            navigate('/');
            alert("Esta área é exclusiva para a equipa técnica.");
        }
    }, [user, navigate]);

    if(user !== null && user.is_staff == true) {
        return children;
    }

    return null;
}

export default RotaProtegida;