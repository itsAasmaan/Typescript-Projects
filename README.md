# Weather App 🌤️

A full-stack weather application with a **React frontend** and **Node.js backend**, built entirely with **TypeScript** for type safety and modern development practices.

![Weather App Demo](https://img.shields.io/badge/Status-Active-green) ![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🌟 Features

- **Real-time Weather Data**: Get current weather conditions for any city
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Type-Safe Development**: Built entirely with TypeScript
- **Modern Architecture**: Separate client and server with clean API design
- **Error Handling**: Graceful error handling for invalid locations or network issues

---

## 🛠️ Technologies Used

### Frontend (Client)
- **[React](https://react.dev/)** - Component-based UI library
- **[Vite](https://vitejs.dev/)** - Lightning-fast development server and bundler
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Modern styling

### Backend (Server)
- **[Node.js](https://nodejs.org/)** - JavaScript runtime environment
- **[Express.js](https://expressjs.com/)** - Lightweight web framework
- **TypeScript** - Type-safe server development
- **Weather API Integration** - External weather service provider

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/itsAasmaan/Weather-App.git
   cd Weather-App
   ```

2. **Set up the Server**
   ```bash
   cd server
   npm install
   ```
   
   Create a `.env` file in the server directory and add your weather API key:
   ```env
   WEATHER_API_KEY=your_api_key_here
   PORT=3000
   ```

3. **Set up the Client**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

You'll need to run both the server and client simultaneously:

#### Terminal 1 - Start the Server
```bash
cd server
npm run dev    # For development with auto-reload
# OR
npm run build && npm start    # For production
```

#### Terminal 2 - Start the Client
```bash
cd client
npm run dev
```

The application will be available at:
- **Client**: http://localhost:5173
- **Server**: http://localhost:3000

---

## 🔧 Available Scripts

### Server Scripts
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Clean build directory

### Client Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## 🌐 API Endpoints

### Weather Endpoints
- `GET /api/weather/:city` - Get current weather for a city
- `GET /api/weather/coordinates/:lat/:lon` - Get weather by coordinates

### Example Response
```json
{
  "city": "London",
  "temperature": 22,
  "description": "Partly cloudy",
  "humidity": 65,
  "windSpeed": 12,
  "icon": "partly-cloudy"
}
```

---

## 🔑 Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development


# Weather API Configuration
WEATHER_API_KEY=your_weather_api_key
WEATHER_API_URL=https://api.openweathermap.org/data/2.5

# CORS Configuration
CORS_ORIGIN= "http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Create a `.env` file in the client directory:

```env
# Server Configuration
BACKEND_WEATHER_API_URL = "http://localhost:3000"
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/YOUR_BRANCH_NAME`)
3. Commit your changes (`git commit -m 'Added featues'`)
4. Push to the branch (`git push origin feature/YOUR_BRANCH_NAME`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Akash Singh** - [GitHub Profile](https://github.com/itsAasmaan)

---

*Built with ❤️ and TypeScript*