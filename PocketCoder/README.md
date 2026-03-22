# PocketCoder

## No cloud. No keys. No limits. Just you and your ideas.

PocketCoder is a local-first AI coding assistant that runs entirely on your device. No API keys, no cloud dependencies, no usage limits.

## Features

- **100% Local**: Runs LLM models directly on your device using llama.rn
- **Privacy First**: Your code and conversations never leave your device
- **No Limits**: Use as much as you want without worrying about quotas or costs
- **Offline Ready**: Works without an internet connection

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
cd PocketCoder
npm install
```

### Running the App

#### iOS
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Development Client
```bash
npm start
```

## Project Structure

```
PocketCoder/
├── src/
│   ├── screens/       # App screens
│   ├── components/    # Reusable UI components
│   ├── services/      # Business logic and API calls
│   ├── navigation/    # Navigation configuration
│   └── assets/        # Images, fonts, and other static files
├── App.js             # Main entry point
├── app.json           # Expo configuration
├── eas.json           # EAS Build configuration
└── package.json       # Dependencies and scripts
```

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and build tools
- **llama.rn** - Local LLM inference
- **React Navigation** - Navigation library
- **React Native Paper** - Material Design components

## License

MIT
