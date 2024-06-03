import { io } from 'socket.io-client';
import { useAuth } from '../provider/AuthProvider';


export default function HandlerSocket() {
  const auth = useAuth();
  if (auth.isAuth) {
    const socket = io(process.env.REACT_APP_URL_EVENT, {
      path: "/events/",
      // auth: { token: auth.token },
    });
    return socket;
  } else {
    return null
  }
}