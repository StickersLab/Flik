import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export function AddModal({ visible, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [hasChain, setHasChain] = useState(false);
  const inputRef = useRef(null);

  function handleAdd() {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({ title: trimmed, hasChain });
    setTitle('');
    setHasChain(false);
    onClose();
  }

  function handleClose() {
    setTitle('');
    setHasChain(false);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.modalTitle}>NOUVELLE TÂCHE</Text>

          <TextInput
            ref={inputRef}
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="que faut-il faire ?"
            placeholderTextColor="#aaa"
            maxLength={60}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
            autoFocus
          />

          <TouchableOpacity
            style={styles.chainToggle}
            onPress={() => setHasChain((v) => !v)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, hasChain && styles.checkboxChecked]}>
              {hasChain && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.chainLabel}>action requise avant</Text>
          </TouchableOpacity>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnCancel]}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, styles.btnTextCancel]}>ANNULER</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnConfirm]}
              onPress={handleAdd}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, styles.btnTextConfirm]}>AJOUTER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(245,243,238,0.97)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  content: {
    width: '100%',
    gap: 20,
  },
  modalTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    letterSpacing: 4,
    color: '#1a1a1a',
  },
  input: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 20,
    color: '#1a1a1a',
    borderBottomWidth: 1.5,
    borderBottomColor: '#1a1a1a',
    paddingVertical: 10,
    letterSpacing: 1,
  },
  chainToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#aaa',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 14,
  },
  chainLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    letterSpacing: 2,
    color: '#aaa',
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1a1a1a',
    alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: 'transparent',
  },
  btnConfirm: {
    backgroundColor: '#1a1a1a',
  },
  btnText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 13,
    letterSpacing: 3,
  },
  btnTextCancel: {
    color: '#1a1a1a',
  },
  btnTextConfirm: {
    color: '#f5f3ee',
  },
});
