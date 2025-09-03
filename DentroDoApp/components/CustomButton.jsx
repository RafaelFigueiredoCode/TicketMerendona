import { StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function CustomButton({ onPress, color = '#007bff', style, title}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }, style]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText]}>{title}</Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});