# 🚀 Quick Start Guide - Meal Maker Frontend

## ⚡ 5-Minute Setup

### 1. Install Dependencies (Already Done ✅)
All dependencies are installed. You're ready to run the app!

### 2. Configure Your API Endpoint

Choose one of these methods:

#### Option A: Environment Variable (Recommended)
Create a `.env.local` file in the root directory:
```env
EXPO_PUBLIC_API_BASE_URL=http://your-api-endpoint.com
```

#### Option B: Edit Configuration File
Edit `src/utils/config.ts`:
```typescript
export const API_CONFIG = {
  baseUrl: 'http://your-api-endpoint.com',
  // ... rest of config
};
```

#### Option C: Runtime Configuration
In your app initialization, call:
```typescript
import { apiService } from '@/src/services/apiService';
apiService.setBaseUrl('http://your-api-endpoint.com');
```

### 3. Run the App

#### Using Expo CLI
```bash
npx expo start
```
Then press:
- `i` for iOS
- `a` for Android  
- `w` for web

#### Or use npm scripts
```bash
npm run ios     # iOS simulator
npm run android # Android emulator
npm run web     # Web browser
```

### 4. Test the Flow

1. **Home Screen**: You'll see the welcome page
2. **Get Started**: Click the button to go to Camera screen
3. **Capture Photo**: 
   - Take a photo using the camera button, OR
   - Upload from gallery
4. **Generate Recipe**: Click the green button to send photo to API
5. **View Recipe**: See the generated recipe with ingredients and steps

## 🔌 API Endpoint Requirements

Your API should have these two endpoints:

### Upload Photo (POST)
```
POST /api/recipes/generate
Content-Type: multipart/form-data

Request body:
- photo: <binary image file>

Response:
{
  "recipe_id": "12345",
  "id": "12345"
}
```

### Fetch Recipe (GET)
```
GET /api/recipes/{recipe_id}

Response:
{
  "name": "Recipe Name",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["step 1", "step 2", "step 3"]
}
```

## 📱 Device/Simulator Setup

### iOS Simulator
- Requires macOS and Xcode
- Photos will be fake/from simulator library
- Run with: `npm run ios`

### Android Emulator  
- Requires Android Studio
- Photos will be fake/from emulator library
- Run with: `npm run android`

### Physical Device
- Download Expo Go app from App Store or Google Play
- In terminal, run: `npx expo start`
- Scan QR code with Expo Go
- Camera will work with real device camera

### Web Browser
- Run with: `npm run web`
- Camera input will use browser's file upload
- Good for testing UI without real device

## 🎨 Customizing Theme

Edit `src/theme/colors.ts` to change colors:
```typescript
export const colors = {
  primary: '#2D6A4F',        // Change main green color
  primaryLight: '#52B788',   // Change light green
  accent: '#F4A460',         // Change accent color
  // ... more colors
};
```

## 🐛 Common Issues

### "Cannot find module" errors
Solution: Run `npm install` again or restart the dev server

### Camera permission denied
Solution: Grant camera permission in device settings

### API request timeout
Solution: 
- Check that API endpoint is correct
- Ensure API server is running and accessible
- Increase timeout in `src/utils/config.ts`

### Blank screen after startup
Solution:
- Check console for errors: `npm run ios` or `npm run android`
- Clear cache: `npx expo start --clear`
- Restart the dev server

## 📚 File Structure Reference

Key files you might need to edit:

```
src/
├── services/apiService.ts       # Edit API endpoints
├── theme/colors.ts             # Edit colors
├── theme/index.ts              # Edit spacing/typography
├── screens/HomeScreen.tsx       # Edit welcome text
├── screens/CameraScreen.tsx     # Edit camera UI
└── screens/RecipeScreen.tsx     # Edit recipe display
```

## 🔄 Development Workflow

1. **Make changes** to any file in `src/`
2. **Save** (Ctrl+S or Cmd+S)
3. **App auto-reloads** (watch for message in terminal)
4. **Test** in simulator/device

## 🎯 Next Steps

1. ✅ Run the app (`npm run ios` or equivalent)
2. ✅ Test the UI flow with sample images
3. ✅ Connect your API endpoint
4. ✅ Test the full recipe generation flow
5. ✅ Customize colors/branding if desired
6. ✅ Deploy for testing (see main README.md)

## 💡 Tips

- Use `console.log()` to debug - output appears in terminal
- Check device console for permission errors
- Use physical device for best camera experience
- Clear Expo cache with `--clear` flag if having issues

## 📞 Support

For issues:
1. Check console output for error messages
2. Verify API endpoint is accessible
3. Ensure all permissions are granted
4. Check the IMPLEMENTATION_GUIDE.md for detailed docs
