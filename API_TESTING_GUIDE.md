# 📝 API Response Examples

This file contains example JSON responses that your backend API should return.

## API Endpoint 1: Upload Photo & Generate Recipe

**Endpoint:** `POST /api/recipes/generate`

**Request:**
```
Content-Type: multipart/form-data

Form Fields:
- photo: <binary image file>
```

**Expected Response:**
```json
{
  "recipe_id": "recipe_12345",
  "id": "recipe_12345"
}
```

**Status:** 200 OK

---

## API Endpoint 2: Fetch Recipe Details

**Endpoint:** `GET /api/recipes/recipe_12345`

**Expected Response:**
```json
{
  "name": "Pasta Primavera",
  "ingredients": [
    "2 cups pasta",
    "1 cup broccoli florets",
    "2 cloves garlic, minced",
    "1/4 cup olive oil",
    "1/2 cup cherry tomatoes",
    "Salt and pepper to taste",
    "Fresh basil"
  ],
  "steps": [
    "Boil water in a large pot and add salt",
    "Cook pasta according to package directions",
    "Heat olive oil in a large pan over medium heat",
    "Add minced garlic and cook for 1 minute until fragrant",
    "Add broccoli and cook for 3-4 minutes until tender-crisp",
    "Add cherry tomatoes and cook for 1-2 minutes",
    "Drain cooked pasta and add to the vegetable mixture",
    "Toss everything together and season with salt and pepper",
    "Garnish with fresh basil before serving",
    "Enjoy your healthy and delicious meal!"
  ]
}
```

**Status:** 200 OK

---

## Error Response Examples

### Recipe Not Found

**Endpoint:** `GET /api/recipes/invalid_id`

**Response:**
```json
{
  "error": "Recipe not found",
  "message": "The requested recipe does not exist"
}
```

**Status:** 404 Not Found

---

### Invalid Image Upload

**Endpoint:** `POST /api/recipes/generate`

**Response:**
```json
{
  "error": "Invalid image",
  "message": "Please upload a valid image file (JPEG, PNG)"
}
```

**Status:** 400 Bad Request

---

### Server Error

**Endpoint:** `POST /api/recipes/generate`

**Response:**
```json
{
  "error": "Server error",
  "message": "An error occurred while processing your request. Please try again."
}
```

**Status:** 500 Internal Server Error

---

## Testing the API Integration

### Manual Testing Steps

1. **Start the app**
   ```bash
   npm run ios  # or android/web
   ```

2. **Navigate to Camera Screen**
   - Click "Get Started" on Home Screen

3. **Capture or Upload a Photo**
   - Take a photo with camera OR
   - Select from gallery

4. **Generate Recipe**
   - Click "Generate Recipe ✨" button
   - You should see a loading spinner
   - App will POST the photo to `/api/recipes/generate`

5. **Verify Recipe Display**
   - App will GET recipe from `/api/recipes/{recipe_id}`
   - Recipe should display with name, ingredients, and steps
   - You should be able to check off items

### Expected Network Calls

**Call 1:** Photo Upload
```
POST http://your-api-endpoint/api/recipes/generate
Content-Type: multipart/form-data
Body: [image file]

Response: { recipe_id: "...", id: "..." }
```

**Call 2:** Recipe Fetch
```
GET http://your-api-endpoint/api/recipes/{recipe_id}

Response: { name: "...", ingredients: [...], steps: [...] }
```

---

## Simulating the API Locally

If you don't have a backend yet, you can simulate it using these methods:

### Option 1: Use a Mock Server

Use [json-server](https://github.com/typicode/json-server) for quick testing:

```bash
npm install -g json-server
```

Create `db.json`:
```json
{
  "recipes": {
    "recipe_12345": {
      "name": "Pasta Primavera",
      "ingredients": ["pasta", "broccoli", "garlic"],
      "steps": ["Boil water", "Cook pasta", "Add vegetables"]
    }
  }
}
```

Run:
```bash
json-server --watch db.json
```

### Option 2: Use ngrok for Local Testing

If your backend is running locally:

```bash
# Install ngrok
brew install ngrok

# Expose local server
ngrok http 8000

# Use the URL from ngrok in .env.local
EXPO_PUBLIC_API_BASE_URL=https://xxxxx.ngrok.io
```

---

## Response Format Requirements

For the app to work correctly, ensure your API returns responses in this exact format:

### Success Response
```json
{
  "name": "string",
  "ingredients": ["string", "string", ...],
  "steps": ["string", "string", ...]
}
```

### Upload Response
```json
{
  "recipe_id": "string",
  "id": "string"
}
```

### Error Response
```json
{
  "message": "User-friendly error message"
}
```

---

## Testing Checklist

- ✅ POST request returns `recipe_id`
- ✅ GET request returns `name`, `ingredients`, `steps`
- ✅ Ingredients is an array of strings
- ✅ Steps is an array of strings
- ✅ Recipe names display correctly (no HTML encoding issues)
- ✅ Error messages are user-friendly
- ✅ Timeouts are handled (API takes max 30 seconds)
- ✅ Image upload works with JPEG/PNG
- ✅ Image size limits are enforced

---

## Common Issues & Solutions

**Issue:** "Cannot connect to API"
- Check `EXPO_PUBLIC_API_BASE_URL` in `.env.local`
- Verify API server is running
- For physical device, use your machine's IP (not localhost)

**Issue:** "Invalid recipe format"
- Ensure response has `name`, `ingredients`, `steps` fields
- `ingredients` and `steps` must be arrays
- All fields must be strings

**Issue:** "Recipe loading hangs"
- Check API timeout (default 30 seconds in `src/utils/config.ts`)
- Verify API returns response within timeout
- Check network connectivity

**Issue:** "Empty ingredients or steps list"
- Ensure API returns non-empty arrays
- Check if array items are being parsed correctly
- Verify JSON format is valid
