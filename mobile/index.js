import { registerRootComponent } from 'expo';

import App from './App';

// Uygulamanın giriş noktası: App'i kök bileşen olarak kaydeder; Expo Go'da da
// yerel derlemede de ortamı doğru kurar.
registerRootComponent(App);
