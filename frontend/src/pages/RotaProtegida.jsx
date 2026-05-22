import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const RotaProtegida = ({ children, apenasStaff = false }) => {
    // quem esta logado?
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if(user == null)
            navigate('/login');
        else if(apenasStaff == true && user.is_staff == false) {
            navigate('/');
            alert("Esta área é exclusiva para a equipa técnica.");
        }
    }, [user, navigate, apenasStaff, loading]);

    if (loading) {
        return <div>A verificar permissões...</div>;
    }

    if (user == null)
        return null;
    if (apenasStaff == true && user.is_staff == false)
        return null;

    return children;
}

export default RotaProtegida;