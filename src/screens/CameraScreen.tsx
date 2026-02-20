/**
 * CameraScreen V3 — Choose Pic / Take Pic / Find
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme';
import { apiService } from '../services/apiService';

interface CameraScreenProps {
  navigation: any;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] = ImagePicker.useMediaLibraryPermissions();
  const [cameraRef, setCameraRef] = useState<any>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
    if (!galleryPermission?.granted) requestGalleryPermission();
  }, []);

  const handleTakePhoto = async () => {
    if (!cameraRef || isCapturing) return;
    try {
      setIsCapturing(true);
      const photo = await cameraRef.takePictureAsync({ quality: 0.8, base64: false });
      setSelectedImage(photo.uri);
      setCameraActive(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setCameraActive(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const handleFind = async () => {
    if (!selectedImage) {
      Alert.alert('No Photo', 'Please choose or take a photo first.');
      return;
    }
    setIsLoading(true);
    try {
      const recipe = await apiService.uploadPhotoAndGetRecipe(selectedImage);
      setIsLoading(false);
      navigation.navigate('Recipe', { recipe });
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to generate recipe');
    }
  };

  /* ---- Permission gate ---- */
  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.title}>Camera Permission Required</Text>
          <Text style={styles.subtitle}>
            We need access to your camera to capture photos of your fridge.
          </Text>
          <TouchableOpacity style={styles.pillBtn} onPress={requestPermission}>
            <Text style={styles.pillBtnText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* ---- Live camera view ---- */
  if (cameraActive && !selectedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <CameraView ref={setCameraRef} style={styles.camera} facing="back">
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraBottom}>
              <TouchableOpacity style={styles.camActionBtn} onPress={() => setCameraActive(false)}>
                <Text style={styles.camActionText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.shutterBtn, { opacity: isCapturing ? 0.6 : 1 }]}
                onPress={handleTakePhoto}
                disabled={isCapturing}
              >
                <View style={styles.shutterInner} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.camActionBtn} onPress={handlePickFromGallery}>
                <Text style={styles.camActionText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  /* ---- Default: Choose Pic / Take Pic / Find ---- */
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Scan Your Fridge</Text>
        <Text style={styles.subtitle}>
          Take or choose a photo, then tap Find to get recipe ideas
        </Text>

        {/* Preview */}
        {selectedImage ? (
          <View style={styles.previewWrap}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <TouchableOpacity style={styles.clearBtn} onPress={() => setSelectedImage(null)}>
              <Text style={styles.clearBtnText}>X</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No photo selected</Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.btnGroup}>
          <TouchableOpacity style={styles.pillBtn} onPress={handlePickFromGallery}>
            <Text style={styles.pillBtnText}>Choose Pic</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pillBtn} onPress={() => setCameraActive(true)}>
            <Text style={styles.pillBtnText}>Take Pic</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pillBtnAccent, !selectedImage && styles.disabled]}
            onPress={handleFind}
            disabled={!selectedImage || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.buttonText} />
            ) : (
              <Text style={styles.pillBtnAccentText}>Find</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['3xl'],
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  previewWrap: {
    position: 'relative',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
    ...theme.shadow.md,
  },
  previewImage: {
    width: '100%',
    height: 260,
    backgroundColor: theme.colors.surface,
  },
  clearBtn: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtnText: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.white,
    fontSize: 16,
  },
  placeholder: {
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.xxxl,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.divider,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textMuted,
  },
  btnGroup: {
    gap: theme.spacing.md,
  },
  pillBtn: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
  },
  pillBtnText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  pillBtnAccent: {
    backgroundColor: theme.colors.button,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    ...theme.shadow.md,
  },
  pillBtnAccentText: {
    fontFamily: theme.typography.fontFamily.semibold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.buttonText,
  },
  disabled: { opacity: 0.5 },
  /* Camera view */
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, justifyContent: 'flex-end' },
  cameraBottom: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  shutterBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.button,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: theme.colors.buttonText,
  },
  camActionBtn: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  camActionText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white,
  },
});
