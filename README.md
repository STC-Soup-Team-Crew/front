# 🌱 Meal Maker - React Native Frontend

An eco-friendly React Native application that helps users reduce food waste by generating recipes based on photos of their fridge or pantry.

## ✨ Features

- 📸 **Photo Capture** - Use device camera to photograph fridge/pantry
- 🖼️ **Gallery Upload** - Select photos from device library
- 🤖 **AI Recipe Generation** - Get personalized recipes based on available ingredients
- 🍳 **Interactive Cooking Guide** - Check off ingredients and steps as you cook
- 📤 **Share Recipes** - Share generated recipes with friends
- 🌱 **Eco-Friendly Design** - Beautiful green and earth-tone color palette
- ⏱️ **Progress Tracking** - Visual progress indicator while cooking
- 🛡️ **Error Handling** - User-friendly error messages and retry options
- 📱 **Responsive UI** - Works seamlessly on iOS, Android, and Web

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Physical device or simulator/emulator for testing

### Installation & Running

All dependencies are already installed! Just run:

```bash
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser
npx expo start     # For physical device with Expo Go app
```

Then scan the QR code with Expo Go (available on App Store/Play Store) to test on your phone.

### Configure API Endpoint

Create `.env.local` in the root directory:
```env
EXPO_PUBLIC_API_BASE_URL=http://your-api-endpoint.com
```

## 📁 Project Structure

```
src/
├── screens/
│   ├── HomeScreen.tsx         # Welcome & introduction
│   ├── CameraScreen.tsx       # Photo capture & upload
│   ├── RecipeScreen.tsx       # Recipe display & cooking guide
│   └── index.ts
├── components/
│   ├── LoadingModal.tsx       # Loading spinner
│   ├── ErrorModal.tsx         # Error message display
│   └── index.ts
├── services/
│   └── apiService.ts          # API client & recipe generation
├── theme/
│   ├── colors.ts              # Eco-friendly color palette
│   └── index.ts               # Design system (spacing, typography)
├── navigation/
│   └── RootNavigator.tsx      # Screen navigation setup
└── utils/
    └── config.ts              # App configuration
```

## 🔌 API Integration

The app integrates with your backend API:

### Upload Photo
```
POST /api/recipes/generate
Content-Type: multipart/form-data

Response:
{
  "recipe_id": "unique_id",
  "id": "unique_id"
}
```

### Fetch Recipe
```
GET /api/recipes/{recipe_id}

Response:
{
  "name": "Recipe Name",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "steps": ["step 1", "step 2", ...]
}
```

## 🎨 Design System

**Color Palette:**
- Primary Green: `#2D6A4F` (Deep forest)
- Light Green: `#52B788` (Eco-friendly)
- Accent: `#F4A460` (Sandy brown)
- Success: `#10B981` (Green checkmarks)
- Error: `#EF4444` (Red warnings)

Customize colors in `src/theme/colors.ts`

## 📱 User Flow

1. **Home Screen** - Introduction & feature overview
2. **Get Started** - Navigate to Camera Screen
3. **Capture/Upload** - Take photo or select from gallery
4. **Generate Recipe** - POST photo to API (shows loading spinner)
5. **Display Recipe** - GET recipe from API and show on Recipe Screen
6. **Cook** - Check off ingredients and steps
7. **Share** - Share recipe via native share dialog
8. **Try Again** - Navigate back to Camera for another recipe

## 🛠️ Development

### Customize Theme
Edit `src/theme/colors.ts` and `src/theme/index.ts`:
- Colors
- Typography sizes and weights
- Spacing
- Border radius
- Shadows

### Add New Features
1. Create components in `src/components/`
2. Create screens in `src/screens/`
3. Add routes to `src/navigation/RootNavigator.tsx`
4. Update `apiService.ts` for new API calls

### Environment Variables
Set `EXPO_PUBLIC_API_BASE_URL` in `.env.local`:
```env
EXPO_PUBLIC_API_BASE_URL=https://your-api.com
```

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup guide
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Detailed documentation
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What's been built

## 📖 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/)

## 🐛 Troubleshooting

**Camera not working?**
- Ensure camera permission is granted in device settings
- Use a physical device (simulators have limited camera support)

**API requests failing?**
- Check API endpoint in `.env.local`
- Verify API server is running and accessible
- Check response format matches expected JSON

**Build/Runtime errors?**
- Clear cache: `npx expo start --clear`
- Restart dev server
- Check console for detailed error messages

## 🌱 Eco-Friendly Mission

This app reduces food waste by helping users:
- Make efficient use of available ingredients
- Reduce unnecessary grocery shopping
- Promote home cooking over takeout
- Encourage sustainable food practices

## 📄 License

MIT

---

**Ready to start?** See [QUICK_START.md](QUICK_START.md) for setup instructions!

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
# front
