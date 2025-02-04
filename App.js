import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Components/User/Login';
import AllView from './Components/AllView/AllView';
import Register from './Components/User/Register';
import RegisterDetails from './Components/User/RegisterDetails';
import { createContext } from 'react';
import { useState } from 'react';
import Profile from './Components/Home/Profile';
import CreatePost from './Components/Home/PostCreation';
import ChatScreen from './Components/ChatScreen/ChatScreen';
import ScreenRoom from './Components/ChatScreen/RoomScreen';
import SearchScreen from './Components/ChatScreen/SearchScreen';
import ApprovalScreen from './Components/Home/ApprovalScreen';
import RegisterLecturer from './Components/User/RegisterLecturer';
import PostSurVey from './Components/Post/PostSurvey';
import AddQuestionScreen from './Components/Post/AddQuestionScreen';
import PostInvited from './Components/Post/PostInvited';


const Stack = createStackNavigator();


export const RegisterInfoContext = createContext()
export const CurrentUserContext = createContext()
export const CurrentAccountUserContext = createContext()
export const CurrentAlumniAccountContext = createContext()
export const MyUserContext = createContext();
export const TotalReactionAccountContext = createContext()
export const RoomContext = createContext();
export const PostSurveyContext = createContext()
export default function App() {

  const [RegisterInfo, setRegisterInfo] = useState({
    username: '',
    password: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    first_name: '',
    last_name: '',
    gender: '',
    alumni_account_code: ''
  });
  const [postId, setPostId] = useState(null);

  const [currentAlumniAccount, setCurrentAlumniAccount] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [currentAccountUser, setCurrentAccountUser] = useState({})
  const [totalReactionAccount, setTotalReactionAccount] = useState({})
  
  const [getRoom, setRoom] = useState({ user: {}, messages: [] });



  return (
    <CurrentAlumniAccountContext.Provider value={[currentAlumniAccount, setCurrentAlumniAccount]}>
      <TotalReactionAccountContext.Provider value={[totalReactionAccount, setTotalReactionAccount]}>
        <CurrentAccountUserContext.Provider value={[currentAccountUser, setCurrentAccountUser]}>
          <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
          <PostSurveyContext.Provider value={[postId, setPostId ]}>

            <RoomContext.Provider value={[getRoom, setRoom]}>
              <RegisterInfoContext.Provider value={[RegisterInfo, setRegisterInfo]}>

                <NavigationContainer>
                  <Stack.Navigator initialRouteName='Login'>
                    <Stack.Screen name="Login" component={Login}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="Register" component={Register}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="RegisterDetails" component={RegisterDetails}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="AllView" component={AllView}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="Profile" component={Profile}
                      options={{ headerShown: false }}
                    /><Stack.Screen name="CreatePost" component={CreatePost}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="ChatScreen" component={ChatScreen}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="RoomScreen" component={ScreenRoom}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="SearchScreen" component={SearchScreen}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="ApprovalScreen" component={ApprovalScreen}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="RegisterLecturer" component={RegisterLecturer}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="PostSurvey" component={PostSurVey}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="AddQuestionScreen" component={AddQuestionScreen}
                      options={{ headerShown: false }} />
                    <Stack.Screen name ="PostInvited" component={PostInvited}
                      options ={{headerShown:false}}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </RegisterInfoContext.Provider>
            </RoomContext.Provider>
            </PostSurveyContext.Provider>
          </CurrentUserContext.Provider>
        </CurrentAccountUserContext.Provider>
      </TotalReactionAccountContext.Provider>
    </CurrentAlumniAccountContext.Provider>
  );
}