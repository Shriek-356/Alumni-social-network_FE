import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Components/User/Login';
import Home from './Components/Home/Home';
import AllView from './Components/AllView/AllView';
import Register from './Components/User/Register';

const stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <stack.Navigator initialRouteName='Login'>
        <stack.Screen name = "Login" component={Login}
        options={{headerShown:false}}
        />
        <stack.Screen name = "Register" component={Register}
        options={{headerShown:false}}
        />
        <stack.Screen name = "AllView"  component={AllView}
        options={{headerShown:false}}
        />
      </stack.Navigator> 
    </NavigationContainer>
  );
}


