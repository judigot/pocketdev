// Simplified version for APK build
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { WebSocket } from 'react-native';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isTermux, setIsTermux] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    // WebSocket connection for testing
    try {
      const websocketUrl = 'ws://3.141.4.43:8080';
      ws.current = new WebSocket(websocketUrl);
      
      ws.current.onopen = () => {
        setIsConnected(true);
        console.log('📱 Connected to Pocketdev backend');
      };
      
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: data.type,
            text: data.output || data.text,
            command: data.command,
            timestamp: new Date().toLocaleTimeString(),
            sessionId: data.sessionId
          }]);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };
      
      ws.current.onclose = () => {
        setIsConnected(false);
        console.log('📱 Disconnected from Pocketdev server');
      };
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Connection failed:', error);
      setIsConnected(false);
    }
  }, []);

  const sendMessage = () => {
    if (inputText.trim() && ws.current && isConnected) {
      const message = {
        id: Date.now(),
        text: inputText.trim(),
        timestamp: new Date().toISOString()
      };
      
      ws.current.send(JSON.stringify(message));
      setInputText('');
    }
  };

  const renderMessage = (message) => {
    const isCommand = message.type === 'output' || message.type === 'complete';
    const isError = message.type === 'error';
    
    return (
      <View key={message.id} style={[styles.messageContainer, isError && styles.errorContainer]}>
        <Text style={[styles.timestamp, isError && styles.errorText]}>
          {message.timestamp}
          <Text style={styles.remoteIndicator}> [SERVER]</Text>
        </Text>
        
        {isCommand && (
          <View style={styles.commandContainer}>
            <Text style={styles.commandLabel}>Command:</Text>
            <Text style={styles.commandText}>{message.command}</Text>
          </View>
        )}
        
        <Text style={[styles.messageText, isError && styles.errorText]}>
          {message.text}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pocketdev Mobile Terminal</Text>
        <View style={[styles.statusIndicator, isConnected ? styles.connected : styles.disconnected]} />
        <Text style={styles.statusText}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
        <Text style={styles.termuxBadge}>DEMO</Text>
      </View>
      
      <ScrollView style={styles.messagesContainer}>
        {messages.map(renderMessage)}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Enter command..."
          multiline
          onSubmitEditing={({ nativeEvent: { text } }) => {
            const command = text;
            if (command.trim()) {
              sendMessage();
            }
          }}
        />
        <TouchableOpacity 
          style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]} 
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  connected: {
    backgroundColor: '#4CAF50',
  },
  disconnected: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  termuxBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF5722',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  errorContainer: {
    borderColor: '#f44336',
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
    marginBottom: 5,
  },
  remoteIndicator: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginRight: 5,
  },
  commandContainer: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  commandLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  commandText: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'monospace',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  errorText: {
    color: '#f44336',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  sendButtonActive: {
    backgroundColor: '#007AFF',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});