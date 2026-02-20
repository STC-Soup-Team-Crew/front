# 🌱 Meal Maker - React Native Frontend

An eco-friendly React Native application that helps users reduce food waste by suggesting recipes based on photos of their fridge or pantry.

## 🌿 Features

- **Photo Capture & Gallery Upload**: Capture photos of your fridge/pantry or upload from gallery
- **AI-Powered Recipe Generation**: Get personalized recipes based on available ingredients
- **Eco-Friendly Design**: Beautiful green and earth-tone color palette
- **Interactive Cooking**: Check off ingredients and steps as you cook
- **Share Recipes**: Share generated recipes with friends and family
- **Progress Tracking**: Visual progress indicator for cooking steps
- **Error Handling**: User-friendly error messages and retry options
- **Loading States**: Clear visual feedback during API requests

## 📱 Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Native Stack Navigator)
- **Styling**: React Native StyleSheet with custom theme system
- **API Communication**: Axios
- **Camera**: expo-camera
- **Image Picker**: expo-image-picker
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (optional, can use `npx expo`)

### Installation

1. **Clone the repository** (if applicable)
```bash
cd /Users/salabdoulaye/meal-maker-frontend
```

2. **Install dependencies** (already completed)
```bash
npm install
```

### Environment Configuration

Before running the app, configure your API endpoint:

1. Create a `.env.local` file in the root directory:
```env
EXPO_PUBLIC_API_BASE_URL=http://YOUR_API_ENDPOINT
```

2. Or set it at runtime in your API service:
```typescript
// In src/services/apiService.ts
apiService.setBaseUrl('http://YOUR_API_ENDPOINT');
```

### Running the App

#### For iOS
```bash
npm run ios
```

#### For Android
```bash
npm run android
```

#### For Web
```bash
npm run web
```

#### Using Expo Go App
```bash
npx expo start
# Then scan the QR code with Expo Go app
```

## 📁 Project Structure

```
src/
├── screens/              # Screen components
│   ├── HomeScreen.tsx    # Welcome/introduction screen
│   ├── CameraScreen.tsx  # Photo capture and upload
│   ├── RecipeScreen.tsx  # Recipe display and cooking tracker
│   └── index.ts          # Screen exports
├── components/           # Reusable components
│   ├── LoadingModal.tsx  # Loading spinner modal
│   ├── ErrorModal.tsx    # Error message modal
│   └── index.ts          # Component exports
├── services/             # API and business logic
│   └── apiService.ts     # Recipe API integration
├── navigation/           # Navigation configuration
│   └── RootNavigator.tsx # Navigation stack setup
├── theme/                # Design system
│   ├── colors.ts         # Color palette
│   └── index.ts          # Theme configuration
└── utils/                # Utility functions (for future use)
```

## 🎨 Theme & Colors

The app uses an eco-friendly color palette:

- **Primary Green**: `#2D6A4F` (Deep forest green)
- **Light Green**: `#52B788` (Light eco-green)
- **Accent Brown**: `#F4A460` (Sandy brown)
- **Success**: `#10B981` (Green for success states)
- **Error**: `#EF4444` (Red for errors)

All colors and typography are centralized in `src/theme/` for easy customization.

## 🔌 API Integration

### Photo Upload

**Endpoint**: `POST /api/recipes/generate`

**Request**:
```
Content-Type: multipart/form-data
Body: photo (image file)
```

**Response**:
```json
{
  "recipe_id": "unique_identifier",
  "id": "unique_identifier"
}
```

### Fetch Recipe

**Endpoint**: `GET /api/recipes/{recipe_id}`

**Response**:
```json
{
  "name": "Pasta Primavera",
  "ingredients": [
    "2 cups pasta",
    "1 cup broccoli",
    "2 cloves garlic"
  ],
  "steps": [
    "Boil water and cook pasta",
    "Sauté vegetables",
    "Combine and serve"
  ]
}
```

## 📱 Screen Navigation

### Home Screen
- Welcome and introduction
- Feature overview
- "Get Started" button to navigate to Camera

### Camera Screen
- Real-time camera preview
- Photo capture button
- Gallery upload option
- Image preview with remove option
- Generate Recipe button
- Loading states during API request

### Recipe Screen
- Recipe name and heading
- Interactive ingredients checklist
- Numbered cooking steps with checkmarks
- Progress tracker for steps completed
- Share recipe button
- "Try Another Recipe" button to return to camera

## 🔐 Permissions

The app requires the following permissions:

- **Camera**: To capture photos of fridge/pantry
- **Photo Library**: To upload images from device gallery

Users will be prompted to grant these permissions on first use.

## 🎯 Usage Flow

1. **Launch App** → Home Screen with introduction
2. **Get Started** → Navigate to Camera Screen
3. **Capture/Upload** → Take photo or select from gallery
4. **Generate** → POST photo to API, receive recipe_id
5. **Display Recipe** → GET recipe details and show on Recipe Screen
6. **Cook** → Check off ingredients and steps
7. **Share** → Share recipe with others
8. **Try Again** → Navigate back to Camera for another recipe

## 🛠️ Development

### Adding New Screens

1. Create screen component in `src/screens/`
2. Add screen type to RootNavigator
3. Add navigation link from existing screens

### Customizing Theme

Edit `src/theme/colors.ts` and `src/theme/index.ts` to modify:
- Colors
- Spacing
- Typography
- Border radius
- Shadows

### Adding Components

Create reusable components in `src/components/` and export from `src/components/index.ts`

## 📝 API Configuration Guide

### Setting API Base URL

The API base URL can be configured in three ways:

1. **Environment Variable** (Recommended for production):
```env
EXPO_PUBLIC_API_BASE_URL=https://api.example.com
```

2. **Runtime Configuration** (for dynamic URLs):
```typescript
import { apiService } from '@/src/services/apiService';

// In your initialization code
apiService.setBaseUrl('https://api.example.com');
```

3. **Default Value** (for local development):
Edit `src/services/apiService.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8000';
```

## 🐛 Troubleshooting

### Camera Not Working
- Check that camera permission is granted in device settings
- Ensure you're running on physical device (camera not available in simulator)

### Image Upload Failed
- Verify API endpoint is correct and accessible
- Check network connection
- Ensure photo file is valid (JPEG/PNG)
- Check API error response in ErrorModal

### Recipe Not Loading
- Verify recipe_id is returned from POST request
- Check that GET endpoint URL is correct
- Ensure response JSON matches expected format

### Navigation Issues
- Verify all screens are properly exported in `src/screens/index.ts`
- Check RootNavigator configuration
- Ensure navigation names match between screens and navigator

## 📦 Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

Requires EAS account configuration. See [Expo EAS documentation](https://docs.expo.dev/eas/) for details.

## 🌱 Eco-Friendly Impact

This app helps reduce food waste by:
- Making efficient use of available ingredients
- Reducing unnecessary grocery shopping
- Promoting home cooking over food waste
- Encouraging sustainable food practices

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ✨ Future Enhancements

Potential features to add:
- Dietary preference filtering
- Nutrition information display
- Saved favorites
- Recipe history
- Offline mode
- Dark mode support
- Multi-language support
- Video tutorials for recipes
