import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/reducer/authSlice";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const {loading, error} = useSelector ((state) => state.auth)
    const navigate = useNavigate()
    const login = async (e) => {
        e.preventDefault();
        const action = await dispatch(loginUser({username,password}));
        if (loginUser.fulfilled.match(action)) {
          navigate('/')
        }
    };
    useEffect(() => {
      Cookies.remove('accessToken');
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-2xl font-bold text-center mb-4">Giriş Yap</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={login} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Şifre
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full py-2 rounded-md transition-colors ${
                  loading ? 'bg-gray-500' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
                disabled={loading}
              >
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
          </div>
        </div>
      );
}

export default Login