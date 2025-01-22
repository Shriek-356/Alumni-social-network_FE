import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Components/User/Login';
import Home from './Components/Home/Home';
import AllView from './Components/AllView/AllView';
import Register from './Components/User/Register';
import RegisterDetails from './Components/User/RegisterDetails';
import { createContext, use } from 'react';
import { useState } from 'react';

const Stack = createStackNavigator();

export const RegisterInfoContext = createContext()
export const CurrentUserContext = createContext()
export const CurrentAccountUserContext = createContext()
export const CurrentAlumniAccountContext = createContext()

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

  return (
    <CurrentAlumniAccountContext.Provider value={[currentAccountUser, setCurrentAccountUser]}>
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
              </Stack.Navigator>
            </NavigationContainer>
          </RegisterInfoContext.Provider>
        </CurrentUserContext.Provider>
      </CurrentAccountUserContext.Provider>
    </CurrentAlumniAccountContext.Provider>
  );
}


