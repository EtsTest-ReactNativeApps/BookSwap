import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Button,
  TextInput,
} from 'react-native';
import { IconButton, Colors } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { UserContext } from '../../AuthContext';
import BASE_URL from '../../configClient';
import DisplaySingleRequest from '../../components/displaySingleRequest';

const AllRequests = ({ route, navigation }) => {
  const { user } = useContext(UserContext);
  const isFocused = useIsFocused();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [madeRequests, setMadeRequests] = useState([]);

  async function controlForRequests() {
    const response = await fetch(`${BASE_URL}/requests/${user.id}`);
    const json = await response.json();
    const filteredIncomingRequests = json.filter(
      (request) => request.userFrom !== user.id,
    );
    const filteredMadeRequests = json.filter(
      (request) => request.userFrom === user.id,
    );
    setIncomingRequests(filteredIncomingRequests);
    setMadeRequests(filteredMadeRequests);
  }

  useEffect(() => {
    if (isFocused) controlForRequests();
  }, [isFocused]);

  function removeNotificationBadgeReceiver(whatever) {
    if (!whatever.hasBeenViewed) {
      fetch(
        `${BASE_URL}/requests/${whatever.userTo}/${whatever.userFrom}/receiver/true`,
        {
          method: 'PUT',
        },
      ).catch((err) => console.log(err));
    }
  }

  function removeNotificationBadgeSender(whatever) {
    if (whatever.hasBeenViewed) {
      fetch(
        `${BASE_URL}/requests/${whatever.userFrom}/${whatever.userTo}/sender/false`,
        {
          method: 'PUT',
        },
      ).catch((err) => console.log(err));
    }
  }

  return (
    <View>
      <Text>Requests main page</Text>
      {madeRequests.map((req) => (
        <DisplaySingleRequest
          info={req}
          user={user.id}
          pressing={() => {
            removeNotificationBadgeSender(req);
            navigation.navigate('Details of the Request', {
              request: req,
            });
          }}
          key={req.timeStamp}
        />
      ))}
      {incomingRequests.map((req) => (
        <DisplaySingleRequest
          info={req}
          pressing={() => {
            removeNotificationBadgeReceiver(req);
            navigation.navigate('Details of the Request', {
              request: req,
            });
          }}
          key={req.timeStamp}
        />
      ))}
    </View>
  );
};

export default AllRequests;
