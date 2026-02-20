/**
 * CameraScreen Component V2
 * Capture or upload photos — no emojis, Poppins font, new palette
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
  ScrollView,
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
    if (!permission?.granted) {
      requestPermission();
    }
    if (!galleryPermission?.granted) {
      requestGalleryPermission();
    }
  }, []);

  const handleTakePhoto = async () => {
    if (!cameraRef || isCapturing) return;
    try {
      setIsCapturing(true);
      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      setSelectedImage(photo.uri);
      setCameraActive(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error(error);
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
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error(error);
    }
  };

  const handleGenerateRecipe = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select or take a photo first');
      return;
    }
    setIsLoading(true);
    try {
      const recipe = await apiService.uploadPhotoAndGetRecipe(selectedImage);
      setIsLoading(false);
      navigation.navigate('Recipe', { recipe });
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to generate recipe'
      );
    }
  };

  const handleClearSelection = () => {
    setSelectedImage(null);
    setCameraActive(false);
  };

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentCenter}>
          <Text style={styles.title}>Camera Permission Required</Text>
          <Text style={styles.subtitle}>
            We need access to your camera to capture photos of your fridge or pantry.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {cameraActive && !selectedImage ? (
        <CameraView ref={setCameraRef} style={styles.camera} facing="back">
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraTop} />
            <View style={styles.cameraBottom}>
              <TouchableOpacity
                style={[styles.iconButton, styles.closeButton]}
                onPress={() => setCameraActive(false)}
              >
                <Text style={styles.iconButtonText}>X</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.circleButton, { opacity: isCapturing ? 0.6 : 1 }]}
                onPress={handleTakePhoto}
                disabled={isCapturing}
              >
                <View style={styles.circleBorder} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.iconButton, styles.galleryButton]}
                onPress={handlePickFromGallery}
              >
                <Text style={styles.galleryLabel}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Capture Your Fridge</Text>
            <Text style={styles.subtitle}>
              Take a photo of your fridge or pantry to generate recipes based on available ingredients
            </Text>
          </View>

          {/* Image Preview */}
          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={[styles.previewImage, { overflow: 'hidden' } as any]}
              />
              <TouchableOpacity style={styles.removeButton} onPress={handleClearSelection}>
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>No photo selected</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setCameraActive(true)}
            >
              <Text style={styles.secondaryButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handlePickFromGallery}
            >
              <Text style={styles.secondaryButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, !selectedImage && styles.disabledButton]}
              onPress={handleGenerateRecipe}
              disabled={!selectedImage || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.buttonText} />
              ) : (
                <Text style={styles.primaryButtonText}>Generate Recipe</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cameraBottom: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  circleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.button,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.lg,
  },
  circleBorder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: theme.colors.buttonText,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 20,
    color: theme.colors.white,
  },
  closeButton: {
    backgroundColor: 'rgba(232, 93, 93, 0.4)',
  },
  galleryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  galleryLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.xl,
  },
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xl,
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
    lineHeight: 24,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadow.md,
  },
  previewImage: {
    width: '100%',
    height: 300,
    backgroundColor: theme.colors.surface,
  },
  removeButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.md,
  },
  removeButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.white,
    fontSize: 18,
  },
  placeholderContainer: {
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
  buttonContainer: {
    gap: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.button,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    ...theme.shadow.md,
  },
  primaryButtonText: {
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.buttonText,
    fontSize: theme.typography.fontSize.lg,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surfaceLight,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
