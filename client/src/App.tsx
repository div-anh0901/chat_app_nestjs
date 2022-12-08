import { FC, PropsWithChildren, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { AuthenticatedRoute } from './components/AuthenticationRoute';
import ConversationChannelPage from './pages/conversations/ConversationChannelPage';
import { ConversationPage } from './pages/conversations/ConversationPage';
import LoginPage from './pages/LoginPage';
import RegisterForm from './pages/RegisterPage';
import { AuthContext } from './utils/context/AuthContext';
import { socket, SocketContext } from './utils/context/SocketContext';
import { User } from './utils/types';
import { Provider as ReduxProvide } from 'react-redux';
import { store } from './store';
import { enableMapSet } from 'immer';
import { GroupPage } from './pages/group/GroupPage';
import GroupChannelPage from './pages/group/GroupChannelPage';
import { AppPage } from './pages/AppPage';
import RegisterPage from './pages/RegisterPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConversationPageGuard } from './guards/ConversationPageGuard';
import { GroupPageGurad } from './guards/GroupPageGurad';
import 'emoji-mart/css/emoji-mart.css';
import { FriendsPage } from './pages/friends/FriendsPage';
import { FriendLayoutPage } from './pages/friends/FriendLayoutPage';
import { FriendRequestPage } from './pages/friends/FriendRequestPage';
import { OnboardingPage } from './pages/onboarding/Onboarding';
import { SettingsPage } from './pages/settings/SettingsPage';
import { SettingsProfilePage } from './pages/settings/SettingsProfilePage';
import { ThemeProvider } from 'styled-components';
import { DarkTheme, LightTheme } from './utils/themes';
import { SettingsAppearancePage } from './pages/settings/SettingsAppearancePage';
import { CallsPage } from './pages/calls/CallsPage';
import { CurrentCallPage } from './pages/calls/CurrentCallPage';
enableMapSet()
type Props = {
  user?: User,
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>,
  socket: Socket
}


function AppWithProviders({ children, user, setUser }: PropsWithChildren & Props) {
  return (
    <ReduxProvide store={store}>
        <AuthContext.Provider value={{ user, updateAuthUser: setUser }}>
          <SocketContext.Provider value={socket} >
            {children}
          </SocketContext.Provider>
        </AuthContext.Provider>
    </ReduxProvide>
  )
}

function App() {
  const [user, setUser] = useState<User>();

  return (
    <AppWithProviders user={user} setUser={setUser} socket={socket}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding"  element={<AuthenticatedRoute children={<OnboardingPage/>} /> } />
        <Route  element={ <AuthenticatedRoute> <AppPage /> </AuthenticatedRoute> }>
          <Route path="conversations" element={<ConversationPage />}>
            <Route path=":id" element={
              <ConversationPageGuard children={<ConversationChannelPage />} />
            } />
          </Route>
          <Route path="groups" element={<GroupPage />}>
            <Route path=":id" element={
              <GroupPageGurad children={<GroupChannelPage />} />

            } />
          </Route>
          <Route path='friends' element={<FriendLayoutPage />}>
              <Route path='requests' element={<FriendRequestPage/>} />
              <Route path='blocked' element={<div>Blocked</div>} />
          </Route>
          <Route path='settings' element={<SettingsPage />}>
            <Route path='profile' element={<SettingsProfilePage />} />
            <Route path="appearance" element={<SettingsAppearancePage />} />
          </Route>
          <Route path='calls' element={<CallsPage />} >
            <Route path="current" element={<CurrentCallPage />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer theme="dark" />
    </AppWithProviders>
  );
}




export default App;
