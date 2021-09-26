import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { UserContext } from './AuthContext';

import Login from './screens/Authentication/Login';
import Register from './screens/Authentication/Register';
import UserLibrary from './screens/Library/UserLibrary';
import AddBookToLibrary from './screens/Library/AddBookToLibrary';
import ScanIsbn from './screens/Library/ScanIsbn';
import SelectFromInput from './screens/Library/SelectFromInput';
import ConfirmIsbnScan from './screens/Library/ConfirmIsbnScan';
import BookAddedSuccessfully from './screens/Library/BookAddedSuccessfully';
import UserWishList from './screens/WishList/UserWishList';
import AddBookToWishList from './screens/WishList/AddBookToWishList';
import SelectFromInputWL from './screens/WishList/SelectFromInputWL';
import InsertedSuccessfully from './screens/WishList/InsertedSuccessfully';
import BestMatches from './screens/SearchBestMatches/BestMatches';
import SendRequest from './screens/SearchBestMatches/SendRequest';
import AddDetailsToRequest from './screens/SearchBestMatches/AddDetailsToRequest';
import RequestSent from './screens/SearchBestMatches/RequestSent';
import AllRequests from './screens/Requests/AllRequests';
import RequestDetails from './screens/Requests/RequestDetails';
import AllMessages from './screens/Chat/AllMessages';
import SingleUserChat from './screens/Chat/SingleUserChat';
import BASE_URL from './configClient';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Library() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Your Library"
        component={UserLibrary}
        options={{
          title: 'Add the books you want to sell',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen name="Insert A New Book" component={AddBookToLibrary} />
      <Stack.Screen name="ScanISBN" component={ScanIsbn} />
      <Stack.Screen name="Confirm the Book" component={ConfirmIsbnScan} />
      <Stack.Screen
        name="Select a Book From The List"
        component={SelectFromInput}
      />
      <Stack.Screen
        name="Book Added Successfully"
        component={BookAddedSuccessfully}
      />
    </Stack.Navigator>
  );
}

function WishList() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Whish List" component={UserWishList} />
      <Stack.Screen name="Add a New Book" component={AddBookToWishList} />
      <Stack.Screen name="Select one Book" component={SelectFromInputWL} />
      <Stack.Screen
        name="Inserted Successfully"
        component={InsertedSuccessfully}
      />
    </Stack.Navigator>
  );
}

function SearchBestMatches() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Best Matches" component={BestMatches} />
      <Stack.Screen name="Send Request" component={SendRequest} />
      <Stack.Screen
        name="Add Details To The Request"
        component={AddDetailsToRequest}
      />
      <Stack.Screen name="Request Sent" component={RequestSent} />
    </Stack.Navigator>
  );
}

function Requests() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Requests" component={AllRequests} />
      <Stack.Screen name="Details of the Request" component={RequestDetails} />
    </Stack.Navigator>
  );
}

function Chats() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Messages" component={AllMessages} />
      <Stack.Screen name="Chat" component={SingleUserChat} />
    </Stack.Navigator>
  );
}

export default function AppScreens() {
  const { user } = useContext(UserContext);
  const [numOfReq, setNumOfReq] = useState(null);

  async function controlForRequests() {
    if (user.id !== '') {
      let response = await fetch(`${BASE_URL}/requests/${user.id}`);
      let json = await response.json();
      let filteredUserTo = json.filter((request) => request.userTo === user.id);
      let mappedUserTo = filteredUserTo.map((element) => element.hasBeenViewed);
      let numberOfRequestNotSeenUserTo = mappedUserTo.filter(
        (el) => el === false,
      );
      let filteredUserFrom = json.filter(
        (request) => request.userFrom === user.id,
      );
      let mappedUserFrom = filteredUserFrom.map(
        (element) => element.hasBeenViewed,
      );
      let numberOfRequestNotSeenUserFrom = mappedUserFrom.filter(
        (el) => el === true,
      );
      let numberOfRequestNotSeen = [
        ...numberOfRequestNotSeenUserFrom,
        ...numberOfRequestNotSeenUserTo,
      ];
      setNumOfReq(
        numberOfRequestNotSeen.length ? numberOfRequestNotSeen.length : null,
      );
    }
  }

  setInterval(controlForRequests, 500);

  return (
    <NavigationContainer>
      {!user.auth ? (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Library') {
                iconName = focused ? 'library' : 'library-outline';
              } else if (route.name === 'WishList') {
                iconName = focused ? 'heart' : 'heart-outline';
              } else if (route.name === 'Matches') {
                iconName = focused ? 'search' : 'search-outline';
              } else if (route.name === 'All Requests') {
                iconName = focused ? 'mail-open' : 'mail-outline';
              } else if (route.name === 'Chats') {
                iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2471A3',
            tabBarInactiveTintColor: 'black',
            headerShown: false,
            tabBarStyle: { backgroundColor: 'white' },
          })}
        >
          <Tab.Screen name="Library" component={Library} />
          <Tab.Screen name="WishList" component={WishList} />
          <Tab.Screen name="Matches" component={SearchBestMatches} />
          <Tab.Screen
            name="All Requests"
            component={Requests}
            options={{ tabBarBadge: numOfReq }}
          />
          <Tab.Screen name="Chats" component={Chats} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}
