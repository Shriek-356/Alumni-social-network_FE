
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native';
import Home from '../Home/Home';
import Account from '../Home/Account';


const tab = createBottomTabNavigator();

export default AllView = () =>{
    return(
            <tab.Navigator  >
                <tab.Screen name="Home" component={Home} />
                <tab.Screen name="Account" component={Account} />
            </tab.Navigator>
    )
}

