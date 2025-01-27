import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Components/User/Login';
import Home from './Components/Home/Home';
import AllView from './Components/AllView/AllView';
import Register from './Components/User/Register';
import RegisterDetails from './Components/User/RegisterDetails';
import { createContext } from 'react';
import { useState } from 'react';
import { useReducer } from 'react';
import RoomScreen from './Components/ChatScreen/RoomScreen';
import ChatScreen from './Components/ChatScreen/ChatScreen';

const Stack = createStackNavigator();

export const RegisterInfoContext = createContext()
export const CurrentUserContext = createContext()
export const CurrentAccountUserContext = createContext()
export const CurrentAlumniAccountContext = createContext()
export const TotalReactionAccountContext = createContext()
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

  const [currentAlumniAccount, setCurrentAlumniAccount] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [currentAccountUser, setCurrentAccountUser] = useState({})
  const [totalReactionAccount, setTotalReactionAccount] = useState({})


  return (
    <CurrentAlumniAccountContext.Provider value={[currentAlumniAccount, setCurrentAlumniAccount]}>
      <TotalReactionAccountContext.Provider value={[totalReactionAccount, setTotalReactionAccount]}>
        <CurrentAccountUserContext.Provider value={[currentAccountUser, setCurrentAccountUser]}>
          <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
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
                  {/* <Stack.Screen name ="RoomScreen" component={RoomScreen}
                  options={{headerShown:false}}/> */}
                  <Stack.Screen name ="ChatScreen" component={ChatScreen}
                  options={{headerShown:false}}/>
                </Stack.Navigator>
              </NavigationContainer>
            </RegisterInfoContext.Provider>
          </CurrentUserContext.Provider>
        </CurrentAccountUserContext.Provider>
      </TotalReactionAccountContext.Provider>
    </CurrentAlumniAccountContext.Provider>
  );
}


